import LoginPage from '../../support/page-objects/LoginPage';

describe('Hub Login', () => {
  it('should successfully login to the system', () => {
    LoginPage.visit();
    LoginPage.enterEmail(Cypress.env('testUserEmail'));
    LoginPage.enterPassword(Cypress.env('testUserPassword'));
    LoginPage.clickSignIn();
    LoginPage.verifyLoginSuccess();
    LoginPage.selectCompany(Cypress.env('circuly_shopify_stripe'));
    LoginPage.verifyCompanySelection();
  });
});
