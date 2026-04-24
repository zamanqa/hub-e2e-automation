---
description: Generate comprehensive E2E test cases in tabular format including normal, edge, boundary, and negative tests with Smoke/Regression/Sanity tags.
---

Generate E2E test cases for $ARGUMENTS in tabular format.

**Columns:** TC-ID | Test Type | Action | Input | Expected Output | Priority (P1/P2/P3) | Tag (Smoke/Sanity/Regression) | Notes

**Include:**
- Normal / happy path scenarios
- Edge cases and boundary conditions (min, max, min-1, max+1)
- Negative tests (invalid input, missing fields, wrong type)
- DB validation scenarios where applicable

**Rules:**
- Group repetitive steps — no redundant rows
- P1 = business-critical, P2 = important, P3 = nice-to-have
- Smoke = must-pass before any testing (max 5-10 cases)
- Sanity = impacted area validation
- Regression = full coverage

**At the end, flag:**
1. High-risk scenarios (data loss, payment, auth)
2. Recommended automation candidates (repetitive, deterministic)
