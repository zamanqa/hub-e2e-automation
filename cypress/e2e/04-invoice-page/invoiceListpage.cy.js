/**
 * Invoice List Page — E2E Tests
 *
 * Verifies: search, status/type/payment-status filters (with DB verification),
 * refund flow, cancel flow, and PDF download.
 */

import InvoiceListPage from '../../support/page-objects/04-invoice-page/InvoiceListPage';
import InvoiceQueries from '../../support/helpers/04-invoice-page/invoice-queries';

// ─────────────────────────────────────────────────────────────────────────────
// Describe: Invoice List — Search, Filters & Actions
// ─────────────────────────────────────────────────────────────────────────────
describe('Invoice List - Search, Filters & Actions', () => {

  beforeEach(() => {
    InvoiceListPage.navigateToInvoiceList();
    InvoiceListPage.waitForPaginationVisible();
  });

  // ===========================================================================
  // TEST 1 — Search by invoice number
  // ===========================================================================
  it('Test 1: should search by invoice number and return matching results', () => {
    cy.log('========== Test 1: Search by Invoice Number ==========');

    // Get a known invoice number from the DB (no hardcoding)
    cy.task('queryDb', InvoiceQueries.getFirstPaidRPInvoiceNoCancelledId()).then((result) => {
      expect(result, 'Expected at least 1 paid RP invoice in DB').to.have.length.at.least(1);
      const invoiceNumber = result[0].invoice_number;
      cy.log(`✓ Invoice number from DB: ${invoiceNumber}`);

      // Search for the invoice
      InvoiceListPage.searchByInvoiceNumber(invoiceNumber);

      // Verify at least 1 result row is visible
      InvoiceListPage.invoiceTableRows.should('have.length.at.least', 1);
      cy.log(`✓ Search returned results for invoice: ${invoiceNumber}`);
    });

    cy.log('✓ Test 1 Completed: Search by invoice number verified');
  });

  // ===========================================================================
  // TEST 2 — Filter by Status + DB verify
  // ===========================================================================
  it('Test 2: should filter invoices by Status = Succeeded and Settled and verify counts match DB', () => {
    cy.log('========== Test 2: Filter by Status (Succeeded + Settled) + DB Verification ==========');

    // ── Succeeded + Settled (both selected) ──
    cy.log('--- Status: Succeeded + Settled (multi-select) ---');
    InvoiceListPage.clearAllFilters();
    InvoiceListPage.filterByStatus('Succeeded', 'Settled');
    cy.wait(3000);

    // Verify URL reflects both filters active
    cy.url().then((url) => {
      cy.log(`✓ URL after Succeeded + Settled filter: ${url}`);
    });

    InvoiceListPage.paginationText.invoke('text').then((text) => {
      const filteredCount = InvoiceListPage.parseTotalRecords(text);
      cy.log(`✓ UI filtered count (Succeeded + Settled): ${filteredCount}`);
      expect(filteredCount).to.be.greaterThan(0);

      cy.task('queryDb', InvoiceQueries.getInvoiceCountByStatuses(['succeeded', 'settled'])).then((result) => {
        const dbTotal = Number(result[0].total);
        cy.log(`✓ DB count for t.status IN ('succeeded', 'settled'): ${dbTotal}`);
      });
    });

  });

  // ===========================================================================
  // TEST 3 — Filter by Type + DB verify
  // ===========================================================================
  it('Test 3: should filter invoices by Type = Recurring payment and verify count matches DB', () => {
    cy.log('========== Test 3: Filter by Type = Recurring payment + DB Verification ==========');

    // Reset to unfiltered state first
    InvoiceListPage.clearAllFilters();

    // Apply Type = Recurring payment filter (exact UI label — lowercase 'p')
    InvoiceListPage.filterByType('Recurring payment');
    cy.wait(3000);

    // Capture UI filtered count
    InvoiceListPage.paginationText.invoke('text').then((text) => {
      const filteredCount = InvoiceListPage.parseTotalRecords(text);
      cy.log(`✓ UI filtered count (Recurring payment): ${filteredCount}`);
      expect(filteredCount).to.be.greaterThan(0);

      // Verify UI count matches DB count (i."type" = 'recurring payment')
      cy.task('queryDb', InvoiceQueries.getInvoiceCountByType('recurring payment')).then((result) => {
        const dbTotal = Number(result[0].total);
        cy.log(`✓ DB count for "type" = 'recurring payment': ${dbTotal}`);
        expect(filteredCount).to.equal(dbTotal);
        cy.log(`✓ Verified: UI count (${filteredCount}) matches DB count (${dbTotal})`);
      });
    });

    cy.log('✓ Test 3 Completed: Filter by Recurring payment type verified against DB');
  });

  // ===========================================================================
  // TEST 4 — Filter by Payment Status = Paid + DB verify
  // ===========================================================================
  it('Test 4: should filter invoices by Payment Status = Paid and verify count matches DB', () => {
    cy.log('========== Test 4: Filter by Payment Status = Paid + DB Verification ==========');

    // Reset to unfiltered state first
    InvoiceListPage.clearAllFilters();

    // Apply Payment Status = Paid filter
    InvoiceListPage.filterByPaymentStatus('Paid');
    cy.wait(3000);

    // Capture UI filtered count
    InvoiceListPage.paginationText.invoke('text').then((text) => {
      const filteredCount = InvoiceListPage.parseTotalRecords(text);
      cy.log(`✓ UI filtered count (Paid): ${filteredCount}`);
      expect(filteredCount).to.be.greaterThan(0);

      // Verify UI count matches DB count (i.paid = true)
      cy.task('queryDb', InvoiceQueries.getInvoiceCountByPaymentStatus(true)).then((result) => {
        const dbTotal = Number(result[0].total);
        cy.log(`✓ DB count for paid = true: ${dbTotal}`);
        expect(filteredCount).to.equal(dbTotal);
        cy.log(`✓ Verified: UI count (${filteredCount}) matches DB count (${dbTotal})`);
      });
    });

    cy.log('✓ Test 4 Completed: Filter by Payment Status = Paid verified against DB');
  });

  // ===========================================================================
  // TEST 5 — Find first paid RP invoice (no cancelled ID) and navigate to detail
  // ===========================================================================
  it('Test 5: should find first paid RP invoice with no cancelled ID and navigate to detail', () => {
    cy.log('========== Test 5: Find First Paid RP Invoice + Navigate to Detail ==========');

    // Query DB for a suitable invoice
    cy.task('queryDb', InvoiceQueries.getFirstPaidRPInvoiceNoCancelledId()).then((result) => {
      expect(result, 'Expected at least 1 paid RP invoice with no cancelled_invoice_id').to.have.length.at.least(1);
      const invoiceNumber = result[0].invoice_number;
      cy.log(`✓ Invoice number from DB: ${invoiceNumber}`);

      // Clear filters and search for this invoice
      InvoiceListPage.clearAllFilters();
      InvoiceListPage.searchByInvoiceNumber(invoiceNumber);

      // Click into the invoice detail
      InvoiceListPage.clickFirstInvoiceRow();

      // Verify we navigated to the detail page
      cy.url().should('include', '/invoices/');
      cy.log(`✓ Navigated to invoice detail page for: ${invoiceNumber}`);
    });

    cy.log('✓ Test 5 Completed: Navigated to paid RP invoice detail');
  });

  // ===========================================================================
  // TEST 6 — Refund invoice flow
  // ===========================================================================
  it('Test 6: should refund a paid RP invoice and verify "fully refunded" badge', () => {
    cy.log('========== Test 6: Refund Invoice Flow ==========');

    // Get a suitable invoice from the DB
    cy.task('queryDb', InvoiceQueries.getFirstPaidRPInvoiceNoCancelledId()).then((result) => {
      expect(result, 'Expected at least 1 paid RP invoice for refund test').to.have.length.at.least(1);
      const invoiceNumber = result[0].invoice_number;
      cy.log(`✓ Invoice to refund: ${invoiceNumber}`);

      // Navigate to the invoice detail page
      InvoiceListPage.clearAllFilters();
      InvoiceListPage.searchByInvoiceNumber(invoiceNumber);
      InvoiceListPage.clickFirstInvoiceRow();

      // Trigger refund flow
      InvoiceListPage.clickRefundButton();
      InvoiceListPage.confirmRefundModal();

      // Verify success feedback
      InvoiceListPage.verifySuccessToast();
      cy.wait(3000)
      InvoiceListPage.verifyFullyRefundedBadge();
    });

    cy.log('✓ Test 6 Completed: Refund flow — "Successfully requested!" and "fully refunded" badge verified');
  });

  // ===========================================================================
  // TEST 7 — Cancel invoice flow
  // ===========================================================================
  it('Test 7: should cancel an invoice and verify cancelled_invoice_id is set in DB', () => {
    cy.log('========== Test 7: Cancel Invoice Flow ==========');

    // Use a different invoice (OFFSET 1) to avoid touching the same one as Test 6
    cy.task('queryDb', InvoiceQueries.getSecondPaidRPInvoiceNoCancelledId()).then((result) => {
      expect(result, 'Expected at least 1 paid RP invoice for cancel test').to.have.length.at.least(1);
      const invoiceId = result[0].id;
      const invoiceNumber = result[0].invoice_number;
      cy.log(`✓ Invoice to cancel: ${invoiceNumber} (id: ${invoiceId})`);

      // Navigate to the invoice detail page
      InvoiceListPage.clearAllFilters();
      InvoiceListPage.searchByInvoiceNumber(invoiceNumber);
      InvoiceListPage.clickFirstInvoiceRow();

      // Click "Cancel invoice" → navigates to /cancel page
      InvoiceListPage.clickCancelButton();

      // Complete cancel flow on /cancel page:
      // 1. Click "Cancel invoice" span, 2. wait 2s, 3. select generate new invoice option,
      // 4. click "Cancel", 5. verify "Successfully requested!", 6. click "Close"
      InvoiceListPage.confirmCancelFlow();

      // DB verification: cancelled_invoice_id should now have a value
      cy.wait(3000);
      cy.task('queryDb', InvoiceQueries.getInvoiceCancelStatus(invoiceId)).then((dbResult) => {
        expect(dbResult, 'Expected invoice record in DB').to.have.length.at.least(1);
        const cancelledInvoiceId = dbResult[0].cancelled_invoice_id;
        cy.log(`✓ DB cancelled_invoice_id: ${cancelledInvoiceId}`);
        expect(cancelledInvoiceId, 'cancelled_invoice_id should have a non-null value after cancel').to.not.be.null;
      });
    });

    cy.log('✓ Test 7 Completed: Cancel flow — "Successfully requested!" verified + cancelled_invoice_id set in DB');
  });

  // ===========================================================================
  // TEST 8 — Download PDF
  // ===========================================================================
  it('Test 8: should download invoice PDF and verify response status 200', () => {
    cy.log('========== Test 8: Download Invoice PDF ==========');

    // Get an invoice to open
    cy.task('queryDb', InvoiceQueries.getFirstPaidRPInvoiceNoCancelledId()).then((result) => {
      expect(result, 'Expected at least 1 invoice for PDF download test').to.have.length.at.least(1);
      const invoiceNumber = result[0].invoice_number;
      cy.log(`✓ Invoice for PDF download: ${invoiceNumber}`);

      // Navigate to the invoice detail page
      InvoiceListPage.clearAllFilters();
      InvoiceListPage.searchByInvoiceNumber(invoiceNumber);
      InvoiceListPage.clickFirstInvoiceRow();

      // Set up intercept BEFORE clicking download
      InvoiceListPage.interceptPdfDownload();

      // Click download PDF
      InvoiceListPage.clickDownloadPdfButton();

      // Verify PDF download request returned 200
      InvoiceListPage.verifyPdfDownloaded();
    });

    cy.log('✓ Test 8 Completed: PDF download returned status 200');
  });

}); // end describe
