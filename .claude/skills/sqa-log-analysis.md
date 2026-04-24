---
description: Analyze Cypress test run logs and console output. Returns structured error summary with root cause identification and fix suggestions.
---

Analyze the following logs for $ARGUMENTS:

**Input:** paste console logs / Cypress output / server logs below.

**Output format:**

**1. Summary Table**
| Error Type | Frequency | Affected Test | Severity |
|---|---|---|---|

**2. Critical Errors**
- Stack trace snippet
- Root cause (if detectable)
- Suggested fix

**3. Warnings** — grouped and summarised

**4. Flaky Test Indicators**
- Timeouts and race conditions
- Selector issues (element not found, detached DOM)
- Session / auth cache misses

**5. Performance Flags**
- Response times > 15000ms (project timeout)
- Slow assertions or excessive `cy.wait(ms)` usage

**Rules:**
- Group repeated messages — no line-by-line repetition
- Prioritise: Critical → Major → Minor → Warning
- For each critical error provide a one-line fix recommendation
