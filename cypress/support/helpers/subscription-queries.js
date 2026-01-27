/**
 * Subscription Database Queries
 * Contains SQL queries for subscription-related database operations
 */

class SubscriptionQueries {
  /**
   * Verify subscription exists by subscription_id
   * @param {string} subscriptionId - The subscription ID to verify
   */
  getSubscriptionById(subscriptionId) {
    return `
      SELECT
        id,
        order_id,
        subscription_id,
        serial_number,
        subscription_status,
        subscription_start,
        subscription_end,
        company_id,
        subscription_price,
        subscription_duration,
        subscription_frequency,
        status,
        customer_id,
        subscription_type,
        subscription_frequency_interval,
        is_bundle,
        subscription_extension_price
      FROM public.subscriptions
      WHERE subscription_id = '${subscriptionId}'
    `;
  }

  /**
   * Check if subscription has recurring payments enabled
   * @param {string} subscriptionId - The subscription ID to check
   */
  hasRecurringPayments(subscriptionId) {
    return `
      SELECT *
      FROM public.recurring_payments
      WHERE subscription_id = '${subscriptionId}'
        AND deleted_at IS NULL
        AND invoice_id IS NULL
        AND cumulated_invoice_id IS NULL
        AND payment_settled = false
        AND enabled = true
        AND failed = false
    `;
  }

  /**
   * Get all subscriptions for an order
   * @param {string} orderId - The order ID
   */
  getSubscriptionsByOrderId(orderId) {
    return `
      SELECT
        id,
        order_id,
        subscription_id,
        serial_number,
        subscription_status,
        subscription_type,
        status
      FROM public.subscriptions
      WHERE order_id = '${orderId}'
      ORDER BY created_at DESC
    `;
  }
}

export default new SubscriptionQueries();
