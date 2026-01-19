# Test Generator Prompt

You are generating Cypress test cases for the HUB Shopify automation project.

## Test Structure Template

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup: Login, navigate, etc.
  });

  afterEach(() => {
    // Cleanup: Clear data, logout, etc.
  });

  it('should [specific behavior]', () => {
    // Arrange: Set up test data

    // Act: Perform actions

    // Assert: Verify results
  });
});
```

## Guidelines

1. **Use Custom Commands**: Check `cypress/support/commands/` for existing commands
2. **Page Objects**: Use page objects from `cypress/support/page-objects/`
3. **Test Data**: Load from `cypress/fixtures/test-data/`
4. **Selectors**: Use from `cypress/fixtures/selectors/`
5. **Naming**: Follow pattern `feature-name.cy.js`

## Example Test

```javascript
describe('Customer Management', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/customers');
  });

  it('should create a new customer', () => {
    cy.fixture('test-data/customer.json').then((customer) => {
      cy.get('[data-cy=add-customer]').click();
      cy.get('[data-cy=customer-name]').type(customer.name);
      cy.get('[data-cy=customer-email]').type(customer.email);
      cy.get('[data-cy=submit]').click();

      cy.contains('Customer created successfully').should('be.visible');
    });
  });
});
```

## Database Integration

```javascript
it('should verify database record', () => {
  cy.task('queryDatabase', {
    sql: 'SELECT * FROM customers WHERE email = ?',
    params: ['test@example.com']
  }).then((result) => {
    expect(result).to.have.length(1);
  });
});
```
