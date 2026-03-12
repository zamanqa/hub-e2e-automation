/**
 * Order Workflow Page Object
 * Handles order management workflow operations (one-time payment, fulfillment, initial payment, customer update)
 */

class OrderWorkflowPage {
  // ==================== HELPER METHOD ====================

  waitForElement(element, timeout = 10000) {
    element.should('be.visible', { timeout });
  }

  // ==================== THREE-DOT ACTIONS MENU ====================

  // Selector
  // Uses aria-haspopup="menu" scoped to the page content area (not header nav buttons)
  get actionsMenuButton() {
    return cy.get('button[aria-haspopup="menu"]').filter(':not(.header-btn)').last();
  }

  // Action
  clickActionsMenu() {
    this.waitForElement(this.actionsMenuButton, 5000);
    this.actionsMenuButton.click();
    cy.wait(1000);
    cy.log('✓ Verified: Clicked Actions menu');
  }

  // ==================== ONE-TIME PAYMENT ====================

  // Selector
  get oneTimePaymentOption() {
    return cy.get('[data-cy="order-action-charge"]');
  }

  // Action
  clickOneTimePayment() {
    this.waitForElement(this.oneTimePaymentOption, 5000);
    this.oneTimePaymentOption.click();
    cy.wait(2000);
    cy.log('✓ Verified: Clicked One-time payment option');
  }

  // Selector
  get oneTimePaymentTitleInput() {
    return cy.get('[data-cy="product-title"] input');
  }

  // Action
  enterOneTimePaymentTitle(title) {
    this.waitForElement(this.oneTimePaymentTitleInput, 5000);
    this.oneTimePaymentTitleInput.clear().type(title);
    cy.log(`✓ Verified: Entered title: ${title}`);
  }

  // Selector
  get oneTimePaymentPriceInput() {
    return cy.get('[data-cy="product-price"] input');
  }

  // Action
  enterOneTimePaymentPrice(price) {
    this.waitForElement(this.oneTimePaymentPriceInput, 5000);
    this.oneTimePaymentPriceInput.clear().type(price);
    cy.log(`✓ Verified: Entered price: ${price}`);
  }

  // Selector
  get vatInput() {
    return cy.get('[data-cy="product-percentage"] input');
  }

  // Action
  enterVAT(vat) {
    this.waitForElement(this.vatInput, 5000);
    this.vatInput.clear().type(vat);
    cy.log(`✓ Verified: Entered VAT: ${vat}`);
  }

  // Selector
  get quantityInput() {
    return cy.get('[data-cy="product-quantity"] input');
  }

  // Action
  verifyQuantityDefaultsToOne() {
    this.waitForElement(this.quantityInput, 5000);
    this.quantityInput.should('have.value', '1');
    cy.log('✓ Verified: Quantity defaults to 1');
  }

  // Selector
  get addItemButton() {
    return cy.get('[data-cy="btn-product-add"]');
  }

  // Action
  clickAddItem() {
    this.waitForElement(this.addItemButton, 5000);
    this.addItemButton.click();
    cy.wait(1000);
    cy.log('✓ Verified: Clicked Add item button');
  }

  // Selector
  // Vue renders this textarea with opacity:0 (overlaid by a visual editor) - use force:true
  get messageToCustomerInput() {
    return cy.contains('label', 'Message to customer')
      .closest('.v-input, .v-field, div')
      .find('textarea');
  }

  // Action
  enterMessageToCustomer(message) {
    // textarea has opacity:0 in Vue, use force:true to bypass visibility check
    this.messageToCustomerInput.should('exist').clear({ force: true }).type(message, { force: true });
    cy.log(`✓ Verified: Entered message: ${message}`);
  }

  // Selector
  get chargeButton() {
    return cy.get('[data-cy="btn-submit"]');
  }

  // Action
  clickCharge() {
    this.waitForElement(this.chargeButton, 5000);
    this.chargeButton.click();
    cy.wait(3000);
    cy.log('✓ Verified: Clicked Charge button');
  }

  // Selector
  get successNotification() {
    return cy.get('[data-test-id="message"]');
  }

  // Action
  verifySuccessNotification() {
    this.waitForElement(this.successNotification, 10000);
    this.successNotification.should('be.visible');
    cy.log('✓ Verified: Success notification displayed');
  }

  // Selector
  get closeButton() {
    return cy.contains("Close");
  }

  // Action
  closeSuccessNotification() {
    this.waitForElement(this.closeButton, 5000);
    this.closeButton.click();
    cy.wait(1000);
    cy.log('✓ Verified: Closed notification/modal');
  }

  // ==================== MARK AS FULFILLED ====================

  // Selector
  get markAsFulfilledOption() {
    return cy.get('[data-cy="order-action-mark-fulfilled"]');
  }

  // Action
  clickMarkAsFulfilled() {
    this.waitForElement(this.markAsFulfilledOption, 5000);
    this.markAsFulfilledOption.click();
    cy.wait(2000);
    cy.log('✓ Verified: Clicked Mark as fulfilled option');
  }

  // Selector
  get confirmFulfillButton() {
    return cy.get('[data-cy="btn-submit"]');
  }

  // Action
  clickConfirmFulfill() {
    this.waitForElement(this.confirmFulfillButton, 5000);
    this.confirmFulfillButton.click();
    cy.wait(3000);
    cy.log('✓ Verified: Clicked Confirm fulfill button');
  }

  // ==================== CHARGE INITIAL PAYMENT ====================

