/**
 * Recurring Payment Process — E2E Test
 *
 * Verifies the full end-to-end cron-driven recurring payment processing pipeline:
 *   DB cron setup → find subscription + 4 RPs → set billing dates → trigger via Lumen API
 *   → verify jobs queued → wait for invoice generation → validate invoices in DB → reset crons
 */

import CronPage from '../../support/page-objects/CronPage';
import CronQueries from '../../support/helpers/cron-queries';

// ==================== DATE HELPERS ====================

/** Format a Date as a PostgreSQL timestamp: 'YYYY-MM-DD 00:00:00.000' */
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d} 00:00:00.000`;
}

const _today     = new Date();
const _yesterday = new Date(_today); _yesterday.setDate(_today.getDate() - 1);
const _tomorrow  = new Date(_today); _tomorrow.setDate(_today.getDate() + 1);

const DATE_TODAY     = formatDate(_today);     // e.g. 2026-02-25 00:00:00.000
const DATE_YESTERDAY = formatDate(_yesterday); // e.g. 2026-02-24 00:00:00.000
const DATE_TOMORROW  = formatDate(_tomorrow);  // e.g. 2026-02-26 00:00:00.000

// ==================== TEST ====================

describe('Recurring Payment Process', () => {
  it('should process recurring payments end-to-end via cron and generate invoices', () => {

    // ── STEP 1 ─────────────────────────────────────────────────────────────
    // Disable ALL crons — clean slate before selectively enabling the required ones
    cy.log('── Step 1: Disable ALL crons ──');
    cy.task('queryDb', CronQueries.disableAllCrons()).then(() => {
      cy.log('✓ All crons set to active=false, running=false');
    });

    cy.wait(3000);

    // ── STEP 2 ─────────────────────────────────────────────────────────────
    // Enable only the 2 required crons for RP + invoiceCharge queue processing
    cy.log('── Step 2: Enable specific crons (rp + invoiceCharge) ──');
    cy.task('queryDb', CronQueries.enableSpecificCrons()).then(() => {
      cy.log('✓ php artisan queue:work --queue=invoiceCharge → active=true');
      cy.log('✓ python queue-repeater.py --queue=rp          → active=true');
    });

    cy.wait(3000);

    // ── STEP 3 ─────────────────────────────────────────────────────────────
    // Delete stale un-started jobs from RP-related queues
    cy.log('── Step 3: Delete stale jobs (attempts=0) from rp / invoiceCharge queues ──');
    cy.task('queryDb', CronQueries.deleteStaleJobs()).then(() => {
      cy.log('✓ Stale jobs deleted');
    });

    cy.wait(3000);

    // ── STEP 4 ─────────────────────────────────────────────────────────────
    // Find an active subscription with ≥4 unsettled, uninvoiced, enabled RPs
    cy.log('── Step 4: Query subscription with 4 unsettled RPs ──');

    // rpData is assigned inside the .then() — all subsequent steps that need
    // it are chained inside the same .then() to preserve the Cypress queue order
    cy.task('queryDb', CronQueries.getSubscriptionWithRecurringPayments()).then((result) => {
      expect(result, 'Expected at least 1 subscription with ≥4 unsettled RPs').to.have.length.at.least(1);

      const rpData = result[0];
      cy.log(`✓ subscription_id : ${rpData.subscription_id}`);
      cy.log(`✓ company_id      : ${rpData.company_id}`);
      cy.log(`✓ RP1 id          : ${rpData.rp1}`);
      cy.log(`✓ RP2 id          : ${rpData.rp2}`);
      cy.log(`✓ RP3 id          : ${rpData.rp3}`);
      cy.log(`✓ RP4 id          : ${rpData.rp4}`);

      cy.wait(3000);

      // ── STEP 5 ───────────────────────────────────────────────────────────
      // Set billing dates: RP1/RP2/RP3 in past/today → will be processed
      //                    RP4 in future             → must NOT be processed
      cy.log('── Step 5: Update billing dates ──');
      cy.log(`  RP1 (${rpData.rp1}) → ${DATE_TODAY}     (today)`);
      cy.log(`  RP2 (${rpData.rp2}) → ${DATE_YESTERDAY} (yesterday)`);
      cy.log(`  RP3 (${rpData.rp3}) → ${DATE_YESTERDAY} (yesterday)`);
      cy.log(`  RP4 (${rpData.rp4}) → ${DATE_TOMORROW}  (tomorrow — should NOT trigger)`);

      cy.task('queryDb', CronQueries.updateBillingDate(rpData.rp1, DATE_TODAY)).then(() => {
        cy.log(`✓ RP1 billing_date → ${DATE_TODAY}`);
      });
      cy.task('queryDb', CronQueries.updateBillingDate(rpData.rp2, DATE_YESTERDAY)).then(() => {
        cy.log(`✓ RP2 billing_date → ${DATE_YESTERDAY}`);
      });
      cy.task('queryDb', CronQueries.updateBillingDate(rpData.rp3, DATE_YESTERDAY)).then(() => {
        cy.log(`✓ RP3 billing_date → ${DATE_YESTERDAY}`);
      });
      cy.task('queryDb', CronQueries.updateBillingDate(rpData.rp4, DATE_TOMORROW)).then(() => {
        cy.log(`✓ RP4 billing_date → ${DATE_TOMORROW}`);
      });

      cy.wait(3000);

      // ── STEP 6 ───────────────────────────────────────────────────────────
      // Login to Lumen API to obtain a bearer token
      cy.log('── Step 6: Login to Lumen API ──');
      CronPage.lumenLogin().then((token) => {
        cy.log('✓ Lumen bearer token acquired');

        cy.wait(3000);

        // ── STEP 7 ─────────────────────────────────────────────────────────
        // Trigger recurring-payment processing for this company
        cy.log('── Step 7: Trigger recurring-payments endpoint ──');
        CronPage.triggerRecurringPayments(rpData.company_id, token).then((response) => {
          cy.log(`✓ Response: ${JSON.stringify(response.body)}`);

          expect(response.body.success, 'API success should be true').to.be.true;

          // Parse "num of required queues:N" from message
          const match = response.body.message.match(/num of required queues[:\s]+(\d+)/i);
          expect(match, `Message should contain queue count. Got: "${response.body.message}"`).to.not.be.null;

          const numQueues = parseInt(match[1], 10);
          cy.log(`✓ Jobs pushed to queue: ${numQueues}`);
          expect(numQueues, 'At least 1 job should be queued').to.be.at.least(1);
        });

        cy.wait(8000);

        // ── STEP 8 ─────────────────────────────────────────────────────────
        // Verify jobs exist in the DB job queue
        cy.log('── Step 8: Verify job queue count in DB ──');
        cy.task('queryDb', CronQueries.getJobsCount()).then((result) => {
          const jobCount = Number(result[0].count);
          cy.log(`✓ Jobs in queue: ${jobCount}`);
          expect(jobCount, 'DB job queue should contain more than 0 job').to.be.greaterThan(0);
        });

        cy.wait(3000);

        // ── STEP 9 ─────────────────────────────────────────────────────────
        // Wait 2 minutes for the cron workers to process the RP jobs
        cy.log('── Step 9: Wait 2 minutes for cron processing ──');
        cy.wait(120000);

        // ── STEP 10 ────────────────────────────────────────────────────────
        // Retry loop: poll DB up to 3 times (1 min apart) until RP1/RP2/RP3 have invoices
        cy.log('── Step 10: Retry loop — check RP1, RP2, RP3 for invoices (max 3 retries) ──');
        CronPage.waitForInvoices(rpData.rp1, rpData.rp2, rpData.rp3, 3);

        // After the retry loop confirms invoices exist, read the final IDs
        cy.task('queryDb', CronQueries.getMultipleRPInvoiceStatus([rpData.rp1, rpData.rp2, rpData.rp3])).then((rows) => {
          const invoiceIds = CronPage.extractInvoiceIds(rows);

          cy.log('✓ Invoice IDs confirmed:');
          cy.log(`  RP1 (${rpData.rp1}) → invoice id: ${invoiceIds.inv1}`);
          cy.log(`  RP2 (${rpData.rp2}) → invoice id: ${invoiceIds.inv2}`);
          cy.log(`  RP3 (${rpData.rp3}) → invoice id: ${invoiceIds.inv3}`);

          expect(invoiceIds.inv1, 'RP1 must have an invoice ID').to.not.be.null;
          expect(invoiceIds.inv2, 'RP2 must have an invoice ID').to.not.be.null;
          expect(invoiceIds.inv3, 'RP3 must have an invoice ID').to.not.be.null;

          cy.wait(3000);

          // ── STEP 11 ──────────────────────────────────────────────────────
          // RP4 has a future billing date — must NOT have been processed
          cy.log('── Step 11: Verify RP4 has NO invoice (future billing date) ──');
          cy.task('queryDb', CronQueries.getRPInvoiceStatus(rpData.rp4)).then((result) => {
            expect(result).to.have.length(1);
            const rp4 = result[0];
            cy.log(`  RP4 invoice_id           : ${rp4.invoice_id}`);
            cy.log(`  RP4 cumulated_invoice_id : ${rp4.cumulated_invoice_id}`);
            expect(rp4.invoice_id, 'RP4 invoice_id must be null (future date)').to.be.null;
            expect(rp4.cumulated_invoice_id, 'RP4 cumulated_invoice_id must be null (future date)').to.be.null;
            cy.log('✓ RP4 correctly has no invoice');
          });

          cy.wait(3000);

          // ── STEP 12 ──────────────────────────────────────────────────────
          // Persist invoice IDs into testData.json for downstream tests
          cy.log('── Step 12: Store invoice IDs in testData.json ──');
          cy.readFile('cypress/fixtures/testData.json').then((data) => {
            const updated = {
              ...data,
              cronTestInvoices: {
                inv1: invoiceIds.inv1,
                inv2: invoiceIds.inv2,
                inv3: invoiceIds.inv3,
              },
            };
            cy.writeFile('cypress/fixtures/testData.json', updated);
            cy.log('✓ testData.json updated:');
            cy.log(`  cronTestInvoices.inv1 : ${invoiceIds.inv1}`);
            cy.log(`  cronTestInvoices.inv2 : ${invoiceIds.inv2}`);
            cy.log(`  cronTestInvoices.inv3 : ${invoiceIds.inv3}`);
          });

          cy.wait(3000);

          // ── STEP 13 ──────────────────────────────────────────────────────
          // Validate each invoice: body must contain HTML, errors must be null
          cy.log('── Step 13: Verify invoice HTML body and errors field ──');

          [
            { label: 'Invoice 1 (RP1)', id: invoiceIds.inv1 },
            { label: 'Invoice 2 (RP2)', id: invoiceIds.inv2 },
            { label: 'Invoice 3 (RP3)', id: invoiceIds.inv3 },
          ].forEach(({ label, id }) => {
            cy.log(`  Verifying ${label} (id: ${id})`);

            cy.task('queryDb', CronQueries.getInvoiceById(id)).then((result) => {
              expect(result, `${label}: should return exactly 1 row`).to.have.length(1);

              const invoice = result[0];

              // body must not be null or empty
              expect(invoice.body, `${label}: body must not be null`).to.not.be.null;
              expect(invoice.body, `${label}: body must not be empty`).to.not.equal('');

              // body must contain at least one HTML structural tag
              const bodyLower = invoice.body.toLowerCase();
              const hasHtml =
                bodyLower.includes('<html') ||
                bodyLower.includes('<body') ||
                bodyLower.includes('<table') ||
                bodyLower.includes('<div');
              expect(
                hasHtml,
                `${label}: body should contain valid HTML. Snippet: "${invoice.body.substring(0, 200)}"`
              ).to.be.true;

              // errors must be null — no processing failures
              expect(invoice.errors, `${label}: errors must be null`).to.be.null;

              cy.log(`  ✓ ${label} — body is valid HTML, errors is null`);
            });
          });

          cy.wait(3000);

          // ── STEP 14 ──────────────────────────────────────────────────────
          // Reset ALL crons back to inactive — leave the system clean
          cy.log('── Step 14: Reset ALL crons to active=false, running=false ──');
          cy.task('queryDb', CronQueries.resetAllCrons()).then(() => {
            cy.log('✓ All crons reset to active=false, running=false');
            cy.log('✓ Recurring payment process test complete');
          });

        }); // end invoiceIds .then()
      }); // end lumenLogin .then()
    }); // end getSubscriptionWithRecurringPayments .then()

  }); // end it()
}); // end describe()
