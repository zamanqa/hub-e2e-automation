import SubscriptionWorkflowQueries from '../helpers/subscription-workflow-queries';

/**
 * Subscription Detail Page Object
 * Contains selectors and actions for the Subscription Detail page
 * Uses strong selectors: data-cy, data-testid, aria attributes, semantic text
 */

class SubscriptionDetailPage {
  // ==================== HELPER METHODS ====================

  waitForElement(element, maxWait = 5000) {
    return element.should('be.visible', { timeout: maxWait });
  }

  // ==================== ACTIONS MENU (3-DOT) ====================

  // Selector — scoped to page content, not header nav
  get actionsMenuButton() {
    return cy.get('button[aria-haspopup="menu"]').filter(':not(.header-btn)').last();
  }

  // Action
  clickActionsMenu() {
    this.waitForElement(this.actionsMenuButton, 10000);
    this.actionsMenuButton.click();
    cy.wait(3000);
    cy.log('✓ Verified: Clicked 3-dot actions menu');
  }

  // ==================== MENU ITEMS ====================

  // Action
  clickAutoRenewSubscription() {
    cy.contains('[role="menuitem"]', 'Auto-renew subscription').click();
    cy.log('✓ Verified: Clicked Auto-renew subscription');
  }

  // Action
  clickBuyoutSubscription() {
    cy.contains('[role="menuitem"]', 'Buyout subscription').click();
    cy.log('✓ Verified: Clicked Buyout subscription');
  }

  // Action
  clickChangeQuantity() {
    cy.contains('[role="menuitem"]', 'Change quantity').click();
    cy.log('✓ Verified: Clicked Change quantity');
  }

  // Action
  clickChangeBillingFrequency() {
    cy.contains('[role="menuitem"]', 'Change billing frequency').click();
    cy.log('✓ Verified: Clicked Change billing frequency');
  }

  // Action
  clickChangeSubscriptionAttributes() {
    cy.contains('[role="menuitem"]', 'Change subscription attributes').click();
    cy.log('✓ Verified: Clicked Change subscription attributes');
  }

  // Action
  clickChangeExtensionPrice() {
    cy.contains('[role="menuitem"]', 'Change subscription extension price').click();
    cy.log('✓ Verified: Clicked Change subscription extension price');
  }

  // Action
  clickExtendSubscription() {
    cy.contains('[role="menuitem"]', 'Extend subscription').click();
    cy.log('✓ Verified: Clicked Extend subscription');
  }

  // Action
  clickReactivateSubscription() {
    cy.contains('[role="menuitem"]', 'Reactivate subscription').click();
    cy.log('✓ Verified: Clicked Reactivate subscription');
  }

  // Action
  clickReplaceSerialNumber() {
    cy.contains('[role="menuitem"]', 'Replace serial number').click();
    cy.log('✓ Verified: Clicked Replace serial number');
  }

  // Action
  clickSetAsPendingReturn() {
    cy.contains('[role="menuitem"]', 'Set as pending return').click();
    cy.log('✓ Verified: Clicked Set as pending return');
  }

  // Action
  clickSetAsEnded() {
    cy.contains('[role="menuitem"]', 'Set as ended').click();
    cy.log('✓ Verified: Clicked Set as ended');
  }

  // Action
  clickSwapSubscriptionItem() {
    cy.contains('[role="menuitem"]', 'Swap subscription item').click();
    cy.log('✓ Verified: Clicked Swap subscription item');
  }

  // Action
  clickViewOrder() {
    cy.contains('[role="menuitem"]', 'View order').click();
    cy.log('✓ Verified: Clicked View order');
  }

  // ==================== DISABLED MENU ITEM VERIFICATION ====================

  // Verify a menu item is disabled/greyed out (not clickable)
  verifyMenuItemDisabled(menuItemText) {
    cy.contains('[role="menuitem"]', menuItemText)
      .should('exist')
      .then(($el) => {
        const isDisabled =
          $el.attr('aria-disabled') === 'true' ||
          $el.prop('disabled') === true ||
          $el.hasClass('disabled') ||
          $el.css('pointer-events') === 'none' ||
          $el.attr('tabindex') === '-1';
        expect(isDisabled, `"${menuItemText}" should be disabled`).to.be.true;
        cy.log(`✓ Verified: "${menuItemText}" is disabled/greyed out`);
      });
  }

  // ==================== MODAL BUTTONS ====================

  // Selector — data-cy modal submit button (used in auto-renew, charge, etc.)
  get modalSubmitButton() {
    return cy.get('[data-cy="btn-submit"]');
  }

