class LoginPage {
  // Selectors
  get emailInput() {
    return cy.get('input[type="email"]');
  }

  get passwordInput() {
    return cy.get('input[type="password"]');
  }

  get signInButton() {
    return cy.get('button[name="login"]');
  }

  get searchCompanyId() {
  return cy.get('#input-v-0-3');
}

  // Actions
  visit() {
    cy.visit(Cypress.env('loginUrl'));
  }

  enterEmail(email) {
    this.emailInput.type(email);
  }

  enterPassword(password) {
    this.passwordInput.type(password);
  }

  clickSignIn() {
    this.signInButton.click();
    cy.wait(5000);
  }

  verifyLoginSuccess() {
    cy.url().should('include', '/auth/company');
  }

  selectCompany(companyName) {
    this.searchCompanyId.type(companyName);
    cy.wait(3000);
    cy.contains (Cypress.env('circuly_shopify_stripe')).click()
  }

  verifyCompanySelection() {
    cy.wait(2000);
    cy.url().should('include', 'cms/orders')
  }
}

export default new LoginPage();
