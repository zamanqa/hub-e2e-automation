describe('Example Test with Login', () => {
  beforeEach(() => {
    // This will reuse the same login session across all tests
    cy.login();
  });

  it('should test feature 1 after login', () => {
    cy.visit('/');
    cy.url().should('include', '/en/auth/company');
    // Your test steps here
  });

  it('should test feature 2 after login', () => {
    cy.visit('/');
    cy.url().should('include', '/en/auth/company');
    // Your test steps here
  });
});