  // Action
  clickModalSubmit() {
    this.modalSubmitButton.click();
    cy.log('✓ Verified: Clicked modal Submit button');
  }

  // Selector — data-cy modal close button
  get modalCloseButton() {
    return cy.get('[data-cy="btn-close"]');
  }

  // Action
  clickModalClose() {
    this.modalCloseButton.click();
    cy.wait(1000);
    cy.log('✓ Verified: Clicked modal Close button');
  }

  // Selector
  get closeButton() {
    return cy.contains('button', 'Close');
  }

  // Action
  clickClose() {
    this.closeButton.click();
    cy.wait(3000);
    cy.log('✓ Verified: Clicked Close button');
  }

  // Selector
  get confirmButton() {
    return cy.contains('button', 'Confirm');
  }

  // Selector
  get submitButton() {
    return cy.contains('button', 'Submit');
  }

  // Selector
  get saveChangesButton() {
    return cy.contains('button', 'Save changes');
  }

  // Selector
  get disableButton() {
    return cy.contains('button', 'Disable');
  }

  // Selector
  get buyoutButton() {
    return cy.contains('button', 'Buyout');
  }

  // Selector
  get markAsSettledButton() {
    return cy.contains('button', 'Mark as settled');
  }

  // Selector
  get continueButton() {
    return cy.contains('button', 'Continue');
  }

  // Selector
  get submitChangesButton() {
    return cy.contains('button', 'Submit changes');
  }

  // ==================== MODAL STATE ====================

  // Action
  // The dialog uses opacity: 0 → 1 transition; we wait until it is no longer opacity:0
  waitForModalOpen() {
    cy.get('[id^="headlessui-dialog-panel"]')
      .should('not.have.css', 'opacity', '0')
      .and('be.visible');
    cy.wait(2000);
  }

  // ==================== AUTO-RENEW MODAL ====================

  // Selector — auto-renew toggle on the page
  get autoRenewToggle() {
    return cy.get('button[aria-label="Auto renew"]');
  }

  // Action
  verifyAutoRenewToggle(expectedState) {
    // expectedState: 'true' (enabled) or 'false' (disabled)
    this.autoRenewToggle.should('have.attr', 'aria-checked', expectedState);
    cy.log(`✓ Verified: Auto-renew toggle aria-checked is "${expectedState}"`);
  }

  // Action
  verifyAutoRenewDisableModal() {
    this.waitForModalOpen();
    cy.contains('Auto renew subscription').should('be.visible');
    cy.contains('This subscription is currently auto-renewing.').should('be.visible');
    cy.contains('Would you like to disable it').should('be.visible');
    this.modalCloseButton.should('be.visible');
    this.modalSubmitButton.should('be.visible').and('contain', 'Disable');
    cy.log('✓ Verified: Disable auto-renew modal content is correct');
  }

  // Action
  verifyAutoRenewEnableModal() {
    this.waitForModalOpen();
    cy.contains('Auto renew subscription').should('be.visible');
    cy.contains('This subscription is currently not auto-renewing.').should('be.visible');
    cy.contains('Would you like to enable it?').should('be.visible');
    this.modalCloseButton.should('be.visible');
    this.modalSubmitButton.should('be.visible').and('contain', 'Enable');
    cy.log('✓ Verified: Enable auto-renew modal content is correct');
  }

  // Action
  verifyAndCloseSuccessModal() {
    cy.contains('Successfully requested!').should('be.visible');
    cy.log('✓ Verified: Success confirmation modal appeared');
    this.modalCloseButton.click();
    cy.contains('Successfully requested!').should('not.exist');
    cy.log('✓ Verified: Success modal closed');
  }

  // ==================== CHANGE BILLING FREQUENCY MODAL ====================

  // Selector — frequency dropdown
  get frequencySelect() {
    return cy.get('[data-cy="frequency"]');
  }

  // Selector — interval number input inside the [data-cy="interval"] wrapper div
  get intervalInput() {
    return cy.get('[data-cy="interval"] input').filter(':visible').first();
  }

  // Action
  verifyChangeBillingFrequencyModal() {
    this.waitForModalOpen();
    cy.contains('Change billing frequency').should('be.visible');
    this.frequencySelect.should('be.visible');
    this.intervalInput.should('be.visible');
    this.modalCloseButton.should('be.visible');
    this.modalSubmitButton.should('be.visible').and('contain', 'Save changes');
    cy.log('✓ Verified: Change billing frequency modal content is correct');
  }

