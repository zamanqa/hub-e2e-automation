---
description: Generate or fix Mochawesome reporter setup for Cypress including merge config for parallel runs, npm scripts, and GitHub Actions artifact step.
---

Generate Mochawesome reporter configuration for $ARGUMENTS.

**This project already uses `cypress-mochawesome-reporter`. Output any missing pieces:**

**Installation (if needed):**
```bash
npm install --save-dev cypress-mochawesome-reporter mochawesome-merge mochawesome-report-generator
```

**cypress.config.js (already configured — verify):**
```js
reporter: "cypress-mochawesome-reporter",
setupNodeEvents(on, config) {
  require("cypress-mochawesome-reporter/plugin")(on);
}
```

**Merge parallel shard reports:**
```bash
npx mochawesome-merge cypress/reports/json/*.json -o cypress/reports/merged.json
npx marge cypress/reports/merged.json --reportDir cypress/reports/html --inline
```

**package.json scripts:**
```json
{
  "report:merge": "mochawesome-merge cypress/reports/json/*.json -o cypress/reports/merged.json",
  "report:generate": "marge cypress/reports/merged.json --reportDir cypress/reports/html --inline",
  "report": "npm run report:merge && npm run report:generate"
}
```

**GitHub Actions — upload HTML report:**
```yaml
- name: Upload Mochawesome Report
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: mochawesome-report
    path: cypress/reports/html/
    retention-days: 7
```