  // Selector
  get chargeInitialPaymentOption() {
    return cy.get('[data-cy="order-action-charge-initial"]');
  }

  // Action
  clickChargeInitialPayment() {
    this.waitForElement(this.chargeInitialPaymentOption, 5000);
    this.chargeInitialPaymentOption.click();
    cy.wait(2000);
    cy.log('✓ Verified: Clicked Charge initial payment option');
  }

  // Selector
  get initialPaymentMessageInput() {
    return cy.contains('label', 'Message to customer')
      .closest('.v-input, .v-field, div')
      .find('textarea');
  }

  // Action
  enterInitialPaymentMessage(message) {
    // textarea has opacity:0 in Vue, use force:true to bypass visibility check
    this.initialPaymentMessageInput.should('exist').clear({ force: true }).type(message, { force: true });
    cy.log(`✓ Verified: Entered message: ${message}`);
  }

  // ==================== UPDATE PAYMENT METHOD ====================

  // Selector
  get updatePaymentMethodOption() {
    return cy.get('[data-cy="order-action-payment-update"]');
  }

  // Action
  clickUpdatePaymentMethod() {
    this.waitForElement(this.updatePaymentMethodOption, 5000);
    this.updatePaymentMethodOption.click();
    cy.wait(2000);
    cy.log('✓ Verified: Clicked Update payment method option');
  }

  // Selector
  get clickHereLink() {
    return cy.contains('a', 'Click here');
  }

  // Action
  clickHereLinkToUpdatePayment() {
    this.waitForElement(this.clickHereLink, 5000);
    this.clickHereLink.invoke('removeAttr', 'target').click();
    cy.log('✓ Verified: Clicked "Click here" link');
  }

  // ==================== CUSTOMER DETAILS ====================

  // Selector
  get editCustomerButton() {
    return cy.get('[data-test-id="btn-open-edit"]');
  }

  // Action
  clickEditCustomer() {
    this.waitForElement(this.editCustomerButton, 5000);
    this.editCustomerButton.click();
    cy.wait(1000);
    cy.log('✓ Verified: Clicked Edit customer button');
  }

  // Selector
  get givenNameInput() {
    return cy.get('input[path="address.billing.first_name"]');
  }

  // Action
  updateGivenName(name) {
    this.waitForElement(this.givenNameInput, 5000);
    this.givenNameInput.clear().type(name);
    cy.log(`✓ Verified: Updated given name to: ${name}`);
  }

  // Selector
  get surnameInput() {
    return cy.get('input[path="address.billing.last_name"]');
  }

  // Action
  updateSurname(surname) {
    this.waitForElement(this.surnameInput, 5000);
    this.surnameInput.clear().type(surname);
    cy.log(`✓ Verified: Updated surname to: ${surname}`);
  }

  // Selector
  get streetInput() {
    return cy.get('input[path="address.billing.street"]');
  }

  // Action
  updateStreet(street) {
    this.waitForElement(this.streetInput, 5000);
    this.streetInput.clear().type(street);
    cy.log(`✓ Verified: Updated street to: ${street}`);
  }

  // Selector
  get consentCheckbox() {
    return cy.contains('label', 'I consent to the consequences')
      .invoke('attr', 'for')
      .then((forAttr) => cy.get(`#${forAttr}`));
  }

  // Action
  clickConsentCheckbox() {
    cy.contains('label', 'I consent to the consequences').click({ force: true });
    cy.log('✓ Verified: Checked consent checkbox');
  }

  // Selector
  get saveCustomerButton() {
    return cy.get('[data-cy="btn-submit"]');
  }

  // Action
  clickSaveCustomer() {
    this.clickConsentCheckbox();
    this.waitForElement(this.saveCustomerButton, 5000);
    this.saveCustomerButton.click();
    cy.wait(2000);
    cy.log('✓ Verified: Clicked Save customer button');
  }

  // Action
  verifyCustomerInfo(givenName, surname) {
    cy.contains(givenName).should('be.visible');
    cy.contains(surname).should('be.visible');
    cy.log(`✓ Verified: Customer info updated to ${givenName} ${surname}`);
  }

  // ==================== TAB NAVIGATION ====================

  // Selector
  get generalTab() {
    return cy.contains('[role="tab"]', 'General');
  }

  // Action
  clickGeneralTab() {
    this.generalTab.click();
    cy.wait(1000);
    cy.log('✓ Verified: Clicked General tab');
  }

  // Selector
  get paymentsTab() {
    return cy.contains('[role="tab"]', 'Payments');
  }

  // Action
  clickPaymentsTab() {
    this.paymentsTab.click();
    cy.wait(1000);
    cy.log('✓ Verified: Clicked Payments tab');
  }

  // Selector
  get paymentMethodsTab() {
    return cy.contains('[role="tab"]', 'Payment methods');
  }

  // Action
  clickPaymentMethodsTab() {
    this.paymentMethodsTab.click();
    cy.wait(1000);
    cy.log('✓ Verified: Clicked Payment methods tab');
  }

  // Selector
  get historyTab() {
    return cy.contains('[role="tab"]', 'History');
  }

  // Action
  clickHistoryTab() {
    this.historyTab.click();
    cy.wait(1000);
    cy.log('✓ Verified: Clicked History tab');
  }

  // Action
  verifyTabContentLoaded() {
    cy.get('[role="tabpanel"]').should('be.visible');
    cy.log('✓ Verified: Tab content loaded');
  }
}

export default new OrderWorkflowPage();