  // Action
  verifyBillingFrequencyInDb(subscriptionId, expectedInterval) {
    cy.wait(3000);
    cy.task('queryDb', SubscriptionWorkflowQueries.verifyBillingFrequencyInterval(subscriptionId, expectedInterval)).then((result) => {
      expect(result, `DB result for interval ${expectedInterval} should not be empty`).to.have.length.greaterThan(0);
      const dbInterval = result[0].subscription_frequency_interval;
      expect(String(dbInterval)).to.equal(String(expectedInterval));
      cy.log(`✓ Verified: DB subscription_frequency_interval is "${dbInterval}"`);
    });
  }

  // Action
  updateBillingFrequency(subscriptionId) {
    cy.task('queryDb', SubscriptionWorkflowQueries.getCurrentBillingFrequencyInterval(subscriptionId)).then((rows) => {
      const currentVal = String(rows[0].subscription_frequency_interval);
      cy.log(`Current interval value from DB: "${currentVal}"`);
      const newVal = currentVal === '1' ? '2' : '1';
      cy.log(`Setting new interval value to: "${newVal}"`);

      // Type new value into the input
      this.intervalInput.clear().type(newVal);
      this.intervalInput.should('have.value', newVal);
      cy.log(`✓ Updated: Interval changed from ${currentVal} to ${newVal}`);

      // Save changes
      this.modalSubmitButton.click();
      cy.contains('Successfully requested!').should('be.visible');
      cy.log(`✓ Verified: Success modal appeared after saving interval ${newVal}`);
      this.modalCloseButton.click();
      cy.contains('Successfully requested!').should('not.exist');

      // Verify updated value in DB
      this.verifyBillingFrequencyInDb(subscriptionId, newVal);
    });
  }

  // ==================== CHANGE QUANTITY MODAL ====================

  // Selector — quantity number input (has path="quantity" attribute on the input itself)
  get quantityInput() {
    return cy.get('input[path="quantity"]').filter(':visible').first();
  }

  // Action
  setupQuantityTestInDb(subscriptionId) {
    cy.task('queryDb', SubscriptionWorkflowQueries.setupSubscriptionForQuantityTest(subscriptionId));
    cy.log(`✓ DB Setup: subscription_type = 'consumable', quantity = 2 for ${subscriptionId}`);
  }

  // Action
  revertQuantityTestInDb(subscriptionId) {
    cy.task('queryDb', SubscriptionWorkflowQueries.revertSubscriptionAfterQuantityTest(subscriptionId));
    cy.log(`✓ DB Reverted: subscription_type = 'normal', quantity = 2 for ${subscriptionId}`);
  }

  // Action
  changeQuantity(qty) {
    this.waitForModalOpen();
    cy.contains('Change quantity').should('be.visible');
    this.quantityInput.should('be.visible');
    this.modalCloseButton.should('be.visible');
    this.modalSubmitButton.should('be.visible').and('contain', 'Save changes');
    cy.log('✓ Verified: Change quantity modal content is correct');

    this.quantityInput.clear().type(qty);
    this.quantityInput.should('have.value', String(qty));
    cy.log(`✓ Updated: Quantity set to ${qty}`);

    this.modalSubmitButton.click();
    cy.contains('Successfully requested!').should('be.visible');
    cy.log('✓ Verified: Success modal appeared after saving quantity');
    this.modalCloseButton.click();
    cy.contains('Successfully requested!').should('not.exist');
  }

  // Action
  verifyQuantityInDb(subscriptionId, expectedQty) {
    cy.wait(3000);
    cy.task('queryDb', SubscriptionWorkflowQueries.verifySubscriptionQuantity(subscriptionId, expectedQty)).then((result) => {
      expect(result, `DB result for quantity ${expectedQty} should not be empty`).to.have.length.greaterThan(0);
      const dbQty = result[0].quantity;
      expect(String(dbQty)).to.equal(String(expectedQty));
      cy.log(`✓ Verified: DB quantity is "${dbQty}"`);
    });
  }

  // ==================== CHANGE SUBSCRIPTION ATTRIBUTES MODAL ====================

  // Selector — subscription length input (data-cy="subscription-duration" on the input itself)
  get subscriptionLengthInput() {
    return cy.get('input[data-cy="subscription-duration"]').filter(':visible').first();
  }

  // Action
  verifyChangeSubscriptionAttributesModal() {
    this.waitForModalOpen();
    cy.contains('Change subscription attributes').should('be.visible');
    this.subscriptionLengthInput.should('be.visible');
    this.subscriptionInstallmentPriceInput.should('be.visible');
    this.modalCloseButton.should('be.visible');
    cy.log('✓ Verified: Change subscription attributes modal content is correct');
  }

