# Claude Setup Guide — E2E Test Cases Dashboard

> **Purpose:** This file instructs Claude how to build the exact same test-cases dashboard system in a new Cypress project from scratch. Hand this file to Claude at the start of a new project session.

---

## What You Are Building

A local web dashboard for Cypress test projects with these capabilities:

1. **TEST_CASES.html** — a self-contained dashboard that lists every spec file and test case in an accordion UI with pass/fail status badges
2. **sync-server.js** — a Node.js HTTP server (no Express) running on a fixed local port that:
   - Serves the HTML file statically
   - Triggers Cypress runs and streams output live via Server-Sent Events (SSE)
   - Reads mochawesome report output after each run
   - Persists run history as JSON files
3. **sync-test-cases.js** — a script that reads all `cypress/e2e/**/*.cy.js` files and regenerates the accordion list in `TEST_CASES.html`

All three files live in `cypress/docs/`.

---

## Step 0 — Understand the target project

Before writing any code, read:
- `package.json` — confirm Cypress version, check if `cypress-mochawesome-reporter` is installed
- `cypress.config.js` — find `baseUrl`, any `env` keys, and the reporter configuration
- `cypress/e2e/` — understand the folder structure and how test files are named
- `.env.example` or `.env` — understand which env vars exist
- One sample `*.cy.js` file — confirm tests follow the `it('Test N: description', ...)` naming convention (Test 1, Test 2, etc.)

---

## Step 1 — Install required packages

The sync server requires no new npm packages — it uses only Node.js built-ins (`http`, `fs`, `path`, `child_process`).

The HTML dashboard requires mochawesome output. Confirm `cypress-mochawesome-reporter` is installed:

```bash
npm install --save-dev cypress-mochawesome-reporter mochawesome mochawesome-merge mochawesome-report-generator
```

Add to `cypress.config.js` if not already there:

```js
reporter: 'cypress-mochawesome-reporter',
reporterOptions: {
  reportDir: 'cypress/reports/html',
  overwrite: false,
  html: true,
  json: true,
},
```

---

## Step 2 — Create `cypress/docs/` folder and three files

### File A: `sync-server.js`

A Node.js HTTP server. Key requirements:

**Constants to set for the new project:**
```js
const PORT        = 7357;                        // fixed port — change only if conflicting
const ROOT        = path.join(__dirname, '..', '..');  // project root (two levels up from cypress/docs/)
const SYNC_SCRIPT = path.join(__dirname, 'sync-test-cases.js');
const REPORT_HTML = path.join(ROOT, 'cypress', 'reports', 'html', 'index.html');
const HISTORY_DIR = path.join(__dirname, 'run-history');
```

**If port 7357 may already be in use**, use this helper at the top of `sync-server.js` to find a free port automatically and print it to the console so the user knows where to open the browser:

