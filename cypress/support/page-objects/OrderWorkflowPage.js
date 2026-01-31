/**
 * Order Workflow Page Object
 * Handles order management workflow operations (one-time payment, fulfillment, initial payment, customer update)
 */

class OrderWorkflowPage {
  // ==================== HELPER METHOD ====================

  /**
   * Wait for element to be visible
   */
  waitForElement(element, timeout = 10000) {
    element.should('be.visible', { timeout });
  }

  // ==================== THREE-DOT ACTIONS MENU ====================

  // Selector - Three dot menu button (⋮)
  get actionsMenuButton() {
  return cy.get('div.text-center > .relative > .flex > .inline-flex');
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
    // TODO: Update selector once DOM is provided
    return cy.contains('One-time payment'); // Placeholder selector
  }

  // Action - Click one-time payment option
  clickOneTimePayment() {
    this.waitForElement(this.oneTimePaymentOption, 5000);
    this.oneTimePaymentOption.click();
    cy.wait(2000);
    cy.log('✓ Verified: Clicked One-time payment option');
  }

  // Selector - One-time payment modal title input
  get oneTimePaymentTitleInput() {
    // TODO: Update selector once DOM is provided
    return cy.get('.rounded-md > [data-cy="product-title"]'); // Placeholder selector
  }

  // Action - Enter one-time payment title
  enterOneTimePaymentTitle(title) {
    this.waitForElement(this.oneTimePaymentTitleInput, 5000);
    this.oneTimePaymentTitleInput.clear().type(title);
    cy.log(`✓ Verified: Entered title: ${title}`);
  }

  // Selector - One-time payment price input
  get oneTimePaymentPriceInput() {
    // TODO: Update selector once DOM is provided
    return cy.get('.rounded-md > [data-cy= "product-price"]'); // Placeholder selector
  }

  // Action - Enter one-time payment price
  enterOneTimePaymentPrice(price) {
    this.waitForElement(this.oneTimePaymentPriceInput, 5000);
    this.oneTimePaymentPriceInput.clear().type(price);
    cy.log(`✓ Verified: Entered price: ${price}`);
  }

  // Selector - VAT input
  get vatInput() {
  return cy.get('.flex [data-cy="product-percentage"]').first(); // Corrected selector with parent class
}
  // Action - Enter VAT
  enterVAT(vat) {
    this.waitForElement(this.vatInput, 5000);
    this.vatInput.clear().type(vat);
    cy.log(`✓ Verified: Entered VAT: ${vat}`);
  }

  // Selector - Quantity input
  get quantityInput() {
    // TODO: Update selector once DOM is provided
    return cy.get('.flex > [data-cy="product-quantity"]'); // Placeholder selector
  }

  // Action - Verify quantity defaults to 1
  verifyQuantityDefaultsToOne() {
    this.waitForElement(this.quantityInput, 5000);
    this.quantityInput.should('have.value', '1');
    cy.log('✓ Verified: Quantity defaults to 1');
  }

  // Selector - Add item button (plus icon)
  get addItemButton() {
    // TODO: Update selector once DOM is provided
    return cy.get('[data-cy="btn-product-add"]'); // Placeholder selector
  }

  // Action - Click add item button
  clickAddItem() {
    this.waitForElement(this.addItemButton, 5000);
    this.addItemButton.click();
    cy.wait(1000);
    cy.log('✓ Verified: Clicked Add item button');
  }

  // Selector - Message to customer textarea
  get messageToCustomerInput() {
  return cy.get('textarea[aria-describedby="input-v-0-3-3-0-2-messages"]'); // Using more specific selector for textarea
}

  // Action - Enter message to customer
  enterMessageToCustomer(message) {
    this.messageToCustomerInput.clear().type(message);
    cy.log(`✓ Verified: Entered message: ${message}`);
  }

  // Selector - Charge button
  get chargeButton() {
    // TODO: Update selector once DOM is provided
    return cy.get('[data-cy="btn-submit"] > .flex'); // Placeholder selector
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
    // TODO: Update selector once DOM is provided
    return cy.get('[data-test-id="message"]'); // Placeholder selector
  }

  // Action - Verify success notification appears
  verifySuccessNotification() {
    this.waitForElement(this.successNotification, 10000);
    this.successNotification.should('be.visible');
    cy.log('✓ Verified: Success notification displayed');
  }

  // Action - Close success notification
  closeSuccessNotification() {
    // TODO: Update selector once DOM is provided
    cy.contains('button', 'Close').click(); // Placeholder selector
    cy.wait(1000);
    cy.log('✓ Verified: Closed success notification');
  }

  // ==================== MARK AS FULFILLED ====================

  // Selector - Mark as fulfilled option
  get markAsFulfilledOption() {
    // TODO: Update selector once DOM is provided
    return cy.contains('Mark as fulfilled'); // Placeholder selector
  }

  // Action - Click mark as fulfilled
  clickMarkAsFulfilled() {
    this.waitForElement(this.markAsFulfilledOption, 5000);
    this.markAsFulfilledOption.click();
    cy.wait(2000);
    cy.log('✓ Verified: Clicked Mark as fulfilled option');
  }


  // Selector - Confirm fulfill button
  get confirmFulfillButton() {
    // TODO: Update selector once DOM is provided
    return cy.contains('button', 'Mark as fulfilled'); // Placeholder selector in dialog
  }

  // Action - Click confirm fulfill button
  clickConfirmFulfill() {
    this.waitForElement(this.confirmFulfillButton, 5000);
    this.confirmFulfillButton.click();
    cy.wait(3000);
    cy.log('✓ Verified: Clicked Confirm fulfill button');
  }

