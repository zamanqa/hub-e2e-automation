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

  // ==================== FILTERS ====================
  // Selector - Status Filter Button
  get statusFilter() {
    return cy.get('button[aria-haspopup="listbox"]').contains('Status');
  }

  // Selector - Payment Status Filter Button
  get paymentStatusFilter() {
    return cy.get('button[aria-haspopup="listbox"]').contains('Payment status');
  }

  // Selector - Clear Filters Button
  get clearFiltersButton() {
    return cy.get('button').contains('Clear');
  }

  // Action - Open Status Filter and Select Option
  selectStatusFilter(status) {
    // Click on Status filter button
    this.waitForElement(this.statusFilter, 5000);
    this.statusFilter.click();
    cy.wait(1000);

    // Wait for dropdown to be visible and find the matching option
    cy.get('div[role="listbox"][aria-labelledby]').should('be.visible');
    cy.get('div[role="listbox"] div[role="option"]').each(($option) => {
      const optionText = $option.find('span.block').text().trim();
      if (optionText.toLowerCase() === status.toLowerCase()) {
        cy.wrap($option).click();
        return false; // break the loop
      }
    });

    cy.wait(2000);
    cy.log(`✓ Verified: Selected status filter: ${status}`);
  }

  // Action - Open Payment Status Filter and Select Option
  selectPaymentStatusFilter(paymentStatus) {
    // Click on Payment Status filter button
    this.waitForElement(this.paymentStatusFilter, 5000);
    this.paymentStatusFilter.click();
    cy.wait(1000);

    // Wait for dropdown to be visible and find the matching option
    cy.get('div[role="listbox"][aria-labelledby]').should('be.visible');
    cy.get('div[role="listbox"] div[role="option"]').each(($option) => {
      const optionText = $option.find('span.block').text().trim();
      if (optionText.toLowerCase() === paymentStatus.toLowerCase()) {
        cy.wrap($option).click();
        return false; // break the loop
      }
    });

    cy.wait(2000);
    cy.log(`✓ Verified: Selected payment status filter: ${paymentStatus}`);
  }

  // Action - Clear All Filters
  clearAllFilters() {
    this.waitForElement(this.clearFiltersButton, 5000);
    this.clearFiltersButton.click();
    cy.wait(2000);
    cy.log('✓ Verified: Cleared all filters');
  }

  // ==================== TABS ====================
  // Selector - General Tab
  get generalTab() {
    return cy.get('.v-tabs button').contains('General');
  }

  // Selector - Draft Tab
  get draftTab() {
    return cy.get('a').contains('Draft');
  }

  // Selector - Consumable Tab
  get consumableTab() {
    return cy.get('a').contains('Consumable');
  }

  // Action - Click General Tab
  clickGeneralTab() {
    this.waitForElement(this.generalTab, 5000);
    this.generalTab.click();
    cy.wait(2000);
    cy.log('✓ Verified: Clicked General tab');
  }

  // Action - Click Draft Tab
  clickDraftTab() {
    this.waitForElement(this.draftTab, 5000);
    this.draftTab.click();
    cy.wait(2000);
    cy.url().should('include', 'draft');
    cy.log('✓ Verified: Clicked Draft tab');
  }

  // Action - Click Consumable Tab
  clickConsumableTab() {
    this.waitForElement(this.consumableTab, 5000);
    this.consumableTab.click();
    cy.wait(2000);
    cy.url().should('include', 'consumable');
    cy.log('✓ Verified: Clicked Consumable tab');
  }

  // ==================== PAGINATION ====================
  // Selector - Pagination Text
  get paginationText() {
  return cy.get('span[data-testid="from-to-of-total"]');
}

  // Selector - First Page Button
  get firstPageButton() {
    return cy.get('button[data-testid="btn-go-to-first"]');
  }

  get previousPageButton() {
  return cy.get('button[data-testid="btn-prev-page"]');
}

  // Selector - Next Page Button
  get nextPageButton() {
    return cy.get('button[data-testid="btn-next-page"]');
  }

  // Selector - Last Page Button
  get lastPageButton() {
    return cy.get('button[data-testid="btn-go-to-last"]');
  }

  // Action - Get Total Count from Pagination
  getTotalOrderCount() {
  return this.paginationText.invoke('text').then((text) => {
    // Extract total from format "1-10 of 55"
    const match = text.match(/of\s+(\d+)/);
    const total = match ? parseInt(match[1]) : 0;
    cy.log(`✓ Verified: Total orders shown in pagination: ${total}`);

    // Return the total in a chainable Cypress command
    return cy.wrap(total);  // This ensures you return a Cypress command instead of a raw value
  });
}

  // Action - Navigate to Next Page
  goToNextPage() {
    this.waitForElement(this.nextPageButton, 3000);
    this.nextPageButton.click();
    cy.wait(2000);
    cy.log('✓ Verified: Navigated to next page');
  }

  // Action - Navigate to Previous Page
  goToPreviousPage() {
    this.waitForElement(this.previousPageButton, 3000);
    this.previousPageButton.click();
    cy.wait(2000);
    cy.log('✓ Verified: Navigated to previous page');
  }

  // Action - Navigate to First Page
  goToFirstPage() {
    this.waitForElement(this.firstPageButton, 3000);
    this.firstPageButton.click();
    cy.wait(2000);
    cy.log('✓ Verified: Navigated to first page');
  }

  // Action - Navigate to Last Page
  goToLastPage() {
    this.waitForElement(this.lastPageButton, 3000);
    this.lastPageButton.click();
    cy.wait(2000);
    cy.log('✓ Verified: Navigated to last page');
  }

  // ==================== TABLE CHECKBOXES ====================
  // Selector - Header Checkbox (Select All)
  get headerCheckbox() {
    return cy.get('thead input[type="checkbox"]');
  }

  // Selector - Row Checkboxes
  get rowCheckboxes() {
    return cy.get('tbody input[type="checkbox"]');
  }

  // Action - Select All Orders
  selectAllOrders() {
    this.headerCheckbox.click({ force: true });
    cy.wait(1000);
    cy.log('✓ Verified: Selected all orders on current page');
  }

  // Action - Select Specific Order by Row Index (0-based)
  selectOrderByIndex(index) {
    this.rowCheckboxes.eq(index).click({ force: true });
    cy.wait(500);
    cy.log(`✓ Verified: Selected order at index ${index}`);
  }

  // Action - Select Multiple Orders by Indices
  selectMultipleOrders(indices) {
    indices.forEach((index) => {
      this.selectOrderByIndex(index);
    });
    cy.log(`✓ Verified: Selected ${indices.length} orders`);
  }

  // ==================== ACTION BUTTONS ====================
  // Selector - Export Button
  get exportButton() {
  return cy.contains('span', 'Export');
}

  // Selector - Mark Fulfilled Button
  get markFulfilledButton() {
    return cy.get('button').contains('Mark fulfilled').first();
  }

  // Action - Click Export Button
  clickExport() {
  // Wait for the first "Export" button and click it
  this.waitForElement(this.exportButton, 5000); // Ensure the first "Export" button is visible
  this.exportButton.click();
  
  // Wait for the second "Export" button inside the modal and click it
  cy.get('button[data-cy="btn-submit"]').click();
  cy.log('✓ Verified: Clicked Export button in the modal');
  cy.wait(2000)

  // Verify that the success message appears
  cy.contains('p', 'Successfully requested!').should('be.visible');
  cy.log('✓ Verified: Successfully requested message is displayed');

    // Click the "Close" button in the modal
  cy.get('button[data-cy="btn-close"]').click();
  cy.log('✓ Verified: Clicked Close button');
}

  // Action - Click Mark Fulfilled Button
