import { ReturnsPage, RepairsPage } from '../../support/page-objects/05-repair-and-return/ReturnAndRepairPage';
import ReturnRepairQueries from '../../support/helpers/05-repair-and-return/return-repair-queries';

describe('Circuly CMS – Return and Repair Workflow', () => {
  // Shared across all three tests — fetched once in before()
  let serialNumber;

  before(() => {
    cy.task('queryDb', ReturnRepairQueries.getSerialNumberForReturn()).then((result) => {
      serialNumber = result[0].serial_number;
      cy.log(`✓ Serial number fetched from DB: ${serialNumber}`);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 1 – Handle Return
  //   Navigate → search serial number → Handle → Mark as returned →
  //   verify success message → Close → DB verify location_status = 'to repair'
  // ═══════════════════════════════════════════════════════════════════════════
  it('1. handles return for target serial number and verifies location_status is "to repair"', () => {
    cy.log('========== TEST 1: Handle Return ==========');

    ReturnsPage.navigate();

    ReturnsPage.searchFor(serialNumber);

    ReturnsPage.clickHandleForSerialNumber(serialNumber);

    ReturnsPage.clickMarkAsReturned();

    ReturnsPage.verifySuccessMessage();

    ReturnsPage.clickClose();
    ReturnsPage.verifyModalClosed();

    // DB verification: location_status must now be 'to repair'
    cy.task('queryDb', ReturnRepairQueries.getProductTrackingBySerialNumber(serialNumber))
      .then((result) => {
        expect(result[0].location_status).to.eq('to repair');
        cy.log(`✓ DB verified: location_status = "${result[0].location_status}"`);
      });

    cy.log('✓ TEST 1 Completed');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 2 – Initiate Repair
  //   Navigate → search serial number → click first subscription ID →
  //   Start repair → Submit → verify success message → Close
  // ═══════════════════════════════════════════════════════════════════════════
  it('2. initiates repair for target serial number and verifies success', () => {
    cy.log('========== TEST 2: Initiate Repair ==========');

    // Navigate to Repairs page
    RepairsPage.navigate();

    // Search using the same serial number fetched once in before()
    RepairsPage.searchFor(serialNumber);

    // Click the subscription ID link in the first result row
    RepairsPage.clickFirstSubscriptionLink();

    // Start repair → Submit → verify success → Close
    RepairsPage.startRepairButton.should('be.visible');
    RepairsPage.clickStartRepair();

    RepairsPage.submitButton.should('be.visible');
    RepairsPage.clickSubmit();

    RepairsPage.successMessage.should('be.visible');
    RepairsPage.clickClose();

    cy.log('✓ TEST 2 Completed');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 3 – DB Verification
  //   After repair submission, location_status must be 'in stock'
  // ═══════════════════════════════════════════════════════════════════════════
  it('3. verifies serial number location_status is updated to "in stock" after repair', () => {
    cy.log('========== TEST 3: DB Verification – in stock ==========');

    cy.task('queryDb', ReturnRepairQueries.getProductTrackingBySerialNumber(serialNumber))
      .then((result) => {
        expect(result[0].location_status).to.eq('in stock');
        cy.log(`✓ DB verified: location_status = "${result[0].location_status}"`);
      });

    cy.log('✓ TEST 3 Completed');
  });

}); // end describe
