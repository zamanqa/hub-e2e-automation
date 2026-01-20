import LoginPage from '../page-objects/LoginPage';

// Custom command for login with session management
Cypress.Commands.add('login', () => {
  cy.session('userLogin', () => {
    LoginPage.visit();
    LoginPage.enterEmail(Cypress.env('testUserEmail'));
    LoginPage.enterPassword(Cypress.env('testUserPassword'));
    LoginPage.clickSignIn();
    LoginPage.verifyLoginSuccess();
    LoginPage.selectCompany(Cypress.env('circuly_shopify_stripe'));
    LoginPage.verifyCompanySelection();
  });
});
