class LoginPage {
  // ==================== EMAIL INPUT ====================
  // Selector
  get emailInput() {
    return cy.get('input[type="email"]');
  }

  // Action
  enterEmail(email) {
    this.emailInput.click().clear().type(email, { delay: 50 });
  }

  // ==================== PASSWORD INPUT ====================
  // Selector
  get passwordInput() {
    return cy.get('input[type="password"]');
  }

  // Action
  enterPassword(password) {
    this.passwordInput.click().clear().type(password, { delay: 50 });
  }

  // ==================== SIGN IN BUTTON ====================
  // Selector
  get signInButton() {
    return cy.get('button[name="login"]');
  }

  // Action
  clickSignIn() {
    this.signInButton.click();
    cy.wait(8000);
  }

  // Action
  verifyLoginSuccess() {
    cy.url().should('include', '/auth/company');
  }

  // ==================== COMPANY SEARCH INPUT ====================
  // Selector
  get searchCompanyInput() {
    return cy.get('input[placeholder="Search..."]');
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