  // Selector — subscription installment unit price input (data-cy="subscription-price" on the input itself)
  get subscriptionInstallmentPriceInput() {
    return cy.get('input[data-cy="subscription-price"]').filter(':visible').first();
  }

  // Selector — submit button inside the Change subscription attributes modal
  get subscriptionAttributesSubmitButton() {
    return cy.contains('button', 'Submit').filter(':visible');
  }

  // Action
  updateSubscriptionAttributes() {
    // Update subscription length
    this.subscriptionLengthInput.clear().type('12');
    cy.log('✓ Updated: Subscription length set to 12');

    // Update installment unit price
    this.subscriptionInstallmentPriceInput.clear().type('22');
    cy.log('✓ Updated: Installment unit price set to 22');

    // Submit and verify success
    this.subscriptionAttributesSubmitButton.click();
    cy.contains('Successfully requested!').should('be.visible');
    cy.log('✓ Verified: Success modal appeared after submitting attributes');
    this.modalCloseButton.click();
    cy.contains('Successfully requested!').should('not.exist');
  }

  // ==================== BUYOUT SUBSCRIPTION ====================

  // Selector — buyout price input
  get buyoutPriceInput() {
    return cy.get('[data-cy="price"]');
  }

  // Action
  verifyBuyoutPricePreFilled(expectedValue) {
    this.buyoutPriceInput.should('have.value', expectedValue);
    cy.log(`✓ Verified: Buyout price field is pre-filled with ${expectedValue}`);
  }

  // Selector — invoice line item text input
  get invoiceLineItemInput() {
    return cy.get('[data-test-id="input-invoice-reference"]');
  }

  // Action
  // Uses .filter(':visible').first() to target only the visible input when multiple matches exist
  enterInvoiceLineItemText(text) {
    this.invoiceLineItemInput.filter(':visible').first().click().type(text);
    cy.log(`✓ Filled: Invoice line item text with "${text}"`);
  }

  // Action
  verifyBuyoutModal() {
    this.waitForModalOpen();
    cy.contains('Buyout subscription').should('be.visible');
    cy.contains('Retail price:').should('be.visible');
    cy.contains('Prepaid price:').should('be.visible');
    cy.contains('Paid by recurring payments:').should('be.visible');
    cy.contains('label', 'Buyout price').should('be.visible');
    cy.contains('label', 'Invoice line item text').should('be.visible');
    this.modalCloseButton.should('be.visible');
    this.modalSubmitButton.should('be.visible').and('contain', 'Buyout');
    cy.log('✓ Verified: Buyout modal content is correct');
  }

  // Action
  verifyBuyoutPricingValues(retailPrice, prepaidPrice, paidByRecurring) {
    cy.contains(retailPrice).should('be.visible');
    cy.contains(prepaidPrice).should('be.visible');
    cy.contains(paidByRecurring).should('be.visible');
    cy.log('✓ Verified: Buyout pricing rows display correct values');
  }

  // Action
  verifyBuyoutStatusInDb(subscriptionId) {
    cy.task('queryDb', SubscriptionWorkflowQueries.verifyBuyoutStatus(subscriptionId)).then((result) => {
      expect(result, 'Buyout status DB result should not be empty').to.have.length.greaterThan(0);
      const status = result[0].status;
      expect(['bought out', 'pending buyout']).to.include(status);
      cy.log(`✓ Verified: Subscription status in DB is "${status}"`);
    });
  }

  // ==================== NOTIFICATIONS ====================

  // Selector
  get successNotification() {
    return cy.get('[data-cy="notification-success"], .notification-success, [class*="toast"]')
      .filter(':visible');
  }

