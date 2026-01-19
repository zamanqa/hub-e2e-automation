describe('Products Module - CRUD Operations', () => {
  
  beforeEach(() => {
    cy.loginToHub(Cypress.env('HUB_USERNAME'), Cypress.env('HUB_PASSWORD'));
    cy.navigateToProducts();
  });

  it('should create a new product', () => {
    const productData = {
      name: 'Test Product',
      sku: `TEST-SKU-${Date.now()}`,
      price: '99.99',
      stock: '100'
    };

    cy.createProduct(productData);
    
    // Verify product created
    cy.contains('Product created successfully').should('be.visible');
    
    // Search for created product
    cy.searchProduct(productData.sku);
    cy.contains(productData.name).should('be.visible');
  });

  it('should search for existing product', () => {
    cy.fixture('test-data/sample-data.json').then((data) => {
      cy.searchProduct(data.products[0].sku);
      cy.get('[data-cy="product-table"]').should('contain', data.products[0].name);
    });
  });

  // Add more test cases here
});
