---
description: Write Cypress JS automation code for a feature or module following project conventions (POM, cy.session auth, cy.intercept, data-testid selectors).
---

Write Cypress JS automation for $ARGUMENTS following this project's conventions.

**Structure:**
```js
describe('Feature — E2E Tests', () => {
  // Auth handled globally — no login block needed here

  beforeEach(() => {
    cy.visit(Cypress.env('baseUrl') + 'en/cms/...');
  });

  afterEach(() => { /* cleanup if needed */ });

  it('Test N: should ...', () => { ... });
});
```

**For every UI element:**
```js
// selector: describe the element
cy.get('[data-testid="..."]')   // prefer data-testid; fallback aria-label
// action: describe what you're doing
.click();
```

**Required in every test:**
- `cy.intercept()` for API waits — no bare `cy.wait(ms)` for requests
- `cy.should` / `cy.contains` assertions after every action
- `cy.task('queryDb', Query.method())` for DB verification
- `Cypress.env('baseUrl')` for URLs, `Cypress.env('testUserEmail')` for credentials
- Dynamic test data via fixtures or helper functions — no hardcoded IDs

**Page Object pattern:** selector as `get` getter, action as method with `cy.log()`.

Summarise repeated flows into helper functions or Page Object methods.
