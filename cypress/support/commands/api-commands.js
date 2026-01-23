import ApiHealthCheck from '../helpers/api-health-check';

/**
 * Custom command to check all API health endpoints
 * @example cy.checkApiHealth()
 */
Cypress.Commands.add('checkApiHealth', () => {
  ApiHealthCheck.checkAllApis();
});

/**
 * Custom command to check HUB API only
 * @example cy.checkHubApi()
 */
Cypress.Commands.add('checkHubApi', () => {
  ApiHealthCheck.checkHubApi();
});

/**
 * Custom command to check Checkout API only
 * @example cy.checkCheckoutApi()
 */
Cypress.Commands.add('checkCheckoutApi', () => {
  ApiHealthCheck.checkCheckoutApi();
});
