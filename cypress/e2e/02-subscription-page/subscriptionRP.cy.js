import SubscriptionListPage from '../../support/page-objects/SubscriptionListPage';
import SubscriptionDetailPage from '../../support/page-objects/SubscriptionDetailPage';
import SubscriptionRPQueries from '../../support/helpers/subscription-rp-queries';

// ─────────────────────────────────────────────────────────────────────────────
// Describe: Subscription Detail - Recurring Payments Actions
// ─────────────────────────────────────────────────────────────────────────────
describe('Subscription Detail - Recurring Payments Actions', () => {
  let testSubscriptionId;
  let rp1, rp2, rp3, rp4;

  beforeEach(() => {
    cy.task('queryDb', SubscriptionRPQueries.getActiveSubscriptionWithRPs()).then((rows) => {
      if (rows && rows.length > 0) {
        testSubscriptionId = rows[0].subscription_id;
        rp1 = rows[0].rp1;
        rp2 = rows[0].rp2;
        rp3 = rows[0].rp3;
        rp4 = rows[0].rp4;
        cy.log(`✓ Subscription: ${testSubscriptionId} | RP1: ${rp1} | RP2: ${rp2} | RP3: ${rp3} | RP4: ${rp4}`);
      } else {
        throw new Error('No active subscription found for RP testing');
      }

      SubscriptionListPage.navigateToSubscriptionList();
      cy.wait(3000);
      SubscriptionListPage.clearAllFilters();
      SubscriptionListPage.searchBySubscriptionId(testSubscriptionId);
      SubscriptionListPage.clickOnSubscriptionFromList(testSubscriptionId);
      cy.wait(3000);
      cy.url().should('include', '/subscriptions/');
      cy.log(`✓ Navigated to subscription ${testSubscriptionId}`);
    });
  });

  // ==================== Test 1: Delete recurring payment ====================
  it('Test 1: should delete RP1 and verify deleted_at is set in DB', () => {
    cy.log('========== Test 1: Delete Recurring Payment ==========');

    cy.task('queryDb', SubscriptionRPQueries.getRPCount(testSubscriptionId)).then((rows) => {
      const initialCount = Number(rows[0].rp_count);
      cy.log(`✓ Initial RP count: ${initialCount}`);

      // Step 1: Set items per page to 50 so all RPs are visible
      SubscriptionDetailPage.setRPItemsPerPage(50);

      // Step 2: Find the row with RP1 and open its 3-dot menu
      SubscriptionDetailPage.openRecurringPaymentMenuById(rp1);

      // Step 3: Click "Delete recurring payment" from the open dropdown
      SubscriptionDetailPage.clickDeleteRecurringPayment();

      // Step 4: Check the consent checkbox and submit the confirmation dialog
      SubscriptionDetailPage.confirmDeleteRecurringPayment();

      // Step 5: Verify success message and close the dialog
      SubscriptionDetailPage.closeSuccessDialog('Delete recurring payment');

      // Step 6: Verify RP count decreased by 1 in DB
      cy.wait(3000);
      cy.task('queryDb', SubscriptionRPQueries.getRPCount(testSubscriptionId)).then((newRows) => {
        const newCount = Number(newRows[0].rp_count);
        expect(newCount).to.equal(initialCount - 1);
        cy.log(`✓ Verified: RP count decreased from ${initialCount} to ${newCount}`);
      });

      // Step 7: Verify deleted_at IS NOT NULL for RP1 in DB
      cy.task('queryDb', SubscriptionRPQueries.verifyRPDeleted(rp1)).then((result) => {
        expect(result).to.have.length.greaterThan(0);
        expect(result[0].deleted_at).to.not.be.null;
        cy.log(`✓ Verified: RP1 (${rp1}) deleted_at is set → ${result[0].deleted_at}`);
      });
    });

    cy.log('✓ Test 1 Completed: RP1 deleted and DB verified');
  });

  // ==================== Test 2: Mark recurring payment as settled ====================
  it('Test 2: should mark RP2 as settled and verify payment_settled = true in DB', () => {
    cy.log('========== Test 2: Mark Recurring Payment as Settled ==========');

    // Step 1: Set items per page to 50 so all RPs are visible
    SubscriptionDetailPage.setRPItemsPerPage(50);

    // Step 2: Find the row with RP2 and open its 3-dot menu
    SubscriptionDetailPage.openRecurringPaymentMenuById(rp2);

    // Step 3: Click "Mark as settled" from the open dropdown
    SubscriptionDetailPage.clickMarkAsSettled();

    // Step 4: Wait 2 seconds and click "Mark as settled" in the confirmation dialog
    SubscriptionDetailPage.confirmMarkAsSettled();

    // Step 5: Verify success message and close the dialog
    SubscriptionDetailPage.closeSuccessDialog('Mark as settled');

    // Step 6: Verify payment_settled = true for RP2 in DB
    cy.wait(3000);
    cy.task('queryDb', SubscriptionRPQueries.verifyRPSettled(rp2)).then((result) => {
      expect(result).to.have.length.greaterThan(0);
      expect(result[0].payment_settled).to.be.true;
      cy.log(`✓ Verified: RP2 (${rp2}) payment_settled = true in DB`);
    });

    cy.log('✓ Test 2 Completed: RP2 marked as settled and DB verified');
  });

  // ==================== Test 3: Mark recurring payment as not paid ====================
  it('Test 3: should mark RP3 as not paid and verify payment_settled = false in DB', () => {
    cy.log('========== Test 3: Mark Recurring Payment as Not Paid ==========');

    // Step 1: Set payment_settled = true for RP3 in DB so "Mark as not paid" is available in UI
    cy.task('queryDb', SubscriptionRPQueries.setRPSettled(rp3));
    cy.log(`✓ DB Setup: RP3 (${rp3}) payment_settled set to true`);

    // Step 2: Set items per page to 50 so all RPs are visible
    SubscriptionDetailPage.setRPItemsPerPage(50);

    // Step 3: Find the row with RP3 and open its 3-dot menu
    SubscriptionDetailPage.openRecurringPaymentMenuById(rp3);

    // Step 4: Click "Mark as not paid" from the open dropdown
    SubscriptionDetailPage.clickMarkAsNotPaid();

    // Step 5: Click "Mark as not paid" in the confirmation dialog
    SubscriptionDetailPage.confirmMarkAsNotPaid();

    // Step 6: Verify success message and close the dialog
    SubscriptionDetailPage.closeSuccessDialog('Mark as not paid');

    // Step 7: Verify payment_settled = false for RP3 in DB
    cy.wait(3000);
    cy.task('queryDb', SubscriptionRPQueries.verifyRPNotSettled(rp3)).then((result) => {
      expect(result).to.have.length.greaterThan(0);
      expect(result[0].payment_settled).to.be.false;
      cy.log(`✓ Verified: RP3 (${rp3}) payment_settled = false in DB`);
    });

    cy.log('✓ Test 3 Completed: RP3 marked as not paid and DB verified');
  });

  // ==================== Test 4: Charge recurring payment ====================
  it('Test 4: should charge RP4 and verify invoice_id is set in DB', () => {
    cy.log('========== Test 4: Charge Recurring Payment ==========');

    // Step 1: Set items per page to 50 so all RPs are visible
    SubscriptionDetailPage.setRPItemsPerPage(50);

    // Step 2: Find the row with RP4 and open its 3-dot menu
    SubscriptionDetailPage.openRecurringPaymentMenuById(rp4);

    // Step 3: Click "Charge recurring payment" from the open dropdown
    SubscriptionDetailPage.clickChargeRecurringPayment();

    // Step 4: Check "I understand the consequences." and click Submit
    SubscriptionDetailPage.confirmChargeRecurringPayment();

    // Step 5: Verify success message and close the dialog
    SubscriptionDetailPage.closeChargeSuccessDialog();

    // Step 6: Wait 10 seconds for the charge to be processed
    cy.wait(10000);

    // Step 7: Verify invoice_id IS NOT NULL for RP4 in DB
    cy.task('queryDb', SubscriptionRPQueries.verifyRPInvoiced(rp4)).then((result) => {
      expect(result).to.have.length.greaterThan(0);
      expect(result[0].invoice_id).to.not.be.null;
      cy.log(`✓ Verified: RP4 (${rp4}) invoice_id = ${result[0].invoice_id} in DB`);
    });

    cy.log('✓ Test 4 Completed: RP4 charged and invoice_id verified in DB');
  });

  // ==================== Test 5: Edit recurring payment amount ====================
  it('Test 5: should edit RP1 item amount to 20 and verify amount updated in DB', () => {
    cy.log('========== Test 5: Edit Recurring Payment Amount ==========');

    // Step 1: Set items per page to 50 so all RPs are visible
    SubscriptionDetailPage.setRPItemsPerPage(50);

    // Step 2: Find the row with RP1 and open its 3-dot menu
    SubscriptionDetailPage.openRecurringPaymentMenuById(rp1);

    // Step 3: Click "Edit recurring payment(s)" from the open dropdown
    SubscriptionDetailPage.clickEditRecurringPayments();

    // Step 4: Click the "Change all future payments" checkbox
    SubscriptionDetailPage.clickChangeAllFuturePayments();

    // Step 5: Clear the Item Amount field and enter 20
    SubscriptionDetailPage.enterItemAmount(20);

    // Step 6: Click "Submit changes"
    SubscriptionDetailPage.clickSubmitChanges();

    // Step 7: Verify success message and close the dialog
    SubscriptionDetailPage.closeSuccessDialog('Edit recurring payment(s)');

    // Step 8: Verify amount = '20.0000' for RP1 in DB
    cy.wait(3000);
    cy.task('queryDb', SubscriptionRPQueries.verifyRPAmount(rp1)).then((result) => {
      expect(result).to.have.length.greaterThan(0);
      expect(String(result[0].amount)).to.equal('20.0000');
      cy.log(`✓ Verified: RP1 (${rp1}) amount = ${result[0].amount} in DB`);
    });

    cy.log('✓ Test 5 Completed: RP1 item amount updated to 20 and DB verified');
  });

});
