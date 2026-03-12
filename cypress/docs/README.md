# Circuly Hub E2E — Test Cases Dashboard

A local web dashboard for browsing, running, and reporting on Cypress test cases — no Cypress Cloud needed. Powered by a lightweight Node.js sync server that streams live output and persists run history.

---

## What You Get

| Feature | Description |
|---------|-------------|
| **Test Case Browser** | Every spec file and test case listed in an accordion, with status badges |
| **Run from UI** | Click "▶ Run" on any spec to trigger Cypress in Chrome with live progress |
| **Live Progress Bar** | Real-time pass/fail counter streamed as tests execute |
| **Last Run Status** | Each test row shows ✓ Pass / ✗ Fail after a run — persists across refresh |
| **Run Reports** | Per-run report modal with pass/fail detail, error stacks, and timing |
| **Report History** | Every run is saved; browse and re-open past reports from the Reports tab |
| **Download PDF** | Print any open report to PDF from the report modal |
| **Persist Across Refresh** | Last report and last-run badges survive a page reload via localStorage |

---

## Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- A Cypress project with test files under `cypress/e2e/`
- PostgreSQL database access (credentials go in `.env`)

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
BASE_URL=https://your-app.example.com/
LOGIN_URL=https://your-app.example.com/en/auth/login
TEST_USER_EMAIL=your@email.com
TEST_USER_PASSWORD=your-password

# PostgreSQL (used by cy.task('queryDb', ...))
PG_USER=your_pg_user
PG_PASSWORD=your_pg_password
PG_HOST=your-db-host.rds.amazonaws.com
PG_DATABASE=postgres
PG_PORT=5432

# Cypress Cloud (optional — for recording)
CYPRESS_RECORD_KEY=your-record-key
```

### 3. Start the sync server

```bash
npm run sync-server
```

This starts a local HTTP server on **port 7357** (`http://127.0.0.1:7357`). Keep this terminal open while using the dashboard.

#### Port already in use?

Check whether 7357 is taken before starting:

```bash
# Windows
netstat -ano | findstr :7357

# macOS / Linux
lsof -i :7357
```

If it's occupied, pick any free port (e.g. `7358`) and update **two** places:

| File | What to change |
|------|---------------|
| `cypress/docs/sync-server.js` | `const PORT = 7358;` (line 1) |
| `cypress/docs/TEST_CASES.html` | `const SYNC_PORT = 7358;` (near top of `<script>`) |

Both values must match. Then restart the server and open `http://127.0.0.1:7358/TEST_CASES.html`.

### 4. Open the dashboard

Navigate to in your browser:

```
http://127.0.0.1:7357/TEST_CASES.html
```

The server indicator in the top-right corner will turn **green** when the sync server is reachable.

---

## Daily Usage

### Sync test cases (after adding or renaming tests)

Click **"⟳ Sync"** in the dashboard toolbar, or run:

```bash
npm run sync-docs
```

This reads all `cypress/e2e/**/*.cy.js` files and rebuilds the accordion list in `TEST_CASES.html`.

### Run a spec from the dashboard

1. Find the spec in the accordion (e.g. `01-order-page/orderDetail.cy.js`)
2. Click **"▶ Run"** on the spec header
3. Watch the live progress bar count pass/fail results
4. When done, the **Last Run Status** badges on each test row update automatically
5. Click **"📊 View Report"** in the bar that appears below the toolbar to open the full report

### Run tests from the command line

```bash
# All tests, headless Chrome
npm run allHubTestHeadless

# All tests, headed Chrome (browser window visible)
npm run allHubTestHead

# Run and record to Cypress Cloud
npm run cy:run:chrome

# One spec folder only
npm run oneCase
```

### Download a report as PDF

1. Open a report (either after a run or from Report History)
2. Click **"⬇ Download PDF"** in the report header
3. Use your browser's print-to-PDF (Ctrl+P / Cmd+P) — the UI hides everything except the report panel

---

## File Structure

```
cypress/
├── docs/
│   ├── TEST_CASES.html       ← Dashboard UI (auto-generated, do not edit by hand)
│   ├── sync-server.js        ← Local HTTP server (port 7357)
│   ├── sync-test-cases.js    ← Regenerates TEST_CASES.html from your spec files
│   ├── run-history/          ← JSON file per run, used by Report History tab
│   ├── README.md             ← This file
│   └── CLAUDE_SETUP_GUIDE.md ← Instructions for Claude to recreate this in a new project
├── e2e/
│   └── **/*.cy.js            ← Your Cypress test files
├── reports/
│   └── html/index.html       ← Mochawesome output (read by sync-server after each run)
└── support/
    └── ...
```

---

## Server Endpoints (for reference)

The sync server (`npm run sync-server`) exposes these local-only endpoints:

| Endpoint | What it does |
|----------|-------------|
| `GET /ping` | Health check — dashboard uses this to show the green/red indicator |
| `GET /sync` | Runs `sync-test-cases.js` and returns output |
| `GET /run?spec=<path>` | Streams Cypress run output via Server-Sent Events |
| `GET /reports` | Returns list of saved run-history JSON files |
| `GET /reports/get?file=<name>` | Returns the full detail of one saved report |
| `POST /reports/delete` | Deletes selected report files |

All endpoints are bound to `127.0.0.1` only — not accessible from other machines.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Red server indicator | Run `npm run sync-server` in a terminal |
| Server won't start — "address already in use" | Port 7357 is taken; see **Port already in use?** section above for how to switch ports |
| "Could not load report" | Server stopped — restart with `npm run sync-server` |
| Test badges still show "Not Run" after a run | Check that the spec file name in the accordion matches the file path Cypress reports |
| "Detailed test names unavailable" in report | Restart the sync server (picks up mochawesome output on next run) |
| Blank PDF when downloading | Ensure the report modal is open before clicking "⬇ Download PDF" |
| Tests fail on login | Check `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` in `.env` |
| DB tasks fail | Verify `PG_HOST`, `PG_USER`, `PG_PASSWORD`, `PG_DATABASE` in `.env` |

---

## Tech Stack

- **Cypress** v13 — test runner
- **cypress-mochawesome-reporter** — generates `cypress/reports/html/index.html`
- **Node.js HTTP module** — sync server (no Express dependency)
- **Server-Sent Events** — live streaming of test output to the dashboard
- **localStorage** — badge statuses and last report persist across refresh
