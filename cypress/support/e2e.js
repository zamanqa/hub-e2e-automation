// Import cypress-mochawesome-reporter
import 'cypress-mochawesome-reporter/register';

// Import commands
import './commands/customer-commands';
import './commands/product-commands';
import './commands/order-commands';
import './commands/database-commands';

// Global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing tests on uncaught exceptions
  return false;
});

// Before each test
beforeEach(() => {
  // Clear cookies and local storage
  cy.clearCookies();
  cy.clearLocalStorage();
});