clickMarkFulfilled() {
  // Wait for the "Mark Fulfilled" button and click it
  this.waitForElement(this.markFulfilledButton, 5000);
  this.markFulfilledButton.click();
  
  // Wait for the "Submit" button inside the modal and click it
  cy.get('button[data-cy="btn-submit"]').click();
  cy.wait(3000)
  cy.log('✓ Verified: Clicked Submit button');

  // Verify that the success message appears
  cy.contains('p', 'Successfully requested!').should('be.visible');
  cy.wait(2000)
  cy.log('✓ Verified: Successfully requested message is displayed');
  
  // Click the "Close" button in the modal
  cy.get('button[data-cy="btn-close"]').click();
  cy.log('✓ Verified: Clicked Close button');
}


  // ==================== TABLE VERIFICATION ====================
  // Selector - Order ID Cells
  get orderIdCells() {
    return cy.get('tbody td').contains(/^[A-Z0-9-]+$/);
  }

  // Action - Verify Order Exists in Table
  verifyOrderInTable(orderId) {
    cy.get('tbody').contains(orderId).should('be.visible');
    cy.log(`✓ Verified: Order ${orderId} is visible in table`);
  }

  selectOrderByOrderId(orderId) {
  // Find the row containing the order ID and click its checkbox using a more specific selector
  cy.get('tbody tr')
    .contains(orderId)  // Find the cell containing the orderId
    .parents('tr')  // Move up to the parent row
    .find('input[type="checkbox"]')  // Find the checkbox input within the row
    .check({ force: true });  // Use .check() to ensure the checkbox is checked
  
  cy.wait(1000);
  cy.log(`✓ Verified: Selected order with ID: ${orderId}`);
}

  // ==================== URL VERIFICATION ====================
  // Action - Verify URL Contains Parameter
  verifyUrlContains(parameter, value) {
    cy.url().should('include', `${parameter}=${value}`);
    cy.log(`✓ Verified: URL contains ${parameter}=${value}`);
  }

  // ==================== HELPER METHODS ====================
  /**
   * Smart wait helper - waits up to maxWait milliseconds for element to be visible
   * If element appears before maxWait, proceeds immediately
   * @param {Cypress.Chainable} element - The Cypress element to wait for
   * @param {number} maxWait - Maximum time to wait in milliseconds (default: 5000)
   */
  waitForElement(element, maxWait = 5000) {
    return element.should('be.visible', { timeout: maxWait });
  }
}

export default new OrderListPage();
