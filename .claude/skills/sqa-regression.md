---
description: Prioritize test cases into Smoke, Sanity, and Full Regression suites based on release changes or sprint features. Flags high-risk and flaky tests.
---

Given $ARGUMENTS (release notes / changed modules / sprint feature list), categorize test cases into regression suites.

**Suites:**

| Suite | Scope | Target Runtime | When to Run |
|---|---|---|---|
| Smoke | 5-10 critical-path tests | < 10 min | Before any further testing, every deploy |
| Sanity | Impacted area + related flows | 20-30 min | After a fix/change, before regression |
| Full Regression | Complete coverage | All tests | Pre-release, scheduled nightly |

**Output table:**
| TC-ID | Scenario | Suite | Justification | Risk Level |
|---|---|---|---|---|

**Also flag:**
1. **High-risk areas** — payment, auth, data mutation
2. **Cross-feature dependencies** — tests that could break due to unrelated changes
3. **Known flaky tests** — timing-sensitive, session-dependent
4. **Parallel execution groupings** — suggest split for GitHub Actions matrix

**For this project's test files:**
- Orders, Subscriptions, Cron, Invoices, Repair & Return
- DB-verified tests (marked `db: true`) are higher risk — prioritise in Smoke/Sanity
