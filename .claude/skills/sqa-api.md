---
description: Generate REST API test code covering all status codes, schema validation, auth, and error scenarios using Cypress cy.request.
---

Generate REST API automation for $ARGUMENTS using Cypress `cy.request`.

**Cover all status codes:**
| Code | Scenario |
|---|---|
| 200/201 | Valid payload — assert response schema + key fields |
| 400 | Missing required fields |
| 401 | Missing / invalid auth token |
| 403 | Insufficient permissions |
| 404 | Non-existent resource |
| 422 | Invalid data types / format |
| 500 | Simulate server error if possible |
| Perf | Response time < 2000ms |

**Code pattern:**
```js
cy.request({
  method: 'POST',
  url: `${Cypress.env('baseUrl')}api/endpoint`,
  headers: { Authorization: `Bearer ${Cypress.env('apiToken')}` },
  body: { ... },
  failOnStatusCode: false
}).then((res) => {
  expect(res.status).to.eq(200);
  expect(res.body).to.have.property('id');
  expect(res.duration).to.be.lessThan(2000);
});
```

**Also include:**
- Schema validation (manual field checks or Zod-style)
- Auth token injection via `Cypress.env()`
- Request/response logging for debugging

**Output:** tabular test cases table + full automation code.
