/**
 * Order Detail Page Object
 * Contains selectors and actions for the Order Detail page
 */

class OrderDetailPage {
  // ==================== NAVIGATION ====================

  // Action
  verifyUrlContainsOrderId(orderId) {
    cy.url().should('include', `/orders/${orderId}`);
    cy.log(`✓ Verified: URL contains /orders/${orderId}`);
  }

  // ==================== NOTES SECTION ====================

  // Selector
  get createNoteButton() {
    return cy.contains('button', 'Create note');
  }

  // Action
  clickCreateNote() {
    this.waitForElement(this.createNoteButton, 5000);
    this.createNoteButton.click();
    cy.wait(2000);
    cy.log('✓ Verified: Clicked Create Note button');
  }


// Selector for the note message input field using dynamic ID
get noteMessageInput() {
  return cy.get('textarea[id^="input-v-"]');
}

// Action to enter a note message
enterNoteMessage(message) {
  // Force the click and type action even if the element is not visible
  this.noteMessageInput.click({ force: true });  // Force the click action
  this.noteMessageInput.clear({ force: true });  // Force clearing the input
  this.noteMessageInput.type(message, { force: true });  // Force typing into the textarea

  // Log the successful action
  cy.log(`✓ Verified: Entered note message: ${message}`);
}


  // Selector
  get createNoteSubmitButton() {
    return cy.get('[data-cy="btn-submit"] > .flex');
  }

  // Action
  submitNote() {
    this.waitForElement(this.createNoteSubmitButton, 5000);
    this.createNoteSubmitButton.click();
    cy.wait(2000);
    cy.log('✓ Verified: Clicked Create button to submit note');
  }

  // Selector
  get notesSection() {
    return cy.get('[data-test-id="note-message"]');
  }

  // Action
  verifyNoteExists(message) {
    cy.get('[data-test-id="note-message"]').should('contain', message);
    cy.log(`✓ Verified: Note with message "${message}" is visible`);
  }

  // ==================== PRODUCT LIST ====================

  // Selector
  getAllProductRows() {
    return cy.get('tbody tr.v-data-table__tr');
  }

  // ==================== CREATE SUBSCRIPTION ====================

  // Selector
  getCreateSubscriptionButtonForRow(rowIndex) {
    return cy.get('tbody tr.v-data-table__tr').eq(rowIndex).find('button').contains('Create subscription');
  }

  // Action
  clickCreateSubscriptionForRow(rowIndex) {
    this.getCreateSubscriptionButtonForRow(rowIndex).click();
    cy.wait(2000);
    cy.log(`✓ Verified: Clicked Create Subscription for row ${rowIndex + 1}`);
  }

  // Selector
  get generateSerialNumberButton() {
    return cy.contains('button', 'Generate');
  }

  // Action
  clickGenerate() {
    this.waitForElement(this.generateSerialNumberButton, 5000);
    this.generateSerialNumberButton.click();
    cy.wait(1000);
    cy.log('✓ Verified: Clicked Generate button');
  }

  // Selector
  get addButton() {
    return cy.contains('button', 'Add');
  }

  // Action
  clickAdd() {
    this.waitForElement(this.addButton, 5000);
    this.addButton.click();
    cy.wait(1000);
    cy.log('✓ Verified: Clicked Add button');
  }

  // Selector
  get submitButton() {
    return cy.get('button[data-cy="btn-submit"]');
  }

  // Action
  clickSubmit() {
    this.waitForElement(this.submitButton, 5000);
    this.submitButton.click();
    cy.wait(3000);
    cy.log('✓ Verified: Clicked Submit button');
  }

  // Selector
  get successMessage() {
    return cy.contains('p', 'Successfully requested!');
  }

  // Action
  verifySuccessMessage() {
    this.waitForElement(this.successMessage, 5000);
    this.successMessage.should('be.visible');
    cy.wait(2000);
    cy.log('✓ Verified: Successfully requested message is displayed');
  }

  // Selector
  get closeButton() {
    return cy.get('button[data-cy="btn-close"]');
  }

  // Action
  clickClose() {
    this.waitForElement(this.closeButton, 5000);
    this.closeButton.click();
    cy.wait(1000);
    cy.log('✓ Verified: Clicked Close button');
  }

  // Action
  createSubscriptionFlow() {
    // Verify creation message
    cy.contains('Create a subscription for the order to start charging recurring payments').should('be.visible');
    cy.log('✓ Verified: Create subscription message is displayed');

    // Click Generate
    this.clickGenerate();

    // Click Add
    this.clickAdd();

    // Click Submit
    this.clickSubmit();

    // Verify success message
    this.verifySuccessMessage();

    // Click Close
    this.clickClose();
  }

  // ==================== HELPER METHODS ====================

  waitForElement(element, maxWait = 5000) {
    return element.should('be.visible', { timeout: maxWait });
  }
}

export default new OrderDetailPage();