  // Action
  verifySuccessNotification() {
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="notification-success"]').length > 0) {
        cy.get('[data-cy="notification-success"]').should('be.visible');
      } else {
        cy.contains('Successfully').should('be.visible');
      }
    });
    cy.log('✓ Verified: Success notification displayed');
  }

  // ==================== RECURRING PAYMENTS SECTION ====================

  // Action
  setRPItemsPerPage(size) {
    cy.contains('p', 'Recurring payments').scrollIntoView();
    cy.contains('p', 'Recurring payments')
      .closest('.space-y-2')
      .within(() => {
        cy.get('[data-testid="select-page-size"]')
          .first()
          .find('button[aria-haspopup="listbox"]')
          .should('be.visible')
          .click();
      });
    cy.get('[role="listbox"]').should('be.visible').within(() => {
      cy.get('[role="option"]').contains(String(size)).click();
    });
    cy.log(`✓ Recurring Payments items per page set to ${size}`);
  }

  // Action
  // Anchors to the table via its unique "Recurring ID" column header,
  // then clicks the last button[role="button"] (the 3-dot) in the matching row.
  // Waits for HeadlessUI dropdown animation to complete before returning.
  openRecurringPaymentMenuById(rpId) {
    cy.contains('th', 'Recurring ID')
      .closest('table')
      .find('tbody td')
      .filter((_, el) => Cypress.$(el).text().trim() === String(rpId))
      .closest('tr')
      .find('button[role="button"]')
      .last()
      .click();
    cy.get('[role="menu"]').should('be.visible');
    cy.wait(500);
    cy.log(`✓ Opened 3-dot menu for Recurring Payment ID: ${rpId}`);
  }

  // Action
  clickDeleteRecurringPayment() {
    cy.contains('Delete recurring payment').click();
    cy.log('✓ Clicked Delete recurring payment');
  }

  // Action
  // clicks "I understand the consequences." label text to check the checkbox, then clicks Submit
  confirmDeleteRecurringPayment() {
    cy.contains('I understand the consequences.').click();
    cy.log('✓ Checked: I understand the consequences.');
    cy.contains('button', 'Submit').should('not.be.disabled').click();
    cy.log('✓ Confirmed: Delete recurring payment dialog submitted');
  }

  // Action
  // @param {string} context - label used in the log (e.g. 'Delete recurring payment', 'Mark as settled')
  closeSuccessDialog(context = 'action') {
    cy.contains('Successfully requested!').should('be.visible');
    cy.log('✓ Verified: Success message "Successfully requested!" displayed');
    cy.contains('button', 'Close').click();
    cy.log(`✓ Closed: ${context} success dialog`);
  }

  // Action
  clickChargeRecurringPayment() {
    cy.contains('Charge recurring payment').click();
    cy.log('✓ Clicked Charge recurring payment');
  }

  // Action
  // clicks "I understand the consequences." to check the checkbox, then clicks Submit
  confirmChargeRecurringPayment() {
    cy.contains('I understand the consequences.').click();
    cy.log('✓ Checked: I understand the consequences.');
    cy.contains('button', 'Submit').should('not.be.disabled').click();
    cy.log('✓ Confirmed: Charge recurring payment dialog submitted');
  }

  // Action
  // The Charge RP action shows "Your invoice was generated successfully!" (different from other RPs)
  closeChargeSuccessDialog() {
    cy.contains('Your invoice was generated successfully!').should('be.visible');
    cy.log('✓ Verified: Success message "Your invoice was generated successfully!" displayed');
    cy.contains('button', 'Close').click();
    cy.log('✓ Closed: Charge recurring payment success dialog');
  }

  // Action
  clickEditRecurringPayments() {
    cy.contains('Edit recurring payment(s)').click();
    cy.log('✓ Clicked Edit recurring payment(s)');
  }

  // Action
  // Selector uses aria-label which is stable and unique to this checkbox
  clickChangeAllFuturePayments() {
    cy.get('input[aria-label="Change all future payments"]').click();
    cy.log('✓ Checked: Change all future payments');
  }

  // Action
  // Anchors via the "Item Amount" label inside .v-field__field to avoid ambiguity with other inputs
  enterItemAmount(amount) {
    cy.contains('.v-label', 'Item Amount')
      .closest('.v-field__field')
      .find('input.v-field__input')
      .clear()
      .type(String(amount));
    cy.log(`✓ Entered Item Amount: ${amount}`);
  }

  // Action
  clickSubmitChanges() {
    this.submitChangesButton.should('not.be.disabled').click();
    cy.log('✓ Clicked Submit changes');
  }

  // Action
  clickMarkAsNotPaid() {
    cy.contains('Mark as not paid').click();
    cy.log('✓ Clicked Mark as not paid');
  }

  // Action
  confirmMarkAsNotPaid() {
    cy.wait(2000);
    cy.contains('button', 'Mark as not paid').should('not.be.disabled').click();
    cy.log('✓ Confirmed: Mark as not paid dialog submitted');
  }

  // Action
  clickMarkAsSettled() {
    cy.contains('Mark as settled').click();
    cy.log('✓ Clicked Mark as settled');
  }

  // Action
  confirmMarkAsSettled() {
    cy.wait(2000);
    cy.contains('button', 'Mark as settled').should('not.be.disabled').click();
    cy.log('✓ Confirmed: Mark as settled dialog submitted');
  }
}

export default new SubscriptionDetailPage();
