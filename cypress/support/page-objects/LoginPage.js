class LoginPage {
  // ==================== EMAIL INPUT ====================
  // Selector
  get emailInput() {
    return cy.get('input[type="email"]');
  }

  // Action
  enterEmail(email) {
    this.emailInput.type(email);
  }

  // ==================== PASSWORD INPUT ====================
  // Selector
  get passwordInput() {
    return cy.get('input[type="password"]');
  }

  // Action
  enterPassword(password) {
    this.passwordInput.type(password);
  }

  // ==================== SIGN IN BUTTON ====================
  // Selector
  get signInButton() {
    return cy.get('button[name="login"]');
  }

  // Action
  clickSignIn() {
    this.signInButton.click();
    cy.wait(5000);
  }

  // Action
  verifyLoginSuccess() {
    cy.url().should('include', '/auth/company');
  }

  // ==================== COMPANY SEARCH INPUT ====================
  // Selector
  get searchCompanyInput() {
    return cy.get('#input-v-0-3');
  }

  // Action
  selectCompany(companyName) {
    this.searchCompanyInput.type(companyName);
    cy.wait(3000);
    cy.contains(Cypress.env('circuly_shopify_stripe')).click();
  }

  // Action
  verifyCompanySelection() {
    cy.wait(2000);
    cy.url().should('include', 'cms/orders');
  }

  // ==================== PAGE NAVIGATION ====================
  // Action
  visit() {
    cy.visit(Cypress.env('loginUrl'));
  }
}

export default new LoginPage();
