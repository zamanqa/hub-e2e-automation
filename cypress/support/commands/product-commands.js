// Custom Cypress commands for Product module

Cypress.Commands.add('navigateToProducts', () => {
  cy.get('[data-cy="products-tab"]').click();
  cy.url().should('include', '/products');
});

Cypress.Commands.add('createProduct', (productData) => {
  cy.get('[data-cy="add-product-btn"]').click();
  cy.get('[data-cy="product-name-input"]').type(productData.name);
  cy.get('[data-cy="product-sku-input"]').type(productData.sku);
  cy.get('[data-cy="product-price-input"]').type(productData.price);
  cy.get('[data-cy="product-stock-input"]').type(productData.stock);
  cy.get('[data-cy="save-product-btn"]').click();
});

Cypress.Commands.add('searchProduct', (searchTerm) => {
  cy.get('[data-cy="product-search"]').clear().type(searchTerm);
  cy.get('[data-cy="search-btn"]').click();
});
