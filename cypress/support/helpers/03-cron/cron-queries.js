/**
 * Cron Test Database Queries
 * Contains SQL queries for cron recurring-payments processing tests
 */

class CronQueries {
  // ==================== CRON SETUP ====================

  /**
   * Step 1 — Disable ALL crons before selectively enabling the required ones.
   * Prevents any other cron from firing during the test.
   */
  disableAllCrons() {
    return `
      UPDATE public.cms_crons
      SET active = false, running = false
    `;
  }

  /**
   * Step 2 — Enable ONLY the two crons required for recurring-payment processing:
   *   - invoiceCharge queue worker (php artisan)
   *   - rp queue repeater (python)
   */
  enableSpecificCrons() {
    return `
      UPDATE public.cms_crons
      SET active = true
      WHERE command IN (
        'php artisan queue:work --stop-when-empty --max-jobs=100 --max-time=1800 --queue=invoiceCharge',
        'python queue-repeater.py --repeat=2 --max_jobs=1000 --max_time=3000 --queue=rp'
      )
    `;
  }

  /**
   * Step 14 — Reset ALL crons back to inactive after test completes.
   * Same as disableAllCrons() — aliased for clarity at end of test.
   */
  resetAllCrons() {
    return `
      UPDATE public.cms_crons
      SET active = false, running = false
    `;
  }

  // ==================== JOB QUEUE CLEANUP ====================

  /**
   * Delete stale/failed jobs from the queue before triggering new ones.
   * Removes only jobs with 0 attempts (never started) from RP-related queues.
   */
  deleteStaleJobs() {
    return `
      DELETE FROM public.jobs
      WHERE queue IN ('rp', 'invoiceCharge')
        AND attempts = 0
    `;
  }

  // ==================== SUBSCRIPTION + RP LOOKUP ====================

  /**
   * Find an active subscription that has at least 4 unsettled, enabled
   * recurring payments (RP) with no invoice yet.
   *
   * Returns: subscription_id, company_id, rp1, rp2, rp3, rp4
   *   where rp1–rp4 are recurring_payments.id values ordered ASC.
   *
   * company_id is from subscriptions.company_id — used in the Lumen API endpoint URL.
   *
   * Filters:
   * - Company:           Cypress.env('circuly_shopify_stripe')
   * - Payment provider: stripe / visa
   * - Order:            open, checkout origin
   * - Subscription:     normal type, active status
   * - RPs:              enabled, not deleted, not settled, no invoice yet
   */
  getSubscriptionWithRecurringPayments() {
    return `
      WITH RecurringPayments AS (
        SELECT
          s.subscription_id,
          s.company_id,
          r.id,
          ROW_NUMBER() OVER (PARTITION BY s.subscription_id ORDER BY r.id ASC) AS rn
        FROM subscriptions s
        LEFT JOIN orders o ON o.order_id = s.order_id AND o.company_id = s.company_id
        LEFT JOIN general_company_settings gcs ON o.company_id = gcs.uid
        LEFT JOIN recurring_payments r ON r.subscription_id = s.id AND r.company_id = s.company_id
        WHERE gcs.name IN ('${Cypress.env('circuly_shopify_stripe')}')
          AND o.payment_provider = 'stripe'
          AND o.payment_method_token = 'visa'
          AND o.status = 'open'
          AND o.origin = 'checkout'
          AND s.subscription_type IN ('normal')
          AND s.status IN ('active')
          AND r.enabled = true
          AND r.deleted_at IS NULL
          AND r.payment_settled = false
          AND r.invoice_id IS NULL
      )
      SELECT
        subscription_id,
        MAX(company_id) AS company_id,
        MAX(CASE WHEN rn = 1 THEN id END) AS rp1,
        MAX(CASE WHEN rn = 2 THEN id END) AS rp2,
        MAX(CASE WHEN rn = 3 THEN id END) AS rp3,
        MAX(CASE WHEN rn = 4 THEN id END) AS rp4
      FROM RecurringPayments
      WHERE rn <= 4
      GROUP BY subscription_id
      HAVING COUNT(id) >= 4
      LIMIT 1 OFFSET 1
    `;
  }

