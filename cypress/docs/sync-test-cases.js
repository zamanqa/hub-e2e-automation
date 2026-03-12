#!/usr/bin/env node
/**
 * sync-test-cases.js
 *
 * Automatically keeps TEST_CASES.html in sync with the Cypress test suite.
 *
 * What it does:
 *   • Scans all *.cy.js files under cypress/e2e/
 *   • Compares it() blocks found on disk with the TABS array in the HTML
 *   • Appends new tests to existing files in the TABS array
 *   • Creates new file entries for brand-new test files
 *   • Never removes or overwrites existing test entries (preserves descriptions)
 *
 * Usage:
 *   node cypress/docs/sync-test-cases.js
 *   npm run sync-docs
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ── Paths ────────────────────────────────────────────────────────────────────
const ROOT      = path.join(__dirname, '..', '..');
const HTML_FILE = path.join(__dirname, 'TEST_CASES.html');
const E2E_DIR   = path.join(ROOT, 'cypress', 'e2e');

// ── Tab → folder mapping (order must match the TABS array in HTML) ──────────
const TAB_MAP = [
  { id: 'orders',        folder: '01-order-page'        },
  { id: 'subscriptions', folder: '02-subscription-page' },
  { id: 'cron',          folder: '03-cron'              },
  { id: 'invoices',      folder: '04-invoice-page'      },
  { id: 'repair-return', folder: '05-repair-and-return' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Extract all it('…') titles from a test file (handles ', ", ` delimiters). */
