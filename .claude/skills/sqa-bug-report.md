---
description: Generate a structured Linear-ready bug report from a failed test output or observed defect description.
---

Generate a bug report for $ARGUMENTS.

**Output (Linear-ready format):**

---
**Title:** [concise, action-oriented — verb + object + symptom]

**Environment:**
- Env: QA / Staging / Production
- Browser: Chrome / Firefox / Safari
- OS: Windows / macOS / Linux
- App Version / Branch:

**Severity:** Critical / Major / Minor / Trivial
**Priority:** P1 / P2 / P3

**Steps to Reproduce:**
1. [numbered, reproducible steps]
2.
3.

**Expected Result:**
[what should happen]

**Actual Result:**
[what actually happens — include error message verbatim]

**Attachments:**
- [ ] Screenshot
- [ ] Console log snippet
- [ ] Video recording

**Root Cause (if known):**
[selector mismatch / timing / data issue / API error / etc.]

**Suggested Fix:**
[code hint or approach if known]

**Linked Test Case:** [TC-ID from test case registry]

---

**Rules:** Professional tone, Jira/Linear-ready, no vague descriptions. Quote exact error messages.
