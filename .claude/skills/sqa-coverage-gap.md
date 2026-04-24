---
description: Identify covered, missing, and risky test scenarios given a feature spec, user story, or existing test list.
---

Analyze test coverage gaps for $ARGUMENTS.

**Input:** provide existing test case IDs/descriptions or a feature description.

**Output:**

## 1. Covered Scenarios
Brief list with TC-IDs — what is already tested.

## 2. Gaps Identified
| Gap | Description | Risk |
|---|---|---|
| Missing X | [what's not tested] | High/Med/Low |

## 3. Risk Areas
High-impact untested flows:
- Critical paths (payment, auth, data mutation)
- Cross-feature dependencies
- Error/failure paths not covered

## 4. Recommended New Test Cases
| TC-ID | Scenario | Type | Priority | Automate? |
|---|---|---|---|---|

**Priority guide:**
- High risk = P1, automate first
- Medium risk = P2, manual or automate next sprint
- Low risk = P3, manual only

## 5. Automation Candidates
Flag which gaps should be automated vs kept manual, with justification.
