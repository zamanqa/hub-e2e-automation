/**
 * Cron Page Object
 * Contains API interaction methods and helpers for cron recurring-payments tests.
 * No UI selectors — this page object drives the Lumen backend API directly.
 */

import CronQueries from '../helpers/cron-queries';

const LUMEN_BASE_URL = 'https://circuly-lumen.herokuapp.com/v1';

class CronPage {
  // ==================== API: LOGIN ====================

  /**
   * Login to the Lumen API and return the bearer token.
   * Stores the token in a closure variable for chaining.
   *
   * POST /auth/login
   * @returns {Cypress.Chainable<string>} - Cypress chain resolving to token string
   */
  lumenLogin() {
    return cy
      .request({
        method: 'POST',
        url: `${LUMEN_BASE_URL}/auth/login`,
        body: {
          email: 'super.admin@circuly.io',
          password: 'spicything60',
        },
        failOnStatusCode: true,
      })
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.success).to.be.true;
        const token = response.body.token;
        expect(token).to.be.a('string').and.not.be.empty;
        cy.log(`✓ Lumen login successful — token acquired`);
        return token;
      });
  }

  // ==================== API: TRIGGER RECURRING PAYMENTS ====================

  /**
   * Call the Lumen endpoint to push recurring payment jobs into the queue.
   * Waits 2 seconds before resolving to allow the queue to register jobs.
   *
   * POST /{companyId}/circulydb/recurring-payments
   * @param {string} companyId - company UUID from subscriptions.company_id
   * @param {string} token - bearer token from lumenLogin()
   * @returns {Cypress.Chainable<object>} - Cypress chain with full response
   */
  triggerRecurringPayments(companyId, token) {
    return cy
      .request({
        method: 'POST',
        url: `${LUMEN_BASE_URL}/${companyId}/circulydb/recurring-payments`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: true,
      })
      .then((response) => {
        cy.wait(2000);
        cy.log(`✓ Recurring payments triggered — response: ${JSON.stringify(response.body)}`);
        return response;
      });
  }

  // ==================== RETRY: WAIT FOR INVOICES ====================

  /**
   * Poll the DB up to maxRetries times (1-minute intervals) until RP1, RP2, RP3
   * all have either invoice_id or cumulated_invoice_id set.
   * Breaks the loop immediately once all 3 are found.
   *
   * @param {number} rp1 - recurring_payments.id for RP1
   * @param {number} rp2 - recurring_payments.id for RP2
   * @param {number} rp3 - recurring_payments.id for RP3
   * @param {number} maxRetries - maximum retry attempts (default 3)
   * @returns {Cypress.Chainable<object[]>} - resolved rows from recurring_payments
   */
  waitForInvoices(rp1, rp2, rp3, maxRetries = 3) {
    const attempt = (retriesLeft) => {
      cy.log(`⏳ Checking invoices — attempts remaining: ${retriesLeft}`);

      cy.task('queryDb', CronQueries.getMultipleRPInvoiceStatus([rp1, rp2, rp3])).then(
        (rows) => {
          const allFound = rows.every(
            (row) => row.invoice_id !== null || row.cumulated_invoice_id !== null
          );

          if (allFound) {
            cy.log(`✓ All 3 RPs have invoices — loop complete`);
            rows.forEach((row) => {
              const id = row.invoice_id || row.cumulated_invoice_id;
              cy.log(`  RP id=${row.id} → invoice id=${id}`);
            });
          } else if (retriesLeft > 0) {
            const missing = rows
              .filter((row) => row.invoice_id === null && row.cumulated_invoice_id === null)
              .map((row) => row.id);
            cy.log(
              `⚠ Invoices not yet created for RP ids: [${missing.join(', ')}] — waiting 1 min...`
            );
            cy.wait(60000);
            attempt(retriesLeft - 1);
          } else {
            throw new Error(
              `Invoices not created for all 3 RPs after maximum retries. ` +
              `Check cron logs and recurring_payments table for RP ids: [${rp1}, ${rp2}, ${rp3}]`
            );
          }
        }
      );
    };

    attempt(maxRetries);
  }

  // ==================== HELPER: EXTRACT INVOICE IDS ====================

  /**
   * Extract invoice IDs from recurring_payments rows.
   * Prefers invoice_id, falls back to cumulated_invoice_id.
   *
   * @param {object[]} rows - rows from getMultipleRPInvoiceStatus query
   * @returns {{ inv1: number, inv2: number, inv3: number }}
   */
  extractInvoiceIds(rows) {
    const ids = rows.map((row) => row.invoice_id || row.cumulated_invoice_id);
    return {
      inv1: ids[0],
      inv2: ids[1],
      inv3: ids[2],
    };
  }
}

export default new CronPage();