```js
const net = require('net');

function findFreePort(startPort) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(startPort, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(findFreePort(startPort + 1)); // try next port
      } else {
        reject(err);
      }
    });
  });
}

// Replace the static listen() call with:
findFreePort(7357).then(port => {
  http.createServer(handleRequest).listen(port, '127.0.0.1', () => {
    console.log(`\n  Sync server running at  http://127.0.0.1:${port}/TEST_CASES.html\n`);
    console.log(`  SYNC_PORT = ${port}  (update TEST_CASES.html if this is not 7357)`);
  });
});
```

> **Note for Claude:** If you use the auto-detect approach, also check `TEST_CASES.html`'s `SYNC_PORT` constant. The two values must always match. The simplest approach is to keep the preferred port at `7357` and only use `findFreePort` if the user reports a startup error. Document the matched port clearly in the console output.

**Endpoints the server must expose:**

| Route | Method | Behaviour |
|-------|--------|-----------|
| `/ping` | GET | Return `{ ok: true }` — used by dashboard health indicator |
| `/sync` | GET | Spawn `node SYNC_SCRIPT`, return stdout — dashboard reloads after |
| `/run?spec=<path>` | GET | Spawn `cypress run --browser chrome --headed --spec <path>`, stream stdout line-by-line as SSE events. Each line becomes `data: <JSON>\n\n`. Parse for `spec-done` and `done` signals |
| `/reports` | GET | List `HISTORY_DIR/*.json`, return array of `{ file, label, spec, time, passes, failures, total }` |
| `/reports/get?file=<name>` | GET | Read one JSON from `HISTORY_DIR/`, return full content including `detail` key |
| `/<filename>` | GET | Serve static files from `cypress/docs/` (for `TEST_CASES.html` etc.) |

**SSE event format the HTML expects:**
```js
// Sent during /run streaming:
send({ status: 'running',   line: '<raw stdout line>' });
send({ status: 'spec-done', file: currentSpec, pass: N, fail: N, specTotal: N, specPasses: N, specFailures: N });
send({ status: 'done',      passes: [...], failures: [...], stats: {...}, label: 'specName', time: '0m 12s' });
send({ status: 'error',     message: '...' });
```

**After a run completes**, read `REPORT_HTML`, extract JSON from `data-raw="…"` attribute, parse mochawesome output, save to `HISTORY_DIR/<timestamp>_<specname>.json`:
```js
{
  spec:     'path/to/spec.cy.js',
  label:    'specname.cy.js',
  time:     '0m 12s',
  passes:   N,        // scalar count (fallback: specPasses if mochawesome empty)
  failures: N,        // scalar count (fallback: specFailures if mochawesome empty)
  total:    N,
  detail: {
    passes:   [...],  // mochawesome pass objects
    failures: [...],  // mochawesome failure objects
    stats:    {...},
  }
}
```

**Important fallback:** When mochawesome data is unavailable (Cypress fails before generating report), use the `specPasses`/`specFailures` counts accumulated from `spec-done` events:
```js
const histPasses   = report.passes.length   || specPasses   || 0;
const histFailures = report.failures.length || specFailures || 0;
```

**CORS header** — add to every response so the HTML (even when opened as a file) can reach the server:
```js
res.setHeader('Access-Control-Allow-Origin', '*');
```

---

### File B: `sync-test-cases.js`

A script that reads spec files and writes `TEST_CASES.html`.

**Algorithm:**
1. `glob` (or `fs.readdirSync` recursively) all `cypress/e2e/**/*.cy.js` files
2. For each file, read the source and extract `it('Test N: description', ...)` titles using a regex like `/it\(['"`]([^'"``]+)['"`]/g`
3. Group files by their parent folder (e.g. `01-order-page/`)
4. Build an HTML string for each spec as an `<div class="acc-section" data-spec="<relative/path/to/spec.cy.js">` accordion containing a `<tbody>` with one `<tr>` per test case
5. Each row must have:
   - A status badge: `<span class="status-badge not-run" onclick="cycleStatus('<unique-key>')">`
   - The test title
   - A unique key derived from the spec path + test index (used for localStorage)
6. Write the complete `TEST_CASES.html` with the generated accordion injected between two marker comments: `<!-- GENERATED_START -->` and `<!-- GENERATED_END -->`

**Status badge unique key format:**
```
<specFolder>_<specFileName>_<testIndex>
// e.g. "01-order-page_orderDetail.cy.js_0"
```

**Important:** The `data-spec` attribute on each section must exactly match the relative path that Cypress reports in the `spec-done` event (e.g. `cypress/e2e/01-order-page/orderDetail.cy.js`). Normalise backslashes to forward slashes.

---

### File C: `TEST_CASES.html`

A single self-contained HTML file with inline CSS and JS. **Do not use external CDNs** — everything must work offline (the file is served locally).

#### Key HTML structure:
```html
<div class="header">         <!-- title bar with Sync and server status indicator -->
<div class="tab-bar">        <!-- tabs: Test Cases | Reports | Settings -->
<div id="last-report-bar">   <!-- thin bar: "Last run: X · ✓ N passed" + View Report btn -->
<div class="content">
  <div id="tab-test-cases">  <!-- accordion of spec sections -->
  <div id="tab-reports">     <!-- run history list -->
  <div id="tab-settings">    <!-- settings (future use) -->
<div id="report-overlay">    <!-- full-screen report modal -->
<div class="progress-panel"> <!-- fixed bottom bar: progress bar + live counters -->
<div class="run-drawer">     <!-- collapsible live log output -->
```

#### Critical JS variables:
```js
const SYNC_PORT = 7357;      // must match sync-server.js PORT
let _report     = null;      // current report object { passes, failures, stats, spec, label, time }
let _ppPass     = 0;         // running pass count during a test run
let _ppFail     = 0;         // running fail count during a test run
```

#### Functions the HTML must implement:

**`restoreStatuses()`** — on `DOMContentLoaded`, read each `status_<key>` from localStorage and apply the saved badge class (pass/fail/not-run).

**`cycleStatus(key)`** — manual status toggle: not-run → pass → fail → not-run, saved to localStorage.

**`applySpecDoneToBadges(specFile, passCount, failCount)`** — called on each `spec-done` SSE event. Finds the accordion section matching `specFile`, then:
- If `failCount === 0 && passCount > 0`: marks ALL rows as `pass`, saves to localStorage
- If `passCount === 0 && failCount > 0`: marks ALL rows as `fail`, saves to localStorage
- Mixed result: skip — let mochawesome handle individual test matching

**`applyRunResultsToStatuses(passes, failures)`** — called on `done` SSE event with mochawesome data. Matches each pass/fail by extracting the test number from `fullTitle` (regex: `/\bTest\s+(\d+)\b/i`) and updating the corresponding badge row.

**`openReport()` / `closeReport()`** — shows/hides `#report-overlay`. Builds the report body from `_report.passes` and `_report.failures`.

**`viewHistoryReport(file)`** — fetches a saved report JSON, temporarily sets `_report`, `_ppPass`, `_ppFail` from history data, calls `openReport()`. Restores previous values when modal closes.

**`showLastReportBar(label, ppPass, ppFail, time)`** — makes `#last-report-bar` visible with run summary.

**`downloadReportPdf()`** — expands all collapsed sections, calls `window.print()`, then restores state.

**`startRun(specPath)`** — opens an `EventSource` to `/run?spec=<path>`, wires up `onmessage` to dispatch each event to the appropriate handler.

#### SSE event handling in `startRun`:
```js
const es = new EventSource(`http://127.0.0.1:${SYNC_PORT}/run?spec=${encodeURIComponent(spec)}`);
es.onmessage = ({ data }) => {
  const d = JSON.parse(data);
  if (d.status === 'running')   appendLog(d.line);
  if (d.status === 'spec-done') {
    _ppSetTotal(d.specTotal);
    for (let i = 0; i < d.pass; i++) _ppAddResult(true);
    for (let i = 0; i < d.fail; i++) _ppAddResult(false);
    applySpecDoneToBadges(d.file, d.pass, d.fail);
  }
  if (d.status === 'done') {
    _report = { passes: d.passes, failures: d.failures, stats: d.stats,
                spec: d.spec, label: d.label, time: d.time };
    applyRunResultsToStatuses(d.passes, d.failures);
    localStorage.setItem('last_report', JSON.stringify({ ..._report, ppPass: _ppPass, ppFail: _ppFail }));
    showLastReportBar(_report.label, _ppPass, _ppFail, _report.time);
    es.close();
  }
};
```

#### localStorage keys:
| Key | Value | Purpose |
|-----|-------|---------|
| `status_<key>` | `'pass'` \| `'fail'` \| `'not-run'` | Per-badge status, restored on load |
| `last_report` | JSON string | Full report + ppPass/ppFail, restored on load |

#### `@media print` CSS (critical — must be exact):
```css
@media print {
  body > * { display: none !important; }               /* hide everything */
  #report-overlay {                                      /* show report by ID (high specificity) */
    display: block !important;
    position: static !important;
    background: none !important;
    padding: 0 !important;
    overflow: visible !important;
  }
  .report-panel { width: 100% !important; max-width: 100% !important; box-shadow: none !important; }
  .report-close, .btn-pdf-download, .report-fail-toggle { display: none !important; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
}
```

> ⚠️ **Do NOT use `.report-overlay` (class selector) here.** Use `#report-overlay` (ID selector). If you use a class selector, a `body > *` rule with higher specificity will hide the report and produce a blank PDF.

---

## Step 3 — Add npm scripts to `package.json`

```json
"scripts": {
  "sync-docs":   "node cypress/docs/sync-test-cases.js",
  "sync-server": "node cypress/docs/sync-server.js"
}
```

---

## Step 4 — Create `run-history/` directory

```bash
mkdir cypress/docs/run-history
```

Add a `.gitkeep` file inside if you want git to track the folder but not the run files:

```bash
echo "" > cypress/docs/run-history/.gitkeep
```

Add to `.gitignore`:
```
cypress/docs/run-history/*.json
```

---

## Step 5 — Initial sync

With the sync server running:
```bash
npm run sync-server
```

In a second terminal:
```bash
npm run sync-docs
```

Or click **"⟳ Sync"** in the dashboard at `http://127.0.0.1:7357/TEST_CASES.html`.

---

## Step 6 — Verify end-to-end

1. Open `http://127.0.0.1:7357/TEST_CASES.html`
2. Server indicator should be **green**
3. Accordion shows all spec files and their test cases
4. Click ▶ Run on one spec — progress bar increments, log drawer shows Cypress output
5. After run — badges update to Pass/Fail, "Last run" bar appears
6. Refresh page — badges and "Last run" bar still show (restored from localStorage)
7. Click "📊 View Report" — report modal opens with correct counts
8. Click "⬇ Download PDF" — print preview shows the report (not blank)
9. Click "Reports" tab — run history entry appears; clicking "View" reopens the report

---

## Known Gotchas

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| Blank PDF | `@media print` uses class selector instead of `#report-overlay` ID | Always use `#report-overlay { display: block !important }` in print CSS |
| Badges not updating | `data-spec` attribute doesn't match the path Cypress reports | Normalise backslashes; compare against SSE `spec-done` `file` field |
| Report shows 0 counts | mochawesome file not generated (Cypress error before finish) | Use `specPasses`/`specFailures` fallback from SSE events |
| "Could not load report" | Sync server not running | `npm run sync-server` |
| Mixed pass/fail badges wrong | `applySpecDoneToBadges` skips mixed specs | Ensure mochawesome configured correctly; restart server to pick up new report |
| Test names not matched | Tests don't follow `it('Test N: ...')` format | Either use `Test N:` prefix, or update `extractNum()` regex to match your naming convention |

---

## Adapting for a Different Project

When building this for a new project, adjust:

1. **`sync-server.js`** — update `ROOT` if your project structure differs from the standard Cypress layout
2. **`sync-test-cases.js`** — update the glob pattern if spec files live in a non-standard location
3. **`cypress.config.js`** — ensure `cypress-mochawesome-reporter` outputs to `cypress/reports/html/`
4. **Test naming** — if tests don't use `it('Test N: ...')`, update `extractNum()` in `TEST_CASES.html` to match your naming convention
5. **Port** — if 7357 conflicts:
   - **Quick fix:** change `const PORT = 7357` in `sync-server.js` and `const SYNC_PORT = 7357` in `TEST_CASES.html` to the same free port number (both must always match)
   - **Auto-detect:** use the `findFreePort()` helper in `sync-server.js` (see Step 2 above) — but print the resolved port clearly to the console so the user knows the URL to open
   - **Check if port is taken (Windows):** `netstat -ano | findstr :7357`
   - **Check if port is taken (macOS/Linux):** `lsof -i :7357`

The three files in `cypress/docs/` are fully self-contained — copy them as a unit and update the constants above.
