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

  // Selector - Three dot menu button (⋮) on order detail page header
  // Uses aria-haspopup="menu" scoped to the page content area (not header nav buttons)
  get actionsMenuButton() {
    return cy.get('button[aria-haspopup="menu"]').filter(':not(.header-btn)').last();
  }

  // Action - Click actions menu
  clickActionsMenu() {
    this.waitForElement(this.actionsMenuButton, 5000);
    this.actionsMenuButton.click();
    cy.wait(1000);
    cy.log('✓ Verified: Clicked Actions menu');
  }

  // ==================== ONE-TIME PAYMENT ====================

  // Selector - One-time payment menu option
  get oneTimePaymentOption() {
    return cy.get('[data-cy="order-action-charge"]');
  }

  // Action - Click one-time payment option
  clickOneTimePayment() {
    this.waitForElement(this.oneTimePaymentOption, 5000);
    this.oneTimePaymentOption.click();
    cy.wait(2000);
    cy.log('✓ Verified: Clicked One-time payment option');
  }

  // Selector - One-time payment modal title input (data-cy is on the wrapper div, target inner input)
  get oneTimePaymentTitleInput() {
    return cy.get('[data-cy="product-title"] input');
  }

  // Action - Enter one-time payment title
  enterOneTimePaymentTitle(title) {
    this.waitForElement(this.oneTimePaymentTitleInput, 5000);
    this.oneTimePaymentTitleInput.clear().type(title);
    cy.log(`✓ Verified: Entered title: ${title}`);
  }

  // Selector - One-time payment price input (data-cy is on the wrapper div, target inner input)
  get oneTimePaymentPriceInput() {
    return cy.get('[data-cy="product-price"] input');
  }

  // Action - Enter one-time payment price
  enterOneTimePaymentPrice(price) {
    this.waitForElement(this.oneTimePaymentPriceInput, 5000);
    this.oneTimePaymentPriceInput.clear().type(price);
    cy.log(`✓ Verified: Entered price: ${price}`);
  }

  // Selector - VAT input (data-cy is on the wrapper div, target inner input)
  get vatInput() {
    return cy.get('[data-cy="product-percentage"] input');
  }

  // Action - Enter VAT
  enterVAT(vat) {
    this.waitForElement(this.vatInput, 5000);
    this.vatInput.clear().type(vat);
    cy.log(`✓ Verified: Entered VAT: ${vat}`);
  }

  // Selector - Quantity input (data-cy is on the wrapper div, target inner input)
  get quantityInput() {
    return cy.get('[data-cy="product-quantity"] input');
  }

  // Action - Verify quantity defaults to 1
  verifyQuantityDefaultsToOne() {
    this.waitForElement(this.quantityInput, 5000);
    this.quantityInput.should('have.value', '1');
    cy.log('✓ Verified: Quantity defaults to 1');
  }

  // Selector - Add item button (+ icon)
  get addItemButton() {
    return cy.get('[data-cy="btn-product-add"]');
  }

  // Action - Click add item button
  clickAddItem() {
    this.waitForElement(this.addItemButton, 5000);
    this.addItemButton.click();
    cy.wait(1000);
    cy.log('✓ Verified: Clicked Add item button');
  }

  // Selector - Message to customer textarea
  // Vue renders this textarea with opacity:0 (overlaid by a visual editor) - use force:true
  get messageToCustomerInput() {
    return cy.contains('label', 'Message to customer')
      .closest('.v-input, .v-field, div')
      .find('textarea');
  }

  // Action - Enter message to customer
  enterMessageToCustomer(message) {
    // textarea has opacity:0 in Vue, use force:true to bypass visibility check
    this.messageToCustomerInput.should('exist').clear({ force: true }).type(message, { force: true });
    cy.log(`✓ Verified: Entered message: ${message}`);
  }

  // Selector - Charge / Submit button in modal
  get chargeButton() {
    return cy.get('[data-cy="btn-submit"]');
  }

  // Action - Click charge button
  clickCharge() {
    this.waitForElement(this.chargeButton, 5000);
    this.chargeButton.click();
    cy.wait(3000);
    cy.log('✓ Verified: Clicked Charge button');
  }

  // Selector - Success notification
  get successNotification() {
    return cy.get('[data-test-id="message"]');
  }

  // Action - Verify success notification appears
  verifySuccessNotification() {
    this.waitForElement(this.successNotification, 10000);
    this.successNotification.should('be.visible');
    cy.log('✓ Verified: Success notification displayed');
  }

  // Selector - Close button in modal
  get closeButton() {
    return cy.get('[data-cy="btn-close"]');
  }

  // Action - Close success notification / modal
  closeSuccessNotification() {
    this.waitForElement(this.closeButton, 5000);
    this.closeButton.click();
    cy.wait(1000);
    cy.log('✓ Verified: Closed notification/modal');
  }

  // ==================== MARK AS FULFILLED ====================

  // Selector - Mark as fulfilled menu option
  get markAsFulfilledOption() {
    return cy.get('[data-cy="order-action-mark-fulfilled"]');
  }

  // Action - Click mark as fulfilled
  clickMarkAsFulfilled() {
    this.waitForElement(this.markAsFulfilledOption, 5000);
    this.markAsFulfilledOption.click();
    cy.wait(2000);
    cy.log('✓ Verified: Clicked Mark as fulfilled option');
  }

  // Selector - Confirm fulfill button (btn-submit inside the modal)
  get confirmFulfillButton() {
    return cy.get('[data-cy="btn-submit"]');
  }

  // Action - Click confirm fulfill button
  clickConfirmFulfill() {
    this.waitForElement(this.confirmFulfillButton, 5000);
    this.confirmFulfillButton.click();
    cy.wait(3000);
    cy.log('✓ Verified: Clicked Confirm fulfill button');
  }

  // ==================== CHARGE INITIAL PAYMENT ====================

  // Selector - Charge initial payment menu option
  get chargeInitialPaymentOption() {
    return cy.get('[data-cy="order-action-charge-initial"]');
  }

  // Action - Click charge initial payment
  clickChargeInitialPayment() {
    this.waitForElement(this.chargeInitialPaymentOption, 5000);
    this.chargeInitialPaymentOption.click();
    cy.wait(2000);
    cy.log('✓ Verified: Clicked Charge initial payment option');
  }

  // Selector - Initial payment message textarea (opacity:0 in Vue - use force)
  get initialPaymentMessageInput() {
    return cy.contains('label', 'Message to customer')
      .closest('.v-input, .v-field, div')
      .find('textarea');
  }

  // Action - Enter initial payment message
  enterInitialPaymentMessage(message) {
    // textarea has opacity:0 in Vue, use force:true to bypass visibility check
    this.initialPaymentMessageInput.should('exist').clear({ force: true }).type(message, { force: true });
    cy.log(`✓ Verified: Entered message: ${message}`);
  }

  // ==================== UPDATE PAYMENT METHOD ====================

  // Selector - Update payment method menu option
  get updatePaymentMethodOption() {
    return cy.get('[data-cy="order-action-payment-update"]');
  }

  // Action - Click update payment method option
  clickUpdatePaymentMethod() {
    this.waitForElement(this.updatePaymentMethodOption, 5000);
    this.updatePaymentMethodOption.click();
    cy.wait(2000);
    cy.log('✓ Verified: Clicked Update payment method option');
  }

  // Selector - "Click here" link in update payment method dialog
  get clickHereLink() {
    return cy.contains('a', 'Click here');
  }

  // Action - Click the "Click here" link (removes target="_blank" to stay in same tab)
  clickHereLinkToUpdatePayment() {
    this.waitForElement(this.clickHereLink, 5000);
    this.clickHereLink.invoke('removeAttr', 'target').click();
    cy.log('✓ Verified: Clicked "Click here" link');
  }

  // ==================== CUSTOMER DETAILS ====================

  // Selector - Edit customer button (pencil icon)
  get editCustomerButton() {
    return cy.get('[data-test-id="btn-open-edit"]');
  }

  // Action - Click edit customer
  clickEditCustomer() {
    this.waitForElement(this.editCustomerButton, 5000);
    this.editCustomerButton.click();
    cy.wait(1000);
    cy.log('✓ Verified: Clicked Edit customer button');
  }

  // Selector - Given name input (Billing) - uses custom path attribute
  get givenNameInput() {
    return cy.get('input[path="address.billing.first_name"]');
  }

  // Action - Update given name
  updateGivenName(name) {
    this.waitForElement(this.givenNameInput, 5000);
    this.givenNameInput.clear().type(name);
    cy.log(`✓ Verified: Updated given name to: ${name}`);
  }

  // Selector - Surname input (Billing) - uses custom path attribute
  get surnameInput() {
    return cy.get('input[path="address.billing.last_name"]');
  }

  // Action - Update surname
  updateSurname(surname) {
    this.waitForElement(this.surnameInput, 5000);
    this.surnameInput.clear().type(surname);
    cy.log(`✓ Verified: Updated surname to: ${surname}`);
  }

  // Selector - Street input (Billing) - uses custom path attribute
  get streetInput() {
    return cy.get('input[path="address.billing.street"]');
  }

  // Action - Update street
  updateStreet(street) {
    this.waitForElement(this.streetInput, 5000);
    this.streetInput.clear().type(street);
    cy.log(`✓ Verified: Updated street to: ${street}`);
  }

  // Selector - Consent checkbox (identified by its associated label text)
  get consentCheckbox() {
    return cy.contains('label', 'I consent to the consequences')
      .invoke('attr', 'for')
      .then((forAttr) => cy.get(`#${forAttr}`));
  }

  // Action - Click consent checkbox
  clickConsentCheckbox() {
    cy.contains('label', 'I consent to the consequences').click({ force: true });
    cy.log('✓ Verified: Checked consent checkbox');
  }

  // Selector - Save/Submit customer button
  get saveCustomerButton() {
    return cy.get('[data-cy="btn-submit"]');
  }

  // Action - Click save customer (consent first, then submit)
  clickSaveCustomer() {
    this.clickConsentCheckbox();
    this.waitForElement(this.saveCustomerButton, 5000);
    this.saveCustomerButton.click();
    cy.wait(2000);
    cy.log('✓ Verified: Clicked Save customer button');
  }

  // Action - Verify customer information updated
  verifyCustomerInfo(givenName, surname) {
    cy.contains(givenName).should('be.visible');
    cy.contains(surname).should('be.visible');
    cy.log(`✓ Verified: Customer info updated to ${givenName} ${surname}`);
  }

  // ==================== TAB NAVIGATION ====================

  // Selector - General tab
  get generalTab() {
    return cy.contains('[role="tab"]', 'General');
  }

  // Action - Click general tab
  clickGeneralTab() {
    this.generalTab.click();
    cy.wait(1000);
    cy.log('✓ Verified: Clicked General tab');
  }

  // Selector - Payments tab
  get paymentsTab() {
    return cy.contains('[role="tab"]', 'Payments');
  }

  // Action - Click payments tab
  clickPaymentsTab() {
    this.paymentsTab.click();
    cy.wait(1000);
    cy.log('✓ Verified: Clicked Payments tab');
  }

  // Selector - Payment methods tab
  get paymentMethodsTab() {
    return cy.contains('[role="tab"]', 'Payment methods');
  }

  // Action - Click payment methods tab
  clickPaymentMethodsTab() {
    this.paymentMethodsTab.click();
    cy.wait(1000);
    cy.log('✓ Verified: Clicked Payment methods tab');
  }

  // Selector - History tab
  get historyTab() {
    return cy.contains('[role="tab"]', 'History');
  }

  // Action - Click history tab
  clickHistoryTab() {
    this.historyTab.click();
    cy.wait(1000);
    cy.log('✓ Verified: Clicked History tab');
  }

  // Action - Verify tab content loads
  verifyTabContentLoaded() {
    cy.get('[role="tabpanel"]').should('be.visible');
    cy.log('✓ Verified: Tab content loaded');
  }
}

export default new OrderWorkflowPage();
