import SubscriptionListPage from '../../support/page-objects/02-subscription-page/SubscriptionListPage';
import SubscriptionWorkflowQueries from '../../support/helpers/02-subscription-page/subscription-workflow-queries';

// ─────────────────────────────────────────────────────────────────────────────
// Describe: Subscription List - Filters, Export & Pagination
// ─────────────────────────────────────────────────────────────────────────────
describe('Subscription List - Filters, Export & Pagination', () => {

  beforeEach(() => {
    // Navigate to the subscription list page (handles login session via cy.visit)
    SubscriptionListPage.navigateToSubscriptionList();
    // Wait for the page to finish loading before each test
    SubscriptionListPage.waitForPaginationVisible();
  });

  // =========================================================================
  // TEST 1 – Click "Clear" and capture total record count
  // =========================================================================
  it('Test 1: should clear all filters and capture total record count', () => {
    cy.log('========== Test 1: Clear Filters & Total Record Count ==========');

    // Clear any active filters
    SubscriptionListPage.clearAllFilters();
    SubscriptionListPage.waitForPaginationVisible();

    // Parse and validate total record count from pagination text e.g. "1-10 of 874"
    SubscriptionListPage.paginationText.invoke('text').then((text) => {
      const totalRecords = SubscriptionListPage.parseTotalRecords(text);
      cy.log(`✓ UI total records after clearing filters: ${totalRecords}`);
      expect(totalRecords).to.be.greaterThan(0);

      // Verify UI count matches DB count for the company
      cy.task('queryDb', SubscriptionWorkflowQueries.getTotalSubscriptionCount()).then((result) => {
        const dbTotal = Number(result[0].total);
        cy.log(`✓ DB total subscriptions for company: ${dbTotal}`);
        expect(totalRecords).to.equal(dbTotal);
        cy.log(`✓ Verified: UI count (${totalRecords}) matches DB count (${dbTotal})`);
      });
    });

    cy.log('✓ Test 1 Completed: Total record count captured and verified against DB');
  });

  // =========================================================================
  // TEST 2 – Filter by Status = "Active"
  // =========================================================================
  it('Test 2: should filter subscriptions by Status = Active and verify count matches DB', () => {
    cy.log('========== Test 2: Filter by Status = Active + DB Verification ==========');

    // Reset to unfiltered state first
    SubscriptionListPage.clearAllFilters();

    // Apply Status = Active filter
    SubscriptionListPage.filterByStatus('Active');
    cy.wait(3000);

    // Capture UI filtered count and verify against DB
    SubscriptionListPage.paginationText.invoke('text').then((text) => {
      const filteredCount = SubscriptionListPage.parseTotalRecords(text);
      cy.log(`✓ UI filtered count (Active): ${filteredCount}`);
      expect(filteredCount).to.be.greaterThan(0);

      // Verify UI count matches DB count where status = 'active'
      cy.task('queryDb', SubscriptionWorkflowQueries.getSubscriptionCountByStatus('active')).then((result) => {
        const dbTotal = Number(result[0].total);
        cy.log(`✓ DB count for status = 'active': ${dbTotal}`);
        expect(filteredCount).to.equal(dbTotal);
        cy.log(`✓ Verified: UI count (${filteredCount}) matches DB count (${dbTotal})`);
      });
    });

    // Verify at least one row in the table shows "active" status badge
    cy.get('tbody td').contains(/^active$/i).should('exist');
    cy.log('✓ Verified: "active" status badge visible in table rows');

    cy.log('✓ Test 2 Completed: Filter by Active status verified against DB');
  });

  // =========================================================================
  // TEST 3 – Filter by Type = "Consumable"
  // =========================================================================
  it('Test 3: should filter subscriptions by Type = Consumable', () => {
    cy.log('========== Test 3: Filter by Type = Consumable ==========');

    // Reset to unfiltered state first
    SubscriptionListPage.clearAllFilters();

    // Apply Type = Consumable filter
    SubscriptionListPage.filterByType('Consumable');
    cy.wait(3000);

    // Capture UI filtered count and verify against DB
    SubscriptionListPage.paginationText.invoke('text').then((text) => {
      const filteredCount = SubscriptionListPage.parseTotalRecords(text);
      cy.log(`✓ UI filtered count (Consumable): ${filteredCount}`);
      expect(filteredCount).to.be.greaterThan(0);

      // Verify UI count matches DB count where subscription_type = 'consumable'
      cy.task('queryDb', SubscriptionWorkflowQueries.getSubscriptionCountByType('consumable')).then((result) => {
        const dbTotal = Number(result[0].total);
        cy.log(`✓ DB count for subscription_type = 'consumable': ${dbTotal}`);
        expect(filteredCount).to.equal(dbTotal);
        cy.log(`✓ Verified: UI count (${filteredCount}) matches DB count (${dbTotal})`);
      });
    });

    cy.log('✓ Test 3 Completed: Filter by Consumable type verified against DB');
  });

  // =========================================================================
  // TEST 4 – Select all via header checkbox & click Export
  // =========================================================================
  it('Test 4: should select all rows via header checkbox and click Export', () => {
    cy.log('========== Test 4: Select All & Export ==========');

    // Start from clean state
    SubscriptionListPage.clearAllFilters();

    // Apply both filters to narrow down the results
    SubscriptionListPage.filterByStatus('Active');
    SubscriptionListPage.filterByType('Consumable');

    // Select all rows using the header checkbox
    SubscriptionListPage.selectAllRows();

    // Assert all row checkboxes are checked
    SubscriptionListPage.verifyAllRowsChecked();

    // Click Export (toolbar) → Export data modal opens
    SubscriptionListPage.clickExport();

    // In the modal: click Export → verify success → close
    SubscriptionListPage.clickExportInModal();
    SubscriptionListPage.closeExportSuccessDialog();

    cy.log('✓ Test 4 Completed: Select all and export flow verified');
  });

  // =========================================================================
  // TEST 6 – Pagination works correctly (nested describe)
  // =========================================================================
  describe('Pagination', () => {

    // ── Test 5a: Correct initial state ────────────────────────────────────────
    it('Test 5a: should display correct initial pagination state', () => {
      cy.log('========== Test 5a: Initial Pagination State ==========');

      // Pagination should start at "1-N of total"
      SubscriptionListPage.paginationText
        .invoke('text')
        .should('match', /^1-\d+ of \d+$/);

      // First and Prev buttons should be disabled on page 1
      SubscriptionListPage.firstPageButton.should('be.disabled');
      SubscriptionListPage.prevPageButton.should('be.disabled');

      // Next and Last buttons should be enabled (assuming total > 1 page)
      SubscriptionListPage.nextPageButton.should('not.be.disabled');
      SubscriptionListPage.lastPageButton.should('not.be.disabled');

      cy.log('✓ Test 6a Completed: Initial pagination state verified');
    });

    // ── Test 5b: Navigate to next page and back ────────────────────────────────
    it('Test 5b: should navigate to the next page and back', () => {
      cy.log('========== Test 5b: Next Page Navigation ==========');

      // Go to page 2
      SubscriptionListPage.clickNextPage();

      // Verify pagination label shows page 2 (starts > 1)
      SubscriptionListPage.paginationText.invoke('text').then((page2Text) => {
        const page2Start = parseInt(page2Text.split('-')[0], 10);
        expect(page2Start).to.be.greaterThan(1);
        cy.log(`✓ On page 2, starts at row: ${page2Start}`);
      });

      // First and Prev should now be enabled
      SubscriptionListPage.prevPageButton.should('not.be.disabled');
      SubscriptionListPage.firstPageButton.should('not.be.disabled');

      // Go back to page 1
      SubscriptionListPage.clickPrevPage();

      // Should return to page 1
      SubscriptionListPage.paginationText.invoke('text').should('match', /^1-/);
      SubscriptionListPage.prevPageButton.should('be.disabled');
      SubscriptionListPage.firstPageButton.should('be.disabled');

      cy.log('✓ Test 6b Completed: Next/prev page navigation verified');
    });

    // ── Test 6c: Navigate directly to the last page ────────────────────────────
    it.only('Test 6c: should navigate directly to the last page', () => {
      cy.log('========== Test 6c: Last Page Navigation ==========');

      SubscriptionListPage.paginationText.invoke('text').then((text) => {
        const total = SubscriptionListPage.parseTotalRecords(text);
        const pageSize = 10; // default page size
        const lastPageStart = (Math.ceil(total / pageSize) - 1) * pageSize + 1;
        cy.log(`✓ Total: ${total} → last page starts at row: ${lastPageStart}`);

        // Jump to last page
        SubscriptionListPage.clickLastPage();

        // Verify we are on the last page
        SubscriptionListPage.paginationText.invoke('text').then((lastPageText) => {
          const startNum = parseInt(lastPageText.split('-')[0], 10);
          expect(startNum).to.equal(lastPageStart);
          cy.log(`✓ On last page, starts at row: ${startNum}`);
        });

        // Next and Last should be disabled on the last page
        SubscriptionListPage.nextPageButton.should('be.disabled');
        SubscriptionListPage.lastPageButton.should('be.disabled');

        // Return to first page
        SubscriptionListPage.clickFirstPage();
        SubscriptionListPage.paginationText.invoke('text').should('match', /^1-/);
        cy.log('✓ Returned to first page');
      });

      cy.log('✓ Test 6c Completed: Last page navigation and return to first verified');
    });

    // ── Test 6d: Change items per page size ────────────────────────────────────
    it.only('Test 6d: should change items per page size', () => {
      cy.log('========== Test 6d: Change Page Size ==========');

      // Change to 25 items per page
      SubscriptionListPage.changePageSize(25);

      SubscriptionListPage.paginationText.invoke('text').then((text) => {
        const rangeEnd = parseInt(text.split('-')[1].split(' ')[0], 10);
        const total = SubscriptionListPage.parseTotalRecords(text);
        expect(rangeEnd).to.equal(Math.min(25, total));
        cy.log(`✓ Page size 25: showing up to row ${rangeEnd}`);
      });

      // Change back to 10 items per page
      SubscriptionListPage.changePageSize(10);
      SubscriptionListPage.paginationText.invoke('text').should('match', /^1-10 of/);
      cy.log('✓ Page size reverted to 10');

      cy.log('✓ Test 6d Completed: Page size change verified');
    });

    // ── Test 6e: Record count stays consistent across pages after filtering ────
    it.only('Test 6e: should maintain correct record count after filtering + pagination', () => {
      cy.log('========== Test 6e: Record Count Consistency After Filter + Paginate ==========');

      // Apply Status = Active filter
      SubscriptionListPage.filterByStatus('Active');
      cy.wait(3000);

      SubscriptionListPage.paginationText.invoke('text').then((text) => {
        const total = SubscriptionListPage.parseTotalRecords(text);
        cy.log(`✓ Active subscriptions total: ${total}`);

        if (total > 10) {
          // Navigate to page 2
          SubscriptionListPage.clickNextPage();

          SubscriptionListPage.paginationText.invoke('text').then((page2Text) => {
            const page2Total = SubscriptionListPage.parseTotalRecords(page2Text);
            // Total record count must remain the same across pages
            expect(page2Total).to.equal(total);
            // Page 2 must start at row 11
            expect(page2Text).to.match(/^11-/);
            cy.log(`✓ Verified: Total stays ${total} on page 2`);
          });
        } else {
          cy.log(`✓ Skipped page 2 check — total ${total} fits on one page`);
        }
      });

      cy.log('✓ Test 6e Completed: Record count consistency verified');
    });

  }); // end describe('Pagination')

}); // end describe('Subscription List - Filters, Export & Pagination')
