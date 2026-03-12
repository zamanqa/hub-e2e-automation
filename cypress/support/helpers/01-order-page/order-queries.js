/**
 * Order Database Queries
 * Contains SQL queries for order-related database operations
 */

class OrderQueries {
  /**
   * Get all orders for the configured company
   * Returns orders sorted by created_at descending
   */
  getAllOrdersForCompany() {
    const companyName = Cypress.env('circuly_shopify_stripe');
    return `
      SELECT
        o.order_id,
        o.company_id,
        o.payment_provider,
        o.payment_method_token,
        o.status,
        o.transaction_id,
        o.payment_status,
        o.origin,
        o.shipping_method,
        o.subscription_type,
        o.replace_order_id,
        o.parent_id,
        o.order_customer_id
      FROM orders o
      LEFT JOIN general_company_settings gcs ON o.company_id = gcs.uid
      WHERE gcs.name IN ('${companyName}')
      ORDER BY o.created_at DESC
      LIMIT 1
    `;
  }

  /**
   * Get the 2nd order without subscription
   * Filters by:
   * - Company: from environment variable
   * - No subscription (not in subscriptions table)
   * - Payment provider: 'stripe'
   * - Payment method: 'visa'
   * - Status: 'open'
   */
  getFifthOrderWithoutSubscription() {
    const companyName = Cypress.env('circuly_shopify_stripe');
    return `
      SELECT
        o.order_id,
        o.company_id,
        o.payment_provider,
        o.payment_method_token,
        o.status,
        o.transaction_id,
        o.payment_status,
        o.origin,
        o.shipping_method,
        o.subscription_type,
        o.replace_order_id,
        o.parent_id,
        o.order_customer_id
      FROM orders o
      LEFT JOIN general_company_settings gcs ON o.company_id = gcs.uid
      LEFT JOIN subscriptions s ON o.order_id = s.order_id AND o.company_id = s.company_id
      WHERE gcs.name IN ('${companyName}')
        AND s.order_id IS NULL
        AND o.payment_provider = 'stripe'
        AND o.payment_method_token = 'visa'
        AND o.status = 'open'
        AND o.origin = 'checkout'
      ORDER BY o.created_at DESC
      LIMIT 1 OFFSET 1
    `;
  }

  /**
   * Get total count of orders for the configured company
   */
  getOrderCountForCompany() {
    const companyName = Cypress.env('circuly_shopify_stripe');
    return `
      SELECT COUNT(*) as total_orders
      FROM orders o
      LEFT JOIN general_company_settings gcs ON o.company_id = gcs.uid
      WHERE gcs.name IN ('${companyName}')
    `;
  }
}

export default new OrderQueries();
