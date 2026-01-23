// Import cypress-mochawesome-reporter
import 'cypress-mochawesome-reporter/register';

// Import commands
import './commands/auth-commands';
import './commands/database-commands';
import './commands/api-commands';

// Global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing tests on uncaught exceptions
  return false;
});

// Global beforeEach hook - runs before every test
beforeEach(() => {
  // Login before each test to maintain session
  cy.login();
});

// Removed standalone beforeEach that clears cookies/storage to preserve session
