# Cypress Test Helper

You are helping with a Cypress E2E test automation project for a HUB application on Shopify.

## Project Context

- **Framework**: Cypress v13.17.0
- **Platform**: Shopify integration
- **Database**: MySQL with custom task handlers
- **Test Organization**: Feature-based modules (customers, products, orders, etc.)

## Key Project Files

- `cypress.config.js` - Main Cypress configuration
- `cypress/support/commands/` - Custom Cypress commands
- `cypress/support/page-objects/` - Page object models
- `cypress/fixtures/` - Test data and selectors
- `cypress/plugins/index.js` - Database integration

## When Writing Tests

1. Use existing custom commands from `cypress/support/commands/`
2. Follow the existing test structure in `cypress/e2e/`
3. Use fixtures for test data from `cypress/fixtures/test-data/`
4. Use selectors from `cypress/fixtures/selectors/`
5. Follow the naming convention: `*.cy.js` for test files

## Database Tasks

Available database tasks:
- `cy.task('queryDatabase', { sql: 'SELECT ...', params: [] })`
- `cy.task('executeQuery', { sql: 'INSERT ...', params: [] })`

## Common Commands

- `npm run cy:open` - Open Cypress UI
- `npm run cy:health-check` - Verify setup
- `npm run cy:run` - Run all tests
- `npm test` - Run health check

## Best Practices

- Keep tests independent and idempotent
- Use data-cy attributes for selectors when possible
- Clean up test data in afterEach hooks
- Use meaningful test descriptions
- Follow AAA pattern (Arrange, Act, Assert)
