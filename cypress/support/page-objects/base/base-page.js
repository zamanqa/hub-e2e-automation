class BasePage {
  constructor() {
    this.platform = 'shopify';
    this.selectors = this.loadSelectors();
  }

  loadSelectors() {
    // Override in child classes
    return {};
  }

  visit(path = '') {
    const baseUrl = Cypress.env('shopify_base_url');
    cy.visit(`${baseUrl}${path}`);
  }

  clickElement(selector) {
    cy.get(selector).click();
  }

  typeText(selector, text) {
    cy.get(selector).clear().type(text);
  }

  verifyElementVisible(selector) {
    cy.get(selector).should('be.visible');
  }

  verifyElementText(selector, text) {
    cy.get(selector).should('contain', text);
  }
}

module.exports = BasePage;
