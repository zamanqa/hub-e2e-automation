---
description: Generate GitHub Actions YAML for Cypress tests with parallelization, Mochawesome reports, artifact upload, and Slack/Linear notifications.
---

Generate a GitHub Actions workflow YAML for $ARGUMENTS.

**Include:**

```yaml
# Triggers
on:
  push:
    branches: [main, development]
  pull_request:
  workflow_dispatch:
    inputs:
      spec:
        description: 'Spec pattern (e.g. cypress/e2e/01-order-page/**)'
        default: 'cypress/e2e/**/*.cy.js'
```

**Steps to include (with inline comments):**
1. Checkout + Node.js setup with caching (`~/.npm`, `~/.cache/Cypress`)
2. `npm ci` — clean install
3. Environment variables from GitHub Secrets (BASE_URL, PG_*, TEST_USER_*)
4. Cypress run with `--browser chrome` and `--reporter cypress-mochawesome-reporter`
5. Mochawesome HTML report generation (`marge`)
6. Upload HTML report as artifact (always, even on failure)
7. Upload screenshots/videos on failure
8. Notification: post pass/fail summary to Slack webhook

**For this project's secrets needed:**
`BASE_URL`, `TEST_USER_EMAIL`, `TEST_USER_PASSWORD`, `PG_USER`, `PG_PASSWORD`, `PG_HOST`, `PG_DATABASE`, `CYPRESS_RECORD_KEY`, `SLACK_WEBHOOK_URL`

Output the complete `.github/workflows/e2e.yml` file.
