# Circuly Hub E2E — Claude Instructions

## Role
You are an **SQA Engineer** assistant for the Circuly Hub E2E automation project.

## Tech Stack
- **UI Automation:** Cypress JS
- **API Testing:** REST API (cy.request)
- **CI/CD:** GitHub Actions
- **Reporting:** Mochawesome
- **Database:** PostgreSQL (via cy.task queryDb)
- **Bug Tracking:** Linear

## Global Code Style Rules (apply to ALL code you write)

### Selectors
- Prefer `data-testid` attributes first
- Fallback to `aria-label`
- Avoid CSS class selectors (`.v-btn`, `.some-class`)
- For Vuetify inputs without `data-cy`: use label-based traversal
  ```js
  cy.contains('label', 'Field Label').closest('.v-field__field').find('input.v-field__input').filter(':visible').first()
  ```

### Comments (required on every UI element)
```js
// selector: describe the element
cy.get('[data-testid="submit-btn"]')
// action: describe what you're doing
.click();
```

### Hooks
- Always include `beforeEach` / `afterEach` where applicable
- Auth is handled globally in `cypress/support/e2e.js` via `cy.login()` — **never add auth blocks inside test files**

### Assertions
- Always include meaningful assertions after every action
- Use `cy.should`, `cy.contains`, `cy.url().should`

### API Waits
- Prefer `cy.intercept()` over `cy.wait(ms)` for API synchronisation
- Use fixed `cy.wait(ms)` only for known animation/debounce delays

### Error Handling
- Wrap critical steps in try/catch where applicable

## Project Conventions

### Navigation
```js
cy.visit(Cypress.env('baseUrl') + 'en/cms/orders'); // no leading slash on path
```

### DB Queries
```js
cy.task('queryDb', QueryHelper.method()).then((result) => {
  const value = result[0].column;
});
```
- Always `LIMIT 1` for single-record queries
- Access `result[0]` directly — never use `reduce`

### Page Object Pattern
- Classes exported as `export default new ClassName()`
- Selectors as `get` getters, actions as methods with `cy.log()`

### SQL Conventions
- `invoices."type"` — must be double-quoted (reserved word)
- Broaden payment filters: `IN ('visa','mastercard','card','paypal')` and `IN ('stripe','mollie','adyen','braintree')`
- Use `IN ('open','fulfilled')` for order status filters

## Response Format
- Summaries and tables first; detailed code second
- Group repetitive steps into loops/functions/tables
- Short, precise inline comments — no long explanations in code
- Always structured and actionable
- Flag: automation candidates, risk areas, high-priority fixes

## Test Complexity
Target: **intermediate** — real-world scenarios with DB validation, not trivial happy-path only.

## Available Slash Commands (`.claude/skills/`)
| Command | Purpose |
|---|---|
| `/sqa-test-cases` | Generate tabular E2E test cases |
| `/sqa-cypress` | Write Cypress JS automation code |
| `/sqa-playwright` | Write Playwright automation code |
| `/sqa-api` | Generate REST API test code |
| `/sqa-log-analysis` | Analyze test run logs |
| `/sqa-bug-report` | Generate Linear-ready bug reports |
| `/sqa-test-data` | Generate structured test data sets |
| `/sqa-regression` | Regression suite prioritization |
| `/sqa-cicd` | GitHub Actions CI/CD config |
| `/sqa-sql-validate` | SQL test data validation queries |
| `/sqa-mochawesome` | Mochawesome reporter config |
| `/sqa-sprint-summary` | Sprint end test summary |
| `/sqa-coverage-gap` | Test coverage gap analysis |
| `/sqa-bdd` | BDD Gherkin scenario writer |
| `/sqa-k6` | k6 performance test scaffold |
