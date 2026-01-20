// Import cypress-mochawesome-reporter
import 'cypress-mochawesome-reporter/register';

// Import commands
import './commands/auth-commands';
import './commands/database-commands';

// Global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing tests on uncaught exceptions
  return false;
});

// Removed beforeEach that clears cookies/storage to preserve session