  // ==================== BILLING DATE UPDATES ====================

  /**
   * Set the billing_date on a specific recurring payment.
   * @param {number} rpId - recurring_payments.id
   * @param {string} dateStr - formatted date string e.g. '2026-02-25 00:00:00.000'
   */
  updateBillingDate(rpId, dateStr) {
    return `
      UPDATE public.recurring_payments
      SET billing_date = '${dateStr}'
      WHERE id = ${rpId}
    `;
  }

  // ==================== JOB QUEUE VERIFICATION ====================

  /**
   * Count all jobs in RP-related queues.
   * Used to verify that the API call pushed at least 1 job into the queue.
   */
  getJobsCount() {
    return `
      SELECT COUNT(*) AS count
      FROM public.jobs
      WHERE queue IN ('rp', 'invoiceCharge')
    `;
  }

  // ==================== INVOICE CHARGE CRON QUERIES ====================

  /**
   * Set ALL crons to active=true, running=false.
   * Used in invoiceChargeProcess test — all crons enabled (not selective).
   */
  setAllCronsActive() {
    return `
      UPDATE public.cms_crons
      SET active = true, running = false
    `;
  }

  /**
   * Read invoice_number, transaction_id and company_id from the invoices table.
   * company_id is used as the endpoint path param — no hardcoded values.
   * @param {number[]} ids - array of invoices.id values from testData.json cronTestInvoices
   */
  getInvoiceInfoByIds(ids) {
    return `
      SELECT i.invoice_number, i.transaction_id, i.company_id
      FROM public.invoices i
      WHERE i.id IN (${ids.join(',')})
    `;
  }

  /**
   * Count jobs in the invoiceCharge queue.
   * Used to verify the charge-queue API call pushed at least 1 job.
   */
  getInvoiceChargeJobsCount() {
    return `
      SELECT COUNT(*) AS count
      FROM public.jobs
      WHERE queue IN ('invoiceCharge')
    `;
  }

  /**
   * Get transaction status for a set of invoice numbers.
   * Used in the retry loop to check all transactions are no longer pending.
   * @param {string[]} invoiceNumbers - array of invoice_number strings
   */
  getTransactionsByInvoiceNumbers(invoiceNumbers) {
    const quoted = invoiceNumbers.map((n) => `'${n}'`).join(',');
    return `
      SELECT invoice_number, status
      FROM public.transactions
      WHERE invoice_number IN (${quoted})
      ORDER BY invoice_number ASC
    `;
  }

  // ==================== INVOICE STATUS CHECKS ====================

  /**
   * Check invoice_id and cumulated_invoice_id for a single recurring payment.
   * Used to verify RP4 (future-dated) still has no invoice.
   * @param {number} rpId - recurring_payments.id
   */
  getRPInvoiceStatus(rpId) {
    return `
      SELECT id, invoice_id, cumulated_invoice_id
      FROM public.recurring_payments
      WHERE id = ${rpId}
    `;
  }

  /**
   * Check invoice_id and cumulated_invoice_id for multiple recurring payments.
   * Used in the retry loop to check RP1, RP2, RP3 in a single query.
   * @param {number[]} rpIds - array of recurring_payments.id values
   */
  getMultipleRPInvoiceStatus(rpIds) {
    return `
      SELECT id, invoice_id, cumulated_invoice_id
      FROM public.recurring_payments
      WHERE id IN (${rpIds.join(',')})
      ORDER BY id ASC
    `;
  }

  // ==================== INVOICE VERIFICATION ====================

  /**
   * Fetch invoice body and errors for HTML validity verification.
   * @param {number} invoiceId - invoices.id
   */
  getInvoiceById(invoiceId) {
    return `
      SELECT id, body, errors
      FROM public.invoices
      WHERE id = ${invoiceId}
    `;
  }
}

export default new CronQueries();
