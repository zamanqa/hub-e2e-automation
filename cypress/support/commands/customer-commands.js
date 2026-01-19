// Custom Cypress commands for Customer module

Cypress.Commands.add('loginToHub', (username, password) => {
  cy.visit('/login');
  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

Cypress.Commands.add('navigateToCustomers', () => {
  cy.get('[data-cy="customers-tab"]').click();
  cy.url().should('include', '/customers');
});

Cypress.Commands.add('createCustomer', (customerData) => {
  cy.get('[data-cy="add-customer-btn"]').click();
  cy.get('[data-cy="first-name-input"]').type(customerData.firstName);
  cy.get('[data-cy="last-name-input"]').type(customerData.lastName);
  cy.get('[data-cy="email-input"]').type(customerData.email);
  cy.get('[data-cy="save-customer-btn"]').click();
});

Cypress.Commands.add('searchCustomer', (searchTerm) => {
  cy.get('[data-cy="customer-search"]').clear().type(searchTerm);
  cy.get('[data-cy="search-btn"]').click();
});
