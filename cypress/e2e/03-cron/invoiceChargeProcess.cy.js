/**
 * Invoice Charge Process — E2E Test
 *
 * Verifies the full end-to-end cron-driven invoice charge processing pipeline:
 *   Read stored invoice IDs → get company_id from DB (no hardcoding)
 *   → setup crons/jobs → login → trigger charge-queue API
 *   → verify jobs queued → wait for processing
 *   → retry until transactions are non-pending → log results → reset crons
 */

import CronPage from '../../support/page-objects/CronPage';
import CronQueries from '../../support/helpers/cron-queries';

// ==================== TEST ====================

describe('Invoice Charge Process', () => {
  it('should trigger invoice charge cron and verify transaction statuses are non-pending', () => {

    // Shared values — assigned inside Step 0's .then(), used in subsequent chained steps
    let companyId;
    let invoiceNumbers;

    // ── STEP 0 ─────────────────────────────────────────────────────────────
    // Read stored invoice IDs from testData.json, then query invoices table to
    // get company_id (for the API endpoint) and invoice_numbers (for transaction lookup).
    // No hardcoded values — everything comes from the DB.
    cy.log('── Step 0: Read invoice IDs from testData.json + query company_id ──');

    cy.readFile('cypress/fixtures/testData.json').then((data) => {
      const cronInvoices = data.cronTestInvoices;
      expect(cronInvoices, 'cronTestInvoices must exist in testData.json').to.exist;

      // Deduplicate IDs (inv1/inv2 may be the same value)
      const uniqueIds = [...new Set([
        Number(cronInvoices.inv1),
        Number(cronInvoices.inv2),
        Number(cronInvoices.inv3),
      ])];

      cy.log(`  Invoice IDs from fixture: [${uniqueIds.join(', ')}]`);

      cy.task('queryDb', CronQueries.getInvoiceInfoByIds(uniqueIds)).then((rows) => {
        expect(rows, 'Expected at least 1 invoice row from DB').to.have.length.at.least(1);

        // company_id — same for all rows, take from first
        companyId = rows[0].company_id;
        invoiceNumbers = rows.map((r) => r.invoice_number);

        cy.log(`✓ company_id     : ${companyId}`);
        cy.log(`✓ invoice_numbers: [${invoiceNumbers.join(', ')}]`);

        cy.wait(3000);

        // ── STEP 1 ─────────────────────────────────────────────────────────
        // Set ALL crons to active=true, running=false
        cy.log('── Step 1: Set ALL crons active=true, running=false ──');
        cy.task('queryDb', CronQueries.setAllCronsActive()).then(() => {
          cy.log('✓ All crons set to active=true, running=false');
        });

        cy.wait(3000);

        // ── STEP 2 ─────────────────────────────────────────────────────────
        // Delete stale un-started jobs from RP/invoiceCharge queues
        cy.log('── Step 2: Delete stale jobs (attempts=0) from rp / invoiceCharge queues ──');
        cy.task('queryDb', CronQueries.deleteStaleJobs()).then(() => {
          cy.log('✓ Stale jobs deleted');
        });

        cy.wait(3000);

        // ── STEP 3 ─────────────────────────────────────────────────────────
        // Login to Lumen API to obtain a bearer token
        cy.log('── Step 3: Login to Lumen API ──');
        CronPage.lumenLogin().then((token) => {
          cy.log('✓ Lumen bearer token acquired');

          cy.wait(3000);

          // ── STEP 4 ───────────────────────────────────────────────────────
          // Trigger the invoice charge-queue endpoint using the DB-derived company_id
          cy.log('── Step 4: Trigger invoice charge-queue endpoint ──');
          cy.log(`  POST /{${companyId}}/circulydb/invoices/charge-queue`);

          CronPage.triggerInvoiceCharge(companyId, token).then((response) => {
            cy.wait(2000);
            cy.log(`✓ Response: ${JSON.stringify(response.body)}`);

            expect(response.body.success, 'API success should be true').to.be.true;

            // Parse "num of required queues:N" from message
            const match = response.body.message.match(/num of required queues[:\s]+(\d+)/i);
            expect(
              match,
              `Message should contain queue count. Got: "${response.body.message}"`
            ).to.not.be.null;

            const numQueues = parseInt(match[1], 10);
            cy.log(`✓ Jobs pushed to queue: ${numQueues}`);
            expect(numQueues, 'At least 1 job should be queued').to.be.at.least(1);
          });

          cy.wait(3000);

          // ── STEP 5 ───────────────────────────────────────────────────────
          // Verify jobs exist in the DB invoiceCharge queue
          cy.log('── Step 5: Verify invoiceCharge job queue count in DB ──');
          cy.task('queryDb', CronQueries.getInvoiceChargeJobsCount()).then((result) => {
            const jobCount = Number(result[0].count);
            cy.log(`✓ Jobs in invoiceCharge queue: ${jobCount}`);
            expect(jobCount, 'DB invoiceCharge queue should contain at least 1 job').to.be.greaterThan(0);
          });

          cy.wait(3000);

          // ── STEP 6 ───────────────────────────────────────────────────────
          // Wait 2 minutes for the cron workers to process the invoice charge jobs
          cy.log('── Step 6: Wait 2 minutes for cron processing ──');
          cy.wait(120000);

          cy.wait(3000);

          // ── STEP 7 ───────────────────────────────────────────────────────
          // invoice_numbers already stored from Step 0 — no extra query needed
          cy.log('── Step 7: invoice_numbers ready from Step 0 ──');
          cy.log(`  Checking transactions for: [${invoiceNumbers.join(', ')}]`);

          cy.wait(3000);

          // ── STEP 8 / 9 ───────────────────────────────────────────────────
          // Retry loop: poll until all transaction statuses are NOT 'pending'
          // (max 3 retries, 1 min apart — breaks as soon as all are settled)
          cy.log('── Step 8: Retry loop — check transaction statuses (max 3 retries, 1 min apart) ──');
          CronPage.waitForTransactionStatus(invoiceNumbers, 3);

          // ── STEP 9 ───────────────────────────────────────────────────────
          // After loop confirms non-pending — read final statuses for logging
          cy.task('queryDb', CronQueries.getTransactionsByInvoiceNumbers(invoiceNumbers)).then((rows) => {
            cy.wait(3000);

            // ── STEP 10 ──────────────────────────────────────────────────────
            // Print invoice_number + transaction status for each row
            cy.log('── Step 10: Final transaction statuses ──');
            rows.forEach((row) => {
              cy.log(`  ✓ invoice_number: ${row.invoice_number}  →  status: ${row.status}`);
            });

            // Assert no row is still pending
            rows.forEach((row) => {
              expect(
                row.status,
                `Transaction for ${row.invoice_number} must not be pending`
              ).to.not.equal('pending');
            });

            cy.wait(3000);

            // ── STEP 11 ──────────────────────────────────────────────────────
            // Reset ALL crons back to inactive — leave the system clean
            cy.log('── Step 11: Reset ALL crons to active=false, running=false ──');
            cy.task('queryDb', CronQueries.resetAllCrons()).then(() => {
              cy.log('✓ All crons reset to active=false, running=false');
              cy.log('✓ Invoice charge process test complete');
            });

          }); // end final transaction rows .then()
        }); // end lumenLogin .then()
      }); // end getInvoiceInfoByIds .then()
    }); // end readFile .then()

  }); // end it()
}); // end describe()
