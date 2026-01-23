/**
 * API Health Check Helper
 * Verifies that required APIs are accessible before running tests
 */

class ApiHealthCheck {
  /**
   * Check HUB API version endpoint
   */
  checkHubApi() {
    cy.request({
      method: 'GET',
      url: 'https://hub-api-development-680576524870.europe-west3.run.app/v1/version',
      failOnStatusCode: false
    }).then((response) => {
      cy.log(`✓ HUB API Version: ${response.status}`);
      expect(response.status).to.be.oneOf([200, 301, 302]);
    });
  }

  /**
   * Check Checkout API version endpoint
   */
  checkCheckoutApi() {
    cy.request({
      method: 'GET',
      url: 'https://checkout-api-development-680576524870.europe-west3.run.app/v1/version',
      failOnStatusCode: false
    }).then((response) => {
      cy.log(`✓ Checkout API Version: ${response.status}`);
      expect(response.status).to.be.oneOf([200, 301, 302]);
    });
  }

  /**
   * Check all required APIs
   */
  checkAllApis() {
    cy.log('========== API Health Check ==========');
    this.checkHubApi();
    this.checkCheckoutApi();
    cy.log('✓ Verified: All APIs are accessible');
  }
}

export default new ApiHealthCheck();
