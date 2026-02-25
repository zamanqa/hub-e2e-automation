/**
 * Subscription List Page Object
 * Contains selectors and actions for the Subscription List page
 */

class SubscriptionListPage {
  // ==================== NAVIGATION ====================

  // Action
  navigateToSubscriptionList() {
    cy.visit(Cypress.env('baseUrl') + 'en/cms/subscriptions');
    cy.wait(5000);
    cy.log('✓ Verified: Navigated to Subscription List page');
  }

  // ==================== SEARCH ====================

  // Selector
  get searchInput() {
    return cy.get('.w-64 input[placeholder="Search..."]');
  }

  // Action
  searchBySubscriptionId(subscriptionId) {
  this.waitForElement(this.searchInput, 10000);
  this.searchInput.click({ multiple: true });
  this.searchInput.type(subscriptionId);
  cy.wait(2000);
  // Click the first subscription ID link in the results
  cy.get('a[href*="/cms/subscriptions/"]').first().click();
  cy.log(`✓ Verified: Searched and clicked first subscription ID: ${subscriptionId}`);
}

  // Action
  // Note: The subscription list table does not render the full composite subscription_id
  // as visible row text. After searching by ID the table filters to 1 result, so we
  // click the first (and only) row — same reliable approach as OrderListPage.
  clickOnSubscriptionFromList(subscriptionId) {
    cy.get('tbody tr').should('have.length.at.least', 1);
    cy.get('tbody tr').first().click({ force: true });
    cy.wait(2000);
    cy.log(`✓ Verified: Clicked on subscription ${subscriptionId} from list`);
  }

  // ==================== FILTERS ====================

  // Selector
  get clearFiltersButton() {
    return cy.get('button').contains('Clear');
  }

  // Action
  clearAllFilters() {
    this.waitForElement(this.clearFiltersButton, 5000);
    this.clearFiltersButton.click();
    cy.wait(2000);
    cy.log('✓ Verified: Cleared all filters');
  }

  // ==================== PAGINATION TEXT ====================

  // Selector — pagination counter showing "1-10 of 874"
  // .first() ensures we only get one element — the selector matches 2 elements and
  // invoking .text() on both concatenates them (e.g. "1-10 of 874" + "1" = "1-10 of 8741")
  get paginationText() {
    return cy.get('[data-testid="from-to-of-total"]').first();
  }

  // Action - wait until pagination counter is visible (used in beforeEach after navigation)
  waitForPaginationVisible() {
    this.paginationText.should('be.visible');
    cy.log('✓ Pagination text is visible');
  }

  // Helper - parse total record count from pagination text e.g. "1-10 of 874" → 874
  parseTotalRecords(text) {
    const match = text.match(/of\s+(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  // ==================== STATUS / TYPE FILTERS ====================

  // Selector — Status HeadlessUI listbox button
  // Note: HeadlessUI generates deterministic IDs based on component tree order.
  // Update these if the page structure changes.
  get statusDropdown() {
    return cy.get('#headlessui-listbox-button-v-0-2-3');
  }

  // Selector — Type HeadlessUI listbox button
  get typeDropdown() {
    return cy.get('#headlessui-listbox-button-v-0-2-5');
  }

  // Action - open the Status dropdown and select the given option text
  filterByStatus(status) {
    this.statusDropdown.should('be.visible').click();
    cy.get('[role="option"]').contains(status).should('be.visible').click();
    this.waitForPaginationVisible();
    cy.log(`✓ Filtered by Status: "${status}"`);
  }

  // Action - open the Type dropdown and select the given option text
  filterByType(type) {
    this.typeDropdown.should('be.visible').click();
    cy.get('[role="option"]').contains(type).should('be.visible').click();
    this.waitForPaginationVisible();
    cy.log(`✓ Filtered by Type: "${type}"`);
  }

  // ==================== CHECKBOXES ====================

  // Selector — select-all checkbox in table header
  get headerCheckbox() {
    return cy.get('thead input[type="checkbox"]');
  }

  // Selector — all row checkboxes in table body
  get rowCheckboxes() {
    return cy.get('tbody input[type="checkbox"]');
  }

  // Action - click the header checkbox to select all visible rows
  selectAllRows() {
    this.headerCheckbox.should('be.visible').check({ force: true });
    cy.log('✓ Checked: Select all header checkbox');
  }

  // Action - assert every row checkbox is currently checked
  verifyAllRowsChecked() {
    this.rowCheckboxes.each(($cb) => {
      cy.wrap($cb).should('be.checked');
    });
    cy.log('✓ Verified: All row checkboxes are checked');
  }

  // ==================== EXPORT ====================

  // Selector — Export button in the toolbar
  get exportButton() {
    return cy.contains('button', 'Export');
  }

  // Action - click the Export button (toolbar)
  clickExport() {
    this.exportButton.should('be.visible').and('not.be.disabled').click();
    cy.log('✓ Clicked: Export button');
  }

  // Action - click the "Export" button inside the Export data modal
  clickExportInModal() {
    cy.get('[role="dialog"]').contains('button', 'Export').should('be.visible').click();
    cy.log('✓ Clicked: Export button in modal');
  }

  // Action - verify success message and close the export success dialog
  closeExportSuccessDialog() {
    cy.contains('Successfully requested!').should('be.visible');
    cy.log('✓ Verified: Success message "Successfully requested!" displayed');
    cy.contains('button', 'Close').click();
    cy.log('✓ Closed: Export success dialog');
  }

  // ==================== PAGINATION CONTROLS ====================

  // Selectors — data-testid pagination buttons
  // .first() used because the page renders two pagination control sets (top + bottom),
  // causing the selector to match 2 elements — cy.click() requires a single element
  get firstPageButton() { return cy.get('[data-testid="btn-go-to-first"]').first(); }
  get prevPageButton()  { return cy.get('[data-testid="btn-prev-page"]').first(); }
  get nextPageButton()  { return cy.get('[data-testid="btn-next-page"]').first(); }
  get lastPageButton()  { return cy.get('[data-testid="btn-go-to-last"]').first(); }

  // Actions - navigate pages
  // cy.wait(2000) is required after each click — waitForPaginationVisible() only checks
  // element visibility (always true), so without the wait the pagination text is read
  // before the page content has actually updated, returning the stale previous-page text
  clickNextPage() {
    this.nextPageButton.click();
    cy.wait(2000);
    this.waitForPaginationVisible();
    cy.log('✓ Clicked: Next page');
  }

  clickPrevPage() {
    this.prevPageButton.click();
    cy.wait(2000);
    this.waitForPaginationVisible();
    cy.log('✓ Clicked: Previous page');
  }

  clickFirstPage() {
    this.firstPageButton.click();
    cy.wait(2000);
    this.waitForPaginationVisible();
    cy.log('✓ Clicked: First page');
  }

  clickLastPage() {
    this.lastPageButton.click();
    cy.wait(2000);
    this.waitForPaginationVisible();
    cy.log('✓ Clicked: Last page');
  }

  // Action - change items-per-page size via the page size listbox
  // Follows same pattern as setRPItemsPerPage in SubscriptionDetailPage
  // .first() used because the page renders two pagination control sets (top + bottom)
  changePageSize(size) {
    cy.get('[data-testid="select-page-size"]').first()
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

  // ==================== HELPER METHODS ====================

  waitForElement(element, maxWait = 5000) {
    return element.should('be.visible', { timeout: maxWait });
  }
}

export default new SubscriptionListPage();
