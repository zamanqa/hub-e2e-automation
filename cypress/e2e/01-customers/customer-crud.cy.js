describe('Customers Module - CRUD Operations', () => {
  
  beforeEach(() => {
    // Login before each test
    cy.loginToHub(Cypress.env('HUB_USERNAME'), Cypress.env('HUB_PASSWORD'));
    cy.navigateToCustomers();
  });

  it('should create a new customer', () => {
    const customerData = {
      firstName: 'Test',
      lastName: 'Customer',
      email: `test.customer.${Date.now()}@example.com`
    };

    cy.createCustomer(customerData);
    
    // Verify customer created
    cy.contains('Customer created successfully').should('be.visible');
    
    // Search for created customer
    cy.searchCustomer(customerData.email);
    cy.contains(customerData.firstName).should('be.visible');
  });

  it('should search for existing customer', () => {
    cy.fixture('test-data/sample-data.json').then((data) => {
      cy.searchCustomer(data.customers[0].email);
      cy.get('[data-cy="customer-table"]').should('contain', data.customers[0].firstName);
    });
  });

  // Add more test cases here
});
