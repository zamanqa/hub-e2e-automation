---
description: Convert manual test cases or user stories into Gherkin .feature file format ready for Cucumber integration.
---

Convert $ARGUMENTS into Gherkin `.feature` file format.

**Rules:**
- `Feature:` — one per module
- `Background:` — for shared preconditions (e.g., user is logged in)
- `Scenario:` — one per test case
- `Scenario Outline:` + `Examples:` table — for data-driven tests
- Tags: `@smoke`, `@regression`, `@sanity`, `@negative`, `@db`
- Steps: `Given` (precondition) | `When` (action) | `Then` (assertion) | `And` (additional)

**Output format:**
```gherkin
@regression
Feature: [Module Name]

  Background:
    Given the user is logged in to Circuly Hub
    And the company "circuly shopify stripe" is selected

  @smoke @P1
  Scenario: [happy path]
    Given [precondition]
    When [action]
    Then [assertion]

  @negative @P2
  Scenario Outline: [data-driven case]
    When I enter "<input>"
    Then I see "<expected>"

    Examples:
      | input | expected |
      | ...   | ...      |
```

**After the .feature file, add step definition stubs as comments:**
```js
// Given('the user is logged in to Circuly Hub', () => { cy.login(); });
// When('I click {string}', (label) => { cy.contains('button', label).click(); });
```
