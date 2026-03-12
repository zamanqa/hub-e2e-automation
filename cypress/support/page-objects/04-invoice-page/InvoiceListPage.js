/**
 * Invoice List Page Object
 * Contains selectors and actions for the Invoice List page and Invoice Detail page.
 * No UI interactions until the live page is inspected — HeadlessUI IDs are confirmed
 * at implementation time by inspecting the actual rendered components.
 */

class InvoiceListPage {
  // ==================== NAVIGATION ====================

  // Action
  navigateToInvoiceList() {
    cy.visit(Cypress.env('baseUrl') + 'en/cms/invoices');
    cy.wait(5000);
    cy.log('✓ Navigated to Invoice List page');
  }

  // ==================== PAGINATION TEXT ====================

  // Selector
  // .first() prevents double-match from top + bottom pagination bars
  get paginationText() {
    return cy.get('[data-testid="from-to-of-total"]').first();
  }

  // Action
  waitForPaginationVisible() {
    this.paginationText.should('be.visible');
    cy.log('✓ Pagination text is visible');
  }

  // Helper — extract total from "1-10 of 874" → 874
  parseTotalRecords(text) {
    const match = text.match(/of\s+(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  // ==================== SEARCH ====================

  // Selector
  get searchInput() {
    return cy.get('.w-64 input[placeholder="Search..."]');
  }

  // Action
  searchByInvoiceNumber(invoiceNumber) {
    this.searchInput.should('be.visible').click({ multiple: true });
    this.searchInput.type(invoiceNumber);
    cy.wait(2000);
    cy.log(`✓ Searched for invoice number: ${invoiceNumber}`);
  }

  // ==================== TABLE ====================

  // Selector
  get invoiceTableRows() {
    return cy.get('tbody tr');
  }

  // Action
  clickFirstInvoiceRow() {
    this.invoiceTableRows.should('have.length.at.least', 1);
    this.invoiceTableRows.first().find('a[href*="/invoices/"]').first().click({ force: true });
    cy.wait(2000);
    cy.log('✓ Clicked first invoice row (ID cell)');
  }

  // ==================== FILTERS ====================

  // Selector
  get clearFiltersButton() {
    return cy.contains('button', 'Clear');
  }

  // Action
  clearAllFilters() {
    this.clearFiltersButton.click();
    cy.wait(2000);
    cy.log('✓ Cleared all filters');
  }

  // Selector
  // HeadlessUI listbox button (v-0-2-3): has "Recurring payment" option
  get typeDropdown() {
    return cy.get('#headlessui-listbox-button-v-0-2-3');
  }

  // Action
  filterByType(type) {
    this.typeDropdown.should('be.visible').click();
    cy.get('[role="option"]').contains(type).should('be.visible').click();
    this.waitForPaginationVisible();
    cy.log(`✓ Filtered by Type: "${type}"`);
  }

  // Selector
  get statusDropdown() {
    return cy.get('#headlessui-listbox-button-v-0-2-5');
  }

  // Action
  // Dropdown stays open (multi-select) — opens once, clicks each with 2s gap
  // Pass multiple strings to multi-select: filterByStatus('Succeeded', 'Settled')
  filterByStatus(...statuses) {
    this.statusDropdown.should('be.visible').click(); // open dropdown once
    statuses.forEach((status, index) => {
      cy.get('[role="option"]').contains(status).should('be.visible').click();
      if (index < statuses.length - 1) {
        cy.wait(2000); // wait between selections so each click registers
      }
    });
    cy.get('body').click(0, 0); // close dropdown after all selections
    this.waitForPaginationVisible();
    cy.log(`✓ Filtered by Status: "${statuses.join(', ')}"`);
  }

  // Selector
  get paymentStatusDropdown() {
    return cy.get('#headlessui-listbox-button-v-0-2-7');
  }

  // Action
  filterByPaymentStatus(status) {
    this.paymentStatusDropdown.should('be.visible').click();
    cy.get('[role="option"]').contains(status).should('be.visible').click();
    this.waitForPaginationVisible();
    cy.log(`✓ Filtered by Payment Status: "${status}"`);
  }

  // ==================== PAGINATION CONTROLS ====================

  // Selector
  // .first() because page renders top + bottom pagination bars
  get firstPageButton() {
    return cy.get('[data-testid="btn-go-to-first"]').first();
  }

  // Action
  clickFirstPage() {
    this.firstPageButton.click();
    cy.wait(2000);
    this.waitForPaginationVisible();
    cy.log('✓ Clicked: First page');
  }

  // Selector
  get prevPageButton() {
    return cy.get('[data-testid="btn-prev-page"]').first();
  }

  // Action
  clickPrevPage() {
    this.prevPageButton.click();
    cy.wait(2000);
    this.waitForPaginationVisible();
    cy.log('✓ Clicked: Previous page');
  }

  // Selector
  get nextPageButton() {
    return cy.get('[data-testid="btn-next-page"]').first();
  }

  // Action
  clickNextPage() {
    this.nextPageButton.click();
    cy.wait(2000);
    this.waitForPaginationVisible();
    cy.log('✓ Clicked: Next page');
  }

  // Selector
  get lastPageButton() {
    return cy.get('[data-testid="btn-go-to-last"]').first();
  }

  // Action
  clickLastPage() {
    this.lastPageButton.click();
    cy.wait(2000);
    this.waitForPaginationVisible();
    cy.log('✓ Clicked: Last page');
  }

  // Selector
  get pageSizeDropdown() {
    return cy.get('[data-testid="select-page-size"]').first();
  }

  // Action
  changePageSize(size) {
    this.pageSizeDropdown
      .find('button[aria-haspopup="listbox"]')
      .should('be.visible')
      .click();
    cy.get('[role="listbox"]').should('be.visible').within(() => {
      cy.get('[role="option"]').contains(String(size)).click();
    });
    cy.wait(2000);
    this.waitForPaginationVisible();
    cy.log(`✓ Changed page size to: ${size}`);
  }

  // ==================== INVOICE DETAIL — REFUND ====================

  // Selector
  get refundButton() {
    return cy.contains('button', 'Refund');
  }

  // Action
  clickRefundButton() {
    this.refundButton.should('be.visible').and('not.be.disabled').click();
    cy.wait(2000);
    cy.log('✓ Clicked: Refund button');
  }

  // Selector
  get fullRefundOption() {
    return cy.get('[role="dialog"]').find('[role="switch"][aria-label="Full refund"]');
  }

  // Selector
  // Dynamic label: "Refund 0.00 €" etc. — matched by startsWith('refund')
  get refundConfirmButton() {
    return cy.get('[role="dialog"]').find('button').filter((i, el) =>
      el.textContent.trim().toLowerCase().startsWith('refund')
    ).last();
  }

  // Action
  confirmRefundModal() {
    this.fullRefundOption.should('be.visible').click();
    cy.wait(1000);
    cy.log('✓ Clicked: Full refund option');
    this.refundConfirmButton.should('be.visible').click();
    cy.wait(2000);
    cy.log('✓ Clicked: Refund submit button');
  }

  // Selector
  get successToast() {
    return cy.contains('Successfully requested!');
  }

  // Action
  verifySuccessToast() {
    this.successToast.should('be.visible');
    cy.log('✓ Verified: "Successfully requested!" toast displayed');
  }

  // Selector
  get fullyRefundedBadge() {
    return cy.contains('fully refunded');
  }

  // Action
  verifyFullyRefundedBadge() {
    this.fullyRefundedBadge.should('be.visible');
    cy.log('✓ Verified: "fully refunded" badge displayed');
  }

  // ==================== INVOICE DETAIL — CANCEL ====================

  // Selector
  get cancelButton() {
    return cy.contains('button', 'Cancel invoice');
  }

  // Action
  clickCancelButton() {
    this.cancelButton.should('be.visible').and('not.be.disabled').click();
    cy.url().should('include', '/cancel');
    cy.wait(2000);
    cy.log('✓ Clicked: Cancel invoice → navigated to /cancel page');
  }

  // Action
  confirmCancelFlow() {
    // Step 1: Click "Cancel invoice" on the /cancel page
    cy.contains('span', 'Cancel invoice').should('be.visible').click();
    cy.wait(2000);
    cy.log('✓ Clicked: Cancel invoice (on /cancel page)');

    // Step 2: Select "Yes, I also want to generate a new invoice..." option
    cy.contains('Yes, I also want to generate a new invoice with updated information.').should('be.visible').click();
    cy.log('✓ Selected: Generate new invoice option');

    // Step 3: Click "Cancel" submit button — scoped to dialog to avoid matching
    // the background "Cancel invoice" action button which is covered by the overlay
    cy.get('[role="dialog"]').contains('button', 'Cancel').should('be.visible').click();
    cy.log('✓ Clicked: Cancel submit button (inside dialog)');

    // Step 4: Verify success toast
    this.verifySuccessToast();

    // Step 5: Click "Close"
    cy.contains('button', 'Close').should('be.visible').click();
    cy.log('✓ Clicked: Close button');
  }

  // Selector
  get cancelledBadge() {
    return cy.contains('cancelled');
  }

  // Action
  verifyCancelledBadge() {
    this.cancelledBadge.should('be.visible');
    cy.log('✓ Verified: "cancelled" badge displayed');
  }

  // ==================== INVOICE DETAIL — PDF DOWNLOAD ====================

  // Action
  interceptPdfDownload() {
    cy.intercept('GET', '**/invoices/**').as('pdfDownload');
    cy.log('✓ PDF download intercept registered');
  }

  // Selector
  // Button text is " PDF " (icon + label), not "Download PDF"
  get downloadPdfButton() {
    return cy.contains('button', 'PDF');
  }

  // Action
  clickDownloadPdfButton() {
    this.downloadPdfButton.should('be.visible').click();
    cy.log('✓ Clicked: Download PDF button');
  }

  // Action
  verifyPdfDownloaded() {
    cy.wait('@pdfDownload').its('response.statusCode').should('equal', 200);
    cy.log('✓ Verified: PDF download returned status 200');
  }

  // ==================== HELPER ====================

  waitForElement(element, maxWait = 5000) {
    return element.should('be.visible', { timeout: maxWait });
  }
}

export default new InvoiceListPage();