function extractItTitles(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  const re  = /\bit\s*\(\s*(['"`])([\s\S]*?)\1\s*,/g;
  const out = [];
  let m;
  while ((m = re.exec(src)) !== null) out.push(m[2].trim());
  return out;
}

/** Check if a test file uses cy.task('queryDb') — means DB-verified. */
function usesDbQuery(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  return src.includes("cy.task('queryDb'") || src.includes('cy.task("queryDb"');
}

/** Escape a string for safe inclusion in a JS string (single quotes). */
function escJs(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

// ── Main ─────────────────────────────────────────────────────────────────────

function sync() {
  if (!fs.existsSync(HTML_FILE)) {
    console.error(`❌ Cannot find ${HTML_FILE}`);
    process.exit(1);
  }

  let html    = fs.readFileSync(HTML_FILE, 'utf8');
  let changed = false;
  let added   = 0;

  // Find the TABS array in the HTML
  const tabsStart = html.indexOf('const TABS = [');
  if (tabsStart === -1) {
    console.error('❌ Could not find "const TABS = [" in HTML');
    process.exit(1);
  }

  // Find the matching closing bracket by counting braces
  let depth = 0;
  let tabsEnd = -1;
  for (let i = tabsStart + 'const TABS = '.length; i < html.length; i++) {
    if (html[i] === '[') depth++;
    if (html[i] === ']') { depth--; if (depth === 0) { tabsEnd = i + 1; break; } }
  }
  if (tabsEnd === -1) {
    console.error('❌ Could not find end of TABS array');
    process.exit(1);
  }

  // Extract and parse the TABS array
  const tabsSource = html.slice(tabsStart + 'const TABS = '.length, tabsEnd);
  let tabs;
  try {
    // Eval is safe here — we control the source file
    tabs = eval(tabsSource);
  } catch (e) {
    console.error('❌ Could not parse TABS array:', e.message);
    process.exit(1);
  }

  // Process each tab
  for (const tabDef of TAB_MAP) {
    const folderPath = path.join(E2E_DIR, tabDef.folder);
    if (!fs.existsSync(folderPath)) continue;

    const tab = tabs.find(t => t.id === tabDef.id);
    if (!tab) {
      console.warn(`  ⚠  Tab "${tabDef.id}" not found in TABS array — skipping`);
      continue;
    }

    // All .cy.js files in this folder
    const diskFiles = fs.readdirSync(folderPath)
      .filter(f => f.endsWith('.cy.js'))
      .sort();

    for (const fileName of diskFiles) {
      const filePath = path.join(folderPath, fileName);
      const specPath = `cypress/e2e/${tabDef.folder}/${fileName}`;
      const displayName = `${tabDef.folder}/${fileName}`;
      const titles   = extractItTitles(filePath);
      const hasDb    = usesDbQuery(filePath);

      // Find existing file entry in TABS
      const existingFile = tab.files.find(f => f.spec === specPath);

      if (!existingFile) {
        // ── Brand-new file — add entire entry ──
        tab.files.push({
          name: displayName,
          spec: specPath,
          tests: titles.map(t => ({ title: t, db: hasDb })),
        });
        changed = true;
        added += titles.length;
        console.log(`  + New file: ${displayName}  (${titles.length} tests)`);
        continue;
      }

      // ── Existing file — check for new it() blocks ──
      // Use fuzzy matching: a disk title matches an existing title if either
      // contains the other (case-insensitive), after stripping "Test N:" prefix
      // and "should " prefix for comparison.
      function normalizeTitle(t) {
        let s = (t || '').trim().toLowerCase();
        s = s.replace(/^test\s+\d+[a-z]?:\s*/i, '');  // strip "Test 1: ", "Test 5a: "
        s = s.replace(/^\d+\.\s*/, '');                  // strip "1. "
        s = s.replace(/^should\s+/, '');                  // strip "should "
        return s;
      }

      function extractWords(s) {
        return s.replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/).filter(w => w.length > 2);
      }

      function titleMatches(diskTitle, existingTitle) {
        const a = normalizeTitle(diskTitle);
        const b = normalizeTitle(existingTitle);
        // Exact match
        if (a === b) return true;
        // Substring match
        if (a.includes(b) || b.includes(a)) return true;
        // Word overlap: if 60%+ of words in the shorter title appear in the longer one
        const wordsA = extractWords(a);
        const wordsB = extractWords(b);
        const shorter = wordsA.length <= wordsB.length ? wordsA : wordsB;
        const longer  = wordsA.length <= wordsB.length ? wordsB : wordsA;
        if (shorter.length === 0) return false;
        const overlap = shorter.filter(w => longer.includes(w)).length;
        if (overlap / shorter.length >= 0.6) return true;
        return false;
      }

      const newTitles = titles.filter(diskTitle => {
        return !existingFile.tests.some(et => titleMatches(diskTitle, et.title));
      });

      if (newTitles.length > 0) {
        newTitles.forEach(t => {
          existingFile.tests.push({ title: t, db: hasDb });
        });
        changed = true;
        added += newTitles.length;
        console.log(`  + ${displayName}: +${newTitles.length} new test(s) (${existingFile.tests.length - newTitles.length} → ${existingFile.tests.length})`);
      } else {
        console.log(`  ✓ ${displayName}: ${existingFile.tests.length} tests — up to date`);
      }
    }
  }

  if (changed) {
    // Rebuild the TABS array source
    const newTabsSource = buildTabsSource(tabs);
    const newHtml = html.slice(0, tabsStart) + 'const TABS = ' + newTabsSource + html.slice(tabsEnd);

    fs.writeFileSync(HTML_FILE, newHtml, 'utf8');
    console.log(`\n✅  TEST_CASES.html updated — ${added} new test case(s) added`);
  } else {
    console.log('\n✅  TEST_CASES.html is already up to date — no changes needed');
  }
}

/** Rebuild the TABS array as formatted JavaScript source. */
function buildTabsSource(tabs) {
  let out = '[\n';
  tabs.forEach((tab, tIdx) => {
    out += '  {\n';
    out += `    id: '${escJs(tab.id)}',\n`;
    out += `    label: '${escJs(tab.label)}',\n`;
    out += `    num: '${escJs(tab.num)}',\n`;
    out += '    files: [\n';
    tab.files.forEach((file, fIdx) => {
      out += '      {\n';
      out += `        name: '${escJs(file.name)}',\n`;
      out += `        spec: '${escJs(file.spec)}',\n`;
      out += '        tests: [\n';
      file.tests.forEach((test, testIdx) => {
        out += `          { title: '${escJs(test.title)}', db: ${test.db ? 'true' : 'false'} },\n`;
      });
      out += '        ]\n';
      out += '      },\n';
    });
    out += '    ]\n';
    out += '  },\n';
  });
  out += ']';
  return out;
}

// ── Run ───────────────────────────────────────────────────────────────────────
console.log('🔄  Syncing TEST_CASES.html with Cypress test files…\n');
try {
  sync();
} catch (err) {
  console.error('❌  Sync failed:', err.message);
  console.error(err.stack);
  process.exit(1);
}
