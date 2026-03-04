/**
 * Return & Repair Page Objects
 * Contains selectors and actions for both:
 *   - ReturnsPage  → /en/cms/returns
 *   - RepairsPage  → /en/cms/repairs
 */

// ═══════════════════════════════════════════════════════════════════════════
// RETURNS PAGE
// ═══════════════════════════════════════════════════════════════════════════

class ReturnsPageClass {

  // Selector
  get sidebarLink() {
    return cy.get('nav a[href="/returns"]');
  }
  // Action
  navigate() {
    cy.visit(Cypress.env('baseUrl') + 'en/cms/returns');
    cy.log('✓ Navigated to Returns page');
  }

  // Selector
  get pageHeading() {
    return cy.contains('h1, [class*="heading"]', 'Return list');
  }
  // Action
  verifyPageHeading() {
    this.pageHeading.should('be.visible');
    cy.log('✓ Verified: Return list heading visible');
  }

  // Selector
  get tableRows() {
    return cy.get('table tbody tr, table [role="row"]');
  }
  // Action
  verifyTableHasRows() {
    this.tableRows.should('have.length.greaterThan', 0);
    cy.log('✓ Verified: Returns table has rows');
  }

  // Selector
  // Serial number text is truncated in the DOM — match on the asset href instead
  getAssetLinkBySerialNumber(serialNumber) {
    return cy.get(`a[href*="/en/cms/assets/${serialNumber}"]`);
  }
  // Action
  clickHandleForSerialNumber(serialNumber) {
    this.getAssetLinkBySerialNumber(serialNumber)
      .closest('tr, [role="row"]')
      .find('button')
      .contains('Handle')
      .click();
    cy.log(`✓ Clicked: Handle for serial number ${serialNumber}`);
  }

  // Selector
  get searchInput() {
    return cy.get('.w-64 input[placeholder="Search..."]');
  }
  // Action
  searchFor(serialNumber) {
    this.waitForElement(this.searchInput, 10000);
    this.searchInput.click({ multiple: true });
    this.searchInput.type(serialNumber);
    cy.wait(2000);
    cy.log(`✓ Searched for serial number: ${serialNumber}`);
  }

  // Selector
  get modal() {
    return cy.get('[role="dialog"]');
  }
  // Action
  verifyModalVisible() {
    this.modal.should('be.visible');
    cy.log('✓ Verified: Modal is visible');
  }

  // Selector
  get deleteRPCheckbox() {
    return this.modal.find('input[type="checkbox"]');
  }
  // Action
  uncheckDeleteRP() {
    this.deleteRPCheckbox.uncheck({ force: true }).should('not.be.checked');
    cy.log('✓ Unchecked: Delete future recurring payments');
  }

  // Selector
  get markAsReturnedButton() {
    return this.modal.contains('button', 'Mark as returned');
  }
  // Action
  clickMarkAsReturned() {
    this.markAsReturnedButton.should('be.visible').click();
    cy.log('✓ Clicked: Mark as returned');
  }

  // Selector
  get markAsBoughtButton() {
    return this.modal.contains('button', 'Mark as bought');
  }
  // Action
  clickMarkAsBought() {
    this.markAsBoughtButton.should('be.visible').click();
    cy.log('✓ Clicked: Mark as bought');
  }

  // Selector
  get successMessage() {
    return cy.contains('Successfully requested!');
  }
  // Action
  verifySuccessMessage() {
    this.successMessage.should('be.visible');
    cy.log('✓ Verified: "Successfully requested!" message displayed');
  }

  // Selector
  get closeButton() {
    return cy.contains('button', 'Close');
  }
  // Action
  clickClose() {
    this.closeButton.should('be.visible').click();
    cy.log('✓ Clicked: Close');
  }

  // Selector
  get dialog() {
    return cy.get('[role="dialog"]');
  }
  // Action
  verifyModalClosed() {
    this.dialog.should('not.exist');
    cy.log('✓ Verified: Modal is closed');
  }

  // ==================== HELPER ====================

  waitForElement(element, maxWait = 5000) {
    return element.should('be.visible', { timeout: maxWait });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// REPAIRS PAGE
// ═══════════════════════════════════════════════════════════════════════════

class RepairsPageClass {

  // Selector
  get sidebarLink() {
    return cy.get('nav a[href="/en/cms/repairs"]');
  }
  // Action
  navigate() {
    cy.visit(Cypress.env('baseUrl') + 'en/cms/repairs');
    cy.log('✓ Navigated to Repairs page');
  }

  // Selector
  get pageHeading() {
    return cy.contains('h1, [class*="heading"]', 'Repair list');
  }
  // Action
  verifyPageHeading() {
    this.pageHeading.should('be.visible');
    cy.log('✓ Verified: Repair list heading visible');
  }

  // Selector
  get tableRows() {
    return cy.get('table tbody tr, table [role="row"]');
  }
  // Action
  verifyTableHasRows() {
    this.tableRows.should('have.length.greaterThan', 0);
    cy.log('✓ Verified: Repairs table has rows');
  }

  // Selector
  get searchInput() {
    return cy.get('.w-64 input[placeholder="Search..."]');
  }
  // Action
  searchFor(serialNumber) {
    this.waitForElement(this.searchInput, 10000);
    this.searchInput.click({ multiple: true });
    this.searchInput.type(serialNumber);
    cy.wait(2000);
    cy.log(`✓ Searched for serial number: ${serialNumber}`);
  }

  // Selector
  // The repairs table links to /en/cms/repairs/{id} — not /en/cms/subscriptions/
  get firstSubscriptionLink() {
    return this.tableRows.first().find('a[href*="/en/cms/repairs/"]').first();
  }
  // Action
  clickFirstSubscriptionLink() {
    this.firstSubscriptionLink.should('be.visible').click();
    cy.log('✓ Clicked: First subscription ID link in search results');
  }

  // Selector
  get startRepairButton() {
    return cy.contains('button', 'Start repair');
  }
  // Action
  clickStartRepair() {
    this.startRepairButton.should('be.visible').click();
    cy.log('✓ Clicked: Start repair');
  }

  // Selector
  get submitButton() {
    return cy.contains('button', 'Submit');
  }
  // Action
  clickSubmit() {
    this.submitButton.should('be.visible').click();
    cy.log('✓ Clicked: Submit');
  }

  // Selector
  get successMessage() {
    return cy.contains('Successfully requested!');
  }
  // Action
  verifySuccessMessage() {
    this.successMessage.should('be.visible');
    cy.log('✓ Verified: "Successfully requested!" message displayed');
  }

  // Selector
  get closeButton() {
    return cy.contains('button', 'Close');
  }
  // Action
  clickClose() {
    this.closeButton.should('be.visible').click();
    cy.log('✓ Clicked: Close');
  }

  // Selector
  get filterBadge() {
    return cy.contains('button', /Filter/i)
      .find('[class*="badge"], sup, [class*="count"]');
  }
  // Action
  verifyFilterBadgeCount(count) {
    this.filterBadge.should('contain.text', count);
    cy.log(`✓ Verified: Filter badge shows ${count} active filters`);
  }

  // Selector
  get createNoteButton() {
    return cy.contains('button', 'Create note');
  }
  // Action
  clickCreateNote() {
    this.createNoteButton.should('be.visible').click();
    cy.log('✓ Clicked: Create note');
  }

  // ==================== HELPER ====================

  waitForElement(element, maxWait = 5000) {
    return element.should('be.visible', { timeout: maxWait });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export const ReturnsPage = new ReturnsPageClass();
export const RepairsPage = new RepairsPageClass();