  // ==================== CHARGE INITIAL PAYMENT ====================

  // Selector - Charge initial payment option
  get chargeInitialPaymentOption() {
    // TODO: Update selector once DOM is provided
    return cy.contains('Charge initial payment'); // Placeholder selector
  }

  // Action - Click charge initial payment
  clickChargeInitialPayment() {
    this.waitForElement(this.chargeInitialPaymentOption, 5000);
    this.chargeInitialPaymentOption.click();
    cy.wait(2000);
    cy.log('✓ Verified: Clicked Charge initial payment option');
  }

  // Selector - Amount to charge display
  get amountToChargeDisplay() {
    // TODO: Update selector once DOM is provided
    return cy.contains('span', 'Charge'); // Placeholder selector
  }

  // Action - Verify amount to charge
  verifyAmountToCharge(expectedAmount) {
    this.waitForElement(this.amountToChargeDisplay, 5000);
    this.amountToChargeDisplay.should('contain', expectedAmount);
    cy.log(`✓ Verified: Amount to charge is ${expectedAmount}`);
  }

  // Selector - Initial payment message input
  get initialPaymentMessageInput() {
    return cy.contains('label', 'Message to customer').parent().find('textarea');
}

  // Action - Enter initial payment message
  enterInitialPaymentMessage(message) {
    
    this.initialPaymentMessageInput.clear().type(message);
    cy.log(`✓ Verified: Entered message: ${message}`);
  }

  // ==================== UPDATE PAYMENT METHOD ====================

  // Selector - Update payment method option
  get updatePaymentMethodOption() {
    return cy.contains('Update payment method');
  }

  // Action - Click update payment method option
  clickUpdatePaymentMethod() {
    this.waitForElement(this.updatePaymentMethodOption, 5000);
    this.updatePaymentMethodOption.click();
    cy.wait(2000);
    cy.log('✓ Verified: Clicked Update payment method option');
  }

  // Selector - Click here link
  get clickHereLink() {
    return cy.contains('a', 'Click here');
  }

  // Action - Click the "Click here" link to open new tab
  clickHereLinkToUpdatePayment() {
    this.waitForElement(this.clickHereLink, 5000);
    // Remove target="_blank" to prevent new tab, then restore it
    this.clickHereLink.invoke('removeAttr', 'target').click();
    cy.log('✓ Verified: Clicked "Click here" link');
  }

  // Selector - Close button in update payment method dialog
  get closePaymentMethodDialogButton() {
    return cy.get('[data-cy="btn-close"]');
  }

  // Action - Click close button
  clickClosePaymentMethodDialog() {
    this.waitForElement(this.closePaymentMethodDialogButton, 5000);
    this.closePaymentMethodDialogButton.click();
    cy.wait(1000);
    cy.log('✓ Verified: Clicked Close button');
  }

  // ==================== CUSTOMER DETAILS ====================

  // Selector - Edit customer button
  get editCustomerButton() {
    // TODO: Update selector once DOM is provided
    return cy.get('[data-test-id="btn-open-edit"]'); // Placeholder selector
  }

  // Action - Click edit customer
  clickEditCustomer() {
    this.waitForElement(this.editCustomerButton, 5000);
    this.editCustomerButton.click();
    cy.wait(1000);
    cy.log('✓ Verified: Clicked Edit customer button');
  }

  // Selector - Given name input (Billing)
  get givenNameInput() {
    return cy.get('input[path="address.billing.first_name"]');
  }

  // Action - Update given name
  updateGivenName(name) {
    this.waitForElement(this.givenNameInput, 5000);
    this.givenNameInput.clear().type(name);
    cy.log(`✓ Verified: Updated given name to: ${name}`);
  }

  // Selector - Surname input (Billing)
  get surnameInput() {
    return cy.get('input[path="address.billing.last_name"]');
  }

  // Action - Update surname
  updateSurname(surname) {
    this.waitForElement(this.surnameInput, 5000);
    this.surnameInput.clear().type(surname);
    cy.log(`✓ Verified: Updated surname to: ${surname}`);
  }

  // Selector - Street input (Billing)
  get streetInput() {
    return cy.get('input[path="address.billing.street"]');
  }

  // Action - Update street
  updateStreet(street) {
    this.waitForElement(this.streetInput, 5000);
    this.streetInput.clear().type(street);
    cy.log(`✓ Verified: Updated street to: ${street}`);
  }

  // Selector - Consent checkbox
  get consentCheckbox() {
    return cy.contains('I consent to the consequences').closest('label');
  }

  // Action - Click consent checkbox
  clickConsentCheckbox() {
    //this.waitForElement(this.consentCheckbox, 5000);
    this.consentCheckbox.click({ force: true });
    cy.log('✓ Verified: Checked consent checkbox');
  }

  // Selector - Save customer button
  get saveCustomerButton() {
    // TODO: Update selector once DOM is provided
    return cy.contains('button', 'Submit'); // Placeholder selector
  }

  // Action - Click save customer
  clickSaveCustomer() {
    // Click consent checkbox first
    this.clickConsentCheckbox();

    // Then click submit button
    this.waitForElement(this.saveCustomerButton, 5000);
    this.saveCustomerButton.click();
    cy.wait(2000);
    cy.log('✓ Verified: Clicked Save customer button');
  }

  // Action - Verify customer information updated
  verifyCustomerInfo(givenName, surname) {
    // TODO: Update selector once DOM is provided
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
