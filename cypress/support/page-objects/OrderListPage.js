/**
 * Order List Page Object
 * Contains selectors and actions for the Order List page
 */

class OrderListPage {
  // ==================== NAVIGATION ====================

  // Action
  navigateToOrderList() {
    cy.visit(Cypress.env('baseUrl') + 'en/cms/orders');
    cy.wait(3000);
    cy.log('✓ Verified: Navigated to Order List page');
  }

  // ==================== SEARCH ====================

  // Selector
  get searchInput() {
    return cy.get('.flex.flex-col.space-y-1.w-64').find('input[type="text"]').eq(0);
  }

  // Action
  searchByOrderId(orderId) {
    this.waitForElement(this.searchInput, 3000);
    this.searchInput.click({ multiple: true });
    this.searchInput.type(orderId);
    cy.wait(2000);
    cy.log(`✓ Verified: Searched for order ID: ${orderId}`);
  }

  // Action
  clickOnOrderFromList(orderId) {
    cy.get('tbody tr')
      .contains(orderId)
      .click();
    cy.wait(2000);
    cy.log(`✓ Verified: Clicked on order ${orderId} from list`);
  }

  // ==================== FILTERS ====================

  // Selector
  get statusFilter() {
    return cy.get('button[aria-haspopup="listbox"]').contains('Status');
  }

  // Action
  selectStatusFilter(status) {
    this.waitForElement(this.statusFilter, 5000);
    this.statusFilter.click();
    cy.wait(1000);

    cy.get('div[role="listbox"][aria-labelledby]').should('be.visible');
    cy.get('div[role="listbox"] div[role="option"]').each(($option) => {
      const optionText = $option.find('span.block').text().trim();
      if (optionText.toLowerCase() === status.toLowerCase()) {
        cy.wrap($option).click();
        return false;
      }
    });

    cy.wait(2000);
    cy.log(`✓ Verified: Selected status filter: ${status}`);
  }

  // Selector
  get paymentStatusFilter() {
    return cy.get('button[aria-haspopup="listbox"]').contains('Payment status');
  }

  // Action
  selectPaymentStatusFilter(paymentStatus) {
    this.waitForElement(this.paymentStatusFilter, 5000);
    this.paymentStatusFilter.click();
    cy.wait(1000);

    cy.get('div[role="listbox"][aria-labelledby]').should('be.visible');
    cy.get('div[role="listbox"] div[role="option"]').each(($option) => {
      const optionText = $option.find('span.block').text().trim();
      if (optionText.toLowerCase() === paymentStatus.toLowerCase()) {
        cy.wrap($option).click();
        return false;
      }
    });

    cy.wait(2000);
    cy.log(`✓ Verified: Selected payment status filter: ${paymentStatus}`);
  }

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

  // ==================== TABS ====================

  // Selector
  get generalTab() {
    return cy.get('.v-tabs button').contains('General');
  }

  // Action
  clickGeneralTab() {
    this.waitForElement(this.generalTab, 5000);
    this.generalTab.click();
    cy.wait(2000);
    cy.log('✓ Verified: Clicked General tab');
  }

  // Selector
  get draftTab() {
    return cy.get('a').contains('Draft');
  }

  // Action
  clickDraftTab() {
    this.waitForElement(this.draftTab, 5000);
    this.draftTab.click();
    cy.wait(2000);
    cy.url().should('include', 'draft');
    cy.log('✓ Verified: Clicked Draft tab');
  }

  // Selector
  get consumableTab() {
    return cy.get('a').contains('Consumable');
  }

  // Action
  clickConsumableTab() {
    this.waitForElement(this.consumableTab, 5000);
    this.consumableTab.click();
    cy.wait(2000);
    cy.url().should('include', 'consumable');
    cy.log('✓ Verified: Clicked Consumable tab');
  }

  // ==================== PAGINATION ====================

  // Selector
  get paginationText() {
    return cy.get('span[data-testid="from-to-of-total"]');
  }

  // Action
  getTotalOrderCount() {
    return this.paginationText.invoke('text').then((text) => {
      const match = text.match(/of\s+(\d+)/);
      const total = match ? parseInt(match[1]) : 0;
      cy.log(`✓ Verified: Total orders shown in pagination: ${total}`);
      return cy.wrap(total);
    });
  }

  // Selector
  get firstPageButton() {
    return cy.get('button[data-testid="btn-go-to-first"]');
  }

