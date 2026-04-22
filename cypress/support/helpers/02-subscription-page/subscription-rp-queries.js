/**
 * Subscription Recurring Payments (RP) Database Queries
 * Contains SQL queries for subscription recurring payments test operations
 */

class SubscriptionRPQueries {

  /**
   * Get an active subscription with at least 4 unsettled recurring payments
   * Filters by:
   * - Company: from Cypress.env('circuly_shopify_stripe')
   * - Payment provider: stripe
   * - Payment method: visa
   * - Order status: open
   * - Order origin: checkout
   * - Subscription type: normal
   * - Subscription status: active
   * - Recurring payments: enabled, not deleted, not settled, no invoice
   * - Minimum 4 recurring payments
   */
  getActiveSubscriptionWithRPs() {
    return `
      WITH RecurringPayments AS (
        SELECT
          s.subscription_id,
          r.id,
          ROW_NUMBER() OVER (PARTITION BY s.subscription_id ORDER BY r.id ASC) AS rn
        FROM subscriptions s
        LEFT JOIN orders o ON o.order_id = s.order_id AND o.company_id = s.company_id
        LEFT JOIN general_company_settings gcs ON o.company_id = gcs.uid
        LEFT JOIN recurring_payments r ON r.subscription_id = s.id AND r.company_id = s.company_id
        WHERE gcs.name IN ('${Cypress.env('circuly_shopify_stripe')}')
          AND o.payment_method_token IN ('visa','mastercard','card','paypal')
        AND o.payment_provider IN ('stripe','mollie','adyen','braintree')
        AND o.status IN ('open','fulfilled')
          AND o.origin = 'checkout'
          AND s.subscription_type IN ('normal')
          AND s.status IN ('active')
          AND r.enabled = true
          AND r.deleted_at IS NULL
          AND r.payment_settled = false
          AND r.invoice_id IS NULL
      )
      SELECT
        s.subscription_id,
        MAX(CASE WHEN r.rn = 1 THEN r.id END) AS RP1,
        MAX(CASE WHEN r.rn = 2 THEN r.id END) AS RP2,
        MAX(CASE WHEN r.rn = 3 THEN r.id END) AS RP3,
        MAX(CASE WHEN r.rn = 4 THEN r.id END) AS RP4
      FROM subscriptions s
      LEFT JOIN RecurringPayments r ON r.subscription_id = s.subscription_id
      WHERE r.rn <= 4
      GROUP BY s.subscription_id
      HAVING COUNT(r.id) >= 4
      LIMIT 1 OFFSET 1
    `;
  }

  /**
   * Get current count of active, unsettled, non-deleted recurring payments for a subscription
   * @param {string} subscriptionId - The subscription ID
   */
  getRPCount(subscriptionId) {
    return `
      SELECT COUNT(r.id) AS rp_count
      FROM subscriptions s
      LEFT JOIN recurring_payments r ON r.subscription_id = s.id AND r.company_id = s.company_id
      WHERE s.subscription_id = '${subscriptionId}'
        AND r.enabled = true
        AND r.deleted_at IS NULL
        AND r.payment_settled = false
        AND r.invoice_id IS NULL
    `;
  }

  /**
   * Verify a recurring payment has been soft-deleted (deleted_at IS NOT NULL)
   * Used to confirm a delete action in Test 1
   * @param {number|string} rpId - The recurring payment ID (id column)
   */
  verifyRPDeleted(rpId) {
    return `
      SELECT id, deleted_at
      FROM public.recurring_payments
      WHERE id = ${rpId}
        AND deleted_at IS NOT NULL
    `;
  }

  /**
   * Verify a recurring payment has been marked as settled (payment_settled = true)
   * Used to confirm a mark as settled action in Test 2
   * @param {number|string} rpId - The recurring payment ID (id column)
   */
  verifyRPSettled(rpId) {
    return `
      SELECT id, payment_settled
      FROM public.recurring_payments
      WHERE id = ${rpId}
        AND payment_settled = true
    `;
  }

  /**
   * Set payment_settled = true for a specific recurring payment (DB setup before Test 3)
   * This makes "Mark as not paid" available in the UI for that RP
   * @param {number|string} rpId - The recurring payment ID (id column)
   */
  setRPSettled(rpId) {
    return `
      UPDATE public.recurring_payments
      SET payment_settled = true
      WHERE id = ${rpId}
    `;
  }

  /**
   * Verify a recurring payment has been marked as not settled (payment_settled = false)
   * Used to confirm a mark as not paid action in Test 3
   * @param {number|string} rpId - The recurring payment ID (id column)
   */
  verifyRPNotSettled(rpId) {
    return `
      SELECT id, payment_settled
      FROM public.recurring_payments
      WHERE id = ${rpId}
        AND payment_settled = false
    `;
  }

  /**
   * Verify a recurring payment has been charged — invoice_id IS NOT NULL
   * Used to confirm a charge action in Test 4
   * @param {number|string} rpId - The recurring payment ID (id column)
   */
  verifyRPInvoiced(rpId) {
    return `
      SELECT id, invoice_id
      FROM public.recurring_payments
      WHERE id = ${rpId}
        AND invoice_id IS NOT NULL
    `;
  }

  /**
   * Fetch the amount for a specific recurring payment
   * Used to verify the amount was updated after Edit recurring payment(s) in Test 5
   * @param {number|string} rpId - The recurring payment ID (id column)
   */
  verifyRPAmount(rpId) {
    return `
      SELECT id, amount
      FROM public.recurring_payments
      WHERE id = ${rpId}
    `;
  }

}

export default new SubscriptionRPQueries();
