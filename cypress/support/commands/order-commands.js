// Custom Cypress commands for Order module

Cypress.Commands.add('navigateToOrders', () => {
  cy.get('[data-cy="orders-tab"]').click();
  cy.url().should('include', '/orders');
});

Cypress.Commands.add('createOrder', (orderData) => {
  cy.get('[data-cy="add-order-btn"]').click();
  cy.get('[data-cy="select-customer"]').select(orderData.customerId);
  cy.get('[data-cy="add-product-to-order"]').click();
  cy.get('[data-cy="select-product"]').select(orderData.productId);
  cy.get('[data-cy="product-quantity"]').type(orderData.quantity);
  cy.get('[data-cy="save-order-btn"]').click();
});

Cypress.Commands.add('searchOrder', (orderNumber) => {
  cy.get('[data-cy="order-search"]').clear().type(orderNumber);
  cy.get('[data-cy="search-btn"]').click();
});