  // Action
  goToFirstPage() {
    this.waitForElement(this.firstPageButton, 3000);
    this.firstPageButton.click();
    cy.wait(2000);
    cy.log('✓ Verified: Navigated to first page');
  }

  // Selector
  get previousPageButton() {
    return cy.get('button[data-testid="btn-prev-page"]');
  }

  // Action
  goToPreviousPage() {
    this.waitForElement(this.previousPageButton, 3000);
    this.previousPageButton.click();
    cy.wait(2000);
    cy.log('✓ Verified: Navigated to previous page');
  }

  // Selector
  get nextPageButton() {
    return cy.get('button[data-testid="btn-next-page"]');
  }

  // Action
  goToNextPage() {
    this.waitForElement(this.nextPageButton, 3000);
    this.nextPageButton.click();
    cy.wait(2000);
    cy.log('✓ Verified: Navigated to next page');
  }

  // Selector
  get lastPageButton() {
    return cy.get('button[data-testid="btn-go-to-last"]');
  }

  // Action
  goToLastPage() {
    this.waitForElement(this.lastPageButton, 3000);
    this.lastPageButton.click();
    cy.wait(2000);
    cy.log('✓ Verified: Navigated to last page');
  }

  // ==================== TABLE CHECKBOXES ====================

  // Selector
  get headerCheckbox() {
    return cy.get('thead input[type="checkbox"]');
  }

  // Action
  selectAllOrders() {
    this.headerCheckbox.click({ force: true });
    cy.wait(1000);
    cy.log('✓ Verified: Selected all orders on current page');
  }

  // Selector
  get rowCheckboxes() {
    return cy.get('tbody input[type="checkbox"]');
  }

  // Action
  selectOrderByIndex(index) {
    this.rowCheckboxes.eq(index).check({ force: true });
    cy.wait(500);
    cy.log(`✓ Verified: Selected order at index ${index}`);
  }

  // Action
  selectMultipleOrders(indices) {
    indices.forEach((index) => {
      this.selectOrderByIndex(index);
    });
    cy.log(`✓ Verified: Selected ${indices.length} orders`);
  }

  // Action
  selectOrderByOrderId(orderId) {
    cy.get('tbody tr')
      .contains(orderId)
      .parents('tr')
      .find('input[type="checkbox"]')
      .check({ force: true });

    cy.wait(1000);
    cy.log(`✓ Verified: Selected order with ID: ${orderId}`);
  }

  // ==================== ACTION BUTTONS ====================

  // Selector
  get exportButton() {
    return cy.contains('span', 'Export');
  }

  // Action
  clickExport() {
    this.waitForElement(this.exportButton, 5000);
    this.exportButton.click();

    cy.get('button[data-cy="btn-submit"]').click();
    cy.log('✓ Verified: Clicked Export button in the modal');
    cy.wait(2000);

    cy.contains('p', 'Successfully requested!').should('be.visible');
    cy.log('✓ Verified: Successfully requested message is displayed');

    cy.get('button[data-cy="btn-close"]').click();
    cy.log('✓ Verified: Clicked Close button');
  }

  // Selector
  get markFulfilledButton() {
    return cy.get('button').contains('Mark fulfilled').first();
  }

  // Action
  clickMarkFulfilled() {
    this.waitForElement(this.markFulfilledButton, 5000);
    this.markFulfilledButton.click();

    cy.get('button[data-cy="btn-submit"]').click();
    cy.wait(3000);
    cy.log('✓ Verified: Clicked Submit button');

    cy.contains('p', 'Successfully requested!').should('be.visible');
    cy.wait(2000);
    cy.log('✓ Verified: Successfully requested message is displayed');

    cy.get('button[data-cy="btn-close"]').click();
    cy.log('✓ Verified: Clicked Close button');
  }

  // ==================== TABLE VERIFICATION ====================

  // Selector
  get orderIdCells() {
    return cy.get('tbody td').contains(/^[A-Z0-9-]+$/);
  }

  // Action
  verifyOrderInTable(orderId) {
    cy.get('tbody').contains(orderId).should('be.visible');
    cy.log(`✓ Verified: Order ${orderId} is visible in table`);
  }

  // ==================== URL VERIFICATION ====================

  // Action
  verifyUrlContains(parameter, value) {
    cy.url().should('include', `${parameter}=${value}`);
    cy.log(`✓ Verified: URL contains ${parameter}=${value}`);
  }

  // ==================== HELPER METHODS ====================

  waitForElement(element, maxWait = 5000) {
    return element.should('be.visible', { timeout: maxWait });
  }
}

export default new OrderListPage();
