import SubscriptionListPage from '../../support/page-objects/02-subscription-page/SubscriptionListPage';
import SubscriptionDetailPage from '../../support/page-objects/02-subscription-page/SubscriptionDetailPage';
import SubscriptionWorkflowQueries from '../../support/helpers/02-subscription-page/subscription-workflow-queries';

// ─────────────────────────────────────────────────────────────────────────────
// Describe 1: Subscription Detail - 3-Dot Menu Actions
// ─────────────────────────────────────────────────────────────────────────────
describe('Subscription Detail - 3-Dot Menu Actions', () => {
  let testSubscriptionId;

  beforeEach(() => {
    // Load active subscription from DB, then navigate — all inside .then() so ID is set before use
    cy.task('queryDb', SubscriptionWorkflowQueries.getActiveSubscriptionForTests()).then((rows) => {
      if (rows && rows.length > 0) {
        testSubscriptionId = rows[0].subscription_id;
        cy.log(`✓ Found active subscription: ${testSubscriptionId}`);
      } else {
        throw new Error('No active subscription found for workflow testing');
      }
      // Navigate to subscription and open it — runs only after testSubscriptionId is assigned
      SubscriptionListPage.navigateToSubscriptionList();
      cy.wait(3000);
      SubscriptionListPage.clearAllFilters();
      SubscriptionListPage.searchBySubscriptionId(testSubscriptionId);
      SubscriptionListPage.clickOnSubscriptionFromList(testSubscriptionId);
      cy.wait(3000);
      cy.url().should('include', '/subscriptions/');
      cy.log(`✓ Verified: Navigated to subscription ${testSubscriptionId}`);
    });
  });

  // ==================== Test 1: Auto-renew subscription (Disable + Re-enable) ====================
  it('Test 1: should disable and re-enable auto-renew subscription', () => {
    cy.log('========== Test 1: Auto-renew Subscription ==========');

    // ─── PART 1: DISABLE AUTO-RENEW ───────────────────────────────────────────
    SubscriptionDetailPage.clickActionsMenu();
    SubscriptionDetailPage.clickAutoRenewSubscription();

    // Verify disable modal content
    SubscriptionDetailPage.verifyAutoRenewDisableModal();

    // Click Disable and verify success
    SubscriptionDetailPage.clickModalSubmit();
    SubscriptionDetailPage.verifyAndCloseSuccessModal();

    // Verify toggle is now disabled
    SubscriptionDetailPage.verifyAutoRenewToggle('false');
    cy.wait(5000);

    // ─── PART 2: RE-ENABLE AUTO-RENEW ─────────────────────────────────────────
    SubscriptionDetailPage.clickActionsMenu();
    SubscriptionDetailPage.clickAutoRenewSubscription();

    // Verify enable modal content
    SubscriptionDetailPage.verifyAutoRenewEnableModal();

    // Click Enable and verify success
    SubscriptionDetailPage.clickModalSubmit();
    SubscriptionDetailPage.verifyAndCloseSuccessModal();

    // Verify toggle is now re-enabled
    SubscriptionDetailPage.verifyAutoRenewToggle('true');

    cy.log('✓ Test 1 Completed: Auto-renew disable and re-enable verified');
  });

  // ==================== Test 2: Buyout subscription ====================
  it('Test 2: should complete the buyout subscription process', () => {
    cy.log('========== Test 2: Buyout Subscription ==========');

    SubscriptionDetailPage.clickActionsMenu();
    SubscriptionDetailPage.clickBuyoutSubscription();

    // Verify modal content and all pricing rows
    SubscriptionDetailPage.verifyBuyoutModal();
    SubscriptionDetailPage.enterInvoiceLineItemText('Buyout Tip Gratuity white');

    // Click Buyout and verify success
    SubscriptionDetailPage.clickModalSubmit();
    SubscriptionDetailPage.verifyAndCloseSuccessModal();

    // Verify subscription status in DB is 'bought out' or 'pending buyout'
    cy.wait(3000);
    SubscriptionDetailPage.verifyBuyoutStatusInDb(testSubscriptionId);

    cy.log('✓ Test 2 Completed: Buyout subscription process verified');
  });

  // ==================== Test 3: Change billing frequency ====================
  it('Test 3: should open change billing frequency modal and update frequency', () => {
    cy.log('========== Test 3: Change Billing Frequency ==========');

    SubscriptionDetailPage.clickActionsMenu();
    SubscriptionDetailPage.clickChangeBillingFrequency();

    // Verify modal content
    SubscriptionDetailPage.verifyChangeBillingFrequencyModal();

    // Update interval (if 1 → set 2, if not 1 → set 1), save, verify DB
    SubscriptionDetailPage.updateBillingFrequency(testSubscriptionId);

    cy.log('✓ Test 3 Completed: Billing frequency updated and reverted successfully');
  });

  // ==================== Test 4: Change quantity ====================
  it('Test 4: should change quantity to 5 for consumable subscription', () => {
    cy.log('========== Test 4: Change Quantity ==========');

    // Step 1: Set subscription_type = 'consumable' and quantity = 2 in DB using testSubscriptionId
    SubscriptionDetailPage.setupQuantityTestInDb(testSubscriptionId);

    // Step 2: Reload page so UI picks up consumable type (enables Change quantity menu item)
    cy.reload();
    cy.wait(3000);
    cy.url().should('include', '/subscriptions/');

    // Step 3: Open 3-dot menu → Change quantity → set 5 → save → verify success
    SubscriptionDetailPage.clickActionsMenu();
    SubscriptionDetailPage.clickChangeQuantity();
    SubscriptionDetailPage.changeQuantity(5);

    // Step 4: Verify quantity = 5 in DB
    SubscriptionDetailPage.verifyQuantityInDb(testSubscriptionId, 5);

    // Step 5: Revert DB — set subscription_type back to 'normal' and quantity = 2
    SubscriptionDetailPage.revertQuantityTestInDb(testSubscriptionId);

    cy.log('✓ Test 4 Completed: Quantity changed to 5, verified in DB, subscription reverted');
  });

  // ==================== Test 5: Change subscription attributes ====================
  it('Test 5: should change subscription length (+2) and installment unit price to 22', () => {
    cy.log('========== Test 5: Change Subscription Attributes ==========');

    // Open 3-dot menu → Change subscription attributes
    SubscriptionDetailPage.clickActionsMenu();
    SubscriptionDetailPage.clickChangeSubscriptionAttributes();

    // Verify modal content
    SubscriptionDetailPage.verifyChangeSubscriptionAttributesModal();

    // Set subscription length to 12 and price to 22, submit, verify success
    SubscriptionDetailPage.updateSubscriptionAttributes();

    cy.log('✓ Test 5 Completed: Subscription attributes updated, verified in DB, reverted');
  });

  // ==================== Test 6: Change subscription extension price ====================
  it('Test 6: should open change extension price modal, update price to 20, and verify success', () => {
    cy.log('========== Test 6: Change Subscription Extension Price ==========');

    SubscriptionDetailPage.clickActionsMenu();
    SubscriptionDetailPage.clickChangeExtensionPrice();

    // Verify modal content
    cy.contains('Change subscription extension price').should('be.visible');
    cy.contains('This action will overwrite the current extension price').should('be.visible');
    cy.contains('New extension price').should('be.visible');
    cy.contains('button', 'Close').should('be.visible');
    cy.contains('button', 'Confirm').should('be.visible');
    cy.log('✓ Verified: Change extension price modal content is correct');

    // Clear the input and set extension price to 20
    cy.get('input').filter(':visible').first().clear().type('20');
    cy.log('✓ Updated: Extension price set to 20');

    // Click Confirm and verify success message, then close
    SubscriptionDetailPage.confirmButton.click();
    SubscriptionDetailPage.verifyAndCloseSuccessModal();

    cy.log('✓ Test 6 Completed: Change subscription extension price updated to 20, verified, and closed');
  });

  // ==================== Test 7: Extend subscription ====================
  it('Test 7: should extend subscription by 5 billing cycles and verify success', () => {
    cy.log('========== Test 7: Extend Subscription ==========');

    SubscriptionDetailPage.clickActionsMenu();
    SubscriptionDetailPage.clickExtendSubscription();

    // Verify modal content
    cy.contains('Extend subscription').should('be.visible');
    cy.contains('Current end date').should('be.visible');
    cy.contains('Extend by billing cycles').should('be.visible');
    cy.contains('New end date').should('be.visible');
    cy.contains('button', 'Close').should('be.visible');
    cy.contains('button', 'Confirm').should('be.visible');
    cy.log('✓ Verified: Extend subscription modal content is correct');

    // Set billing cycles to 5
    cy.get('input[type="number"]').first().clear().type('5');
    cy.log('✓ Updated: Billing cycles set to 5');

    // Click Confirm and verify success message, then close
    SubscriptionDetailPage.confirmButton.click();
    cy.contains('Successfully requested!').should('be.visible');
    cy.log('✓ Verified: Success message "Successfully requested!" displayed');
    SubscriptionDetailPage.clickModalClose();

    cy.log('✓ Test 7 Completed: Subscription extended by 5 billing cycles, verified, and closed');
  });

  // ==================== Test 8a: Reactivate subscription ====================
  it('Test 8: should reactivate a pending return subscription and verify success', () => {
    cy.log('========== Test 8a: Reactivate Subscription ==========');

    // Set subscription status to 'pending return' in DB
    cy.task('queryDb', SubscriptionWorkflowQueries.setSubscriptionStatusToPendingReturn(testSubscriptionId));
    cy.log('✓ DB Setup: Subscription status set to pending return');

    // Reload so UI reflects the new status
    cy.reload();
    cy.wait(3000);

    // Click Reactivate subscription from menu
    SubscriptionDetailPage.clickActionsMenu();
    SubscriptionDetailPage.clickReactivateSubscription();

    // Click Confirm
    SubscriptionDetailPage.confirmButton.click();

    // Verify success message and close
    cy.contains('Successfully requested!').should('be.visible');
    cy.log('✓ Verified: Success message "Successfully requested!" displayed');
    SubscriptionDetailPage.clickModalClose();

    // Verify subscription status is active in DB
    cy.wait(3000);
    cy.task('queryDb', SubscriptionWorkflowQueries.verifySubscriptionStatus(testSubscriptionId, 'active')).then((result) => {
      expect(result).to.have.length.greaterThan(0);
      cy.log(`✓ Verified: Subscription status is active in DB`);
    });

    cy.log('✓ Test 8 Completed: Subscription reactivated and verified');
  });

  // ==================== Test 9: Replace serial number ====================
  it('Test 9: should replace serial number with a new random SN and verify success', () => {
    cy.log('========== Test 9: Replace Serial Number ==========');

    // Fetch current serial number from DB
    cy.task('queryDb', SubscriptionWorkflowQueries.getSubscriptionDetails(testSubscriptionId)).then((rows) => {
      const currentSerialNumber = rows[0].serial_number;
      cy.log(`✓ Fetched current serial number: ${currentSerialNumber}`);

      SubscriptionDetailPage.clickActionsMenu();
      SubscriptionDetailPage.clickReplaceSerialNumber();

      // Enter a random new serial number
      const newSerialNumber = `SN-${Date.now()}`;
      cy.get('[data-cy="new-serial-number"]').filter(':visible').first().clear().type(newSerialNumber);
      cy.log(`✓ Entered new serial number: ${newSerialNumber}`);

      // Enter the current serial number in the Previous serial number field
      cy.get('[data-cy="prev-serial-number"]').filter(':visible').first().clear().type(currentSerialNumber);
      cy.log(`✓ Entered previous serial number: ${currentSerialNumber}`);

      // Click Confirm and verify success message, then close
      SubscriptionDetailPage.confirmButton.click();
      cy.contains('Successfully requested!').should('be.visible');
      cy.log('✓ Verified: Success message "Successfully requested!" displayed');
      SubscriptionDetailPage.clickModalClose();

      // Verify new serial number is updated in DB
      cy.wait(3000);
      cy.task('queryDb', SubscriptionWorkflowQueries.getSubscriptionDetails(testSubscriptionId)).then((rows) => {
        expect(rows[0].serial_number).to.equal(newSerialNumber);
        cy.log(`✓ Verified: serial_number updated to "${newSerialNumber}" in DB`);
      });
    });

    cy.log('✓ Test 9 Completed: Serial number replaced and verified');
  });

  // ==================== Test 10: Set as ended ====================
  it('Test 10: should set subscription as ended and verify status in DB', () => {
    cy.log('========== Test 10: Set as Ended ==========');

    // Set subscription_type to 'digital' in DB to enable "Set as ended" menu item
    cy.task('queryDb', SubscriptionWorkflowQueries.setSubscriptionTypeToDigital(testSubscriptionId));
    cy.log('✓ DB Setup: subscription_type set to digital');

    // Reload so UI reflects the new type
    cy.reload();
    cy.wait(3000);

    // Click Set as ended from menu
    SubscriptionDetailPage.clickActionsMenu();
    SubscriptionDetailPage.clickSetAsEnded();

    // Click Confirm and verify success message, then close
    SubscriptionDetailPage.confirmButton.click();
    cy.contains('Successfully requested!').should('be.visible');
    cy.log('✓ Verified: Success message "Successfully requested!" displayed');
    SubscriptionDetailPage.clickModalClose();

    // Verify subscription status is 'ended' in DB
    cy.wait(3000);
    cy.task('queryDb', SubscriptionWorkflowQueries.verifySubscriptionStatus(testSubscriptionId, 'ended')).then((result) => {
      expect(result).to.have.length.greaterThan(0);
      cy.log('✓ Verified: Subscription status is "ended" in DB');
    });

    cy.log('✓ Test 10 Completed: Subscription set as ended and verified');
  });

  // ==================== Test 11: Set as pending return ====================
  it('Test 11: should set subscription to pending return and verify status in DB', () => {
    cy.log('========== Test 11: Set as Pending Return ==========');

    // Click Set as pending return from menu
    SubscriptionDetailPage.clickActionsMenu();
    SubscriptionDetailPage.clickSetAsPendingReturn();

    // Check the 'Delete future recurring payments' checkbox
    cy.get('input[type="checkbox"]').check({ force: true });
    cy.log('✓ Checked: Delete future recurring payments');

    // Click Confirm and verify success message, then close
    SubscriptionDetailPage.confirmButton.click();
    cy.contains('Successfully requested!').should('be.visible');
    cy.log('✓ Verified: Success message "Successfully requested!" displayed');
    SubscriptionDetailPage.clickModalClose();

    // Verify subscription status is 'pending return' in DB
    cy.wait(3000);
    cy.task('queryDb', SubscriptionWorkflowQueries.verifySubscriptionStatus(testSubscriptionId, 'pending return')).then((result) => {
      expect(result).to.have.length.greaterThan(0);
      cy.log('✓ Verified: Subscription status is "pending return" in DB');
    });

    cy.log('✓ Test 11 Completed: Subscription set to pending return and verified');
  });

  // ==================== Test 12: Swap subscription item ====================
  it('Test 12: should swap subscription item and verify status is pending replacement in DB', () => {
    cy.log('========== Test 12: Swap Subscription Item ==========');

    // Click Swap subscription item from menu
    SubscriptionDetailPage.clickActionsMenu();
    SubscriptionDetailPage.clickSwapSubscriptionItem();

    // Click Continue then Submit
    SubscriptionDetailPage.continueButton.click();
    cy.log('✓ Clicked: Continue');
    SubscriptionDetailPage.submitButton.click();
    cy.log('✓ Clicked: Submit');

    // Verify success message and close
    cy.contains('Successfully requested!').should('be.visible');
    cy.log('✓ Verified: Success message "Successfully requested!" displayed');
    SubscriptionDetailPage.clickModalClose();

    // Verify subscription status is 'pending replacement' in DB
    cy.wait(3000);
    cy.task('queryDb', SubscriptionWorkflowQueries.verifySubscriptionStatus(testSubscriptionId, 'pending replacement')).then((result) => {
      expect(result).to.have.length.greaterThan(0);
      cy.log('✓ Verified: Subscription status is "pending replacement" in DB');
    });

    cy.log('✓ Test 12 Completed: Subscription item swapped and verified');
  });

  // ==================== Test 13: View order ====================
  it('Test 13: should redirect to order detail page when clicking View order', () => {
    cy.log('========== Test 13: View Order ==========');

    SubscriptionDetailPage.clickActionsMenu();
    SubscriptionDetailPage.clickViewOrder();

    cy.wait(3000);
    cy.url().should('include', '/orders/');
    cy.log('✓ Verified: Redirected to Order detail page');

    cy.log('✓ Test 13 Completed: View order redirect verified');
  });

});
