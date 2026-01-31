/**
 * Order Workflow Database Queries
 * Contains SQL queries for order management workflow operations
 */

class OrderWorkflowQueries {
  /**
   * Get order for order management workflow tests
   * Filters by:
   * - Company: from environment variable
   * - Status: 'open'
   * - Payment provider: 'stripe'
   * - Payment method: 'visa'
   * - Transaction ID: NULL
   * - Payment status: 'payment_required'
   * - Origin: 'cms'
   * Returns first matching order
   */
  getOrderForWorkflowTests() {
    const companyName = Cypress.env('circuly_shopify_stripe');
    return `
      SELECT
        o.order_id,
        o.amount,
        o.status,
        o.transaction_id,
        o.company_id
      FROM orders o
      LEFT JOIN general_company_settings gcs ON o.company_id = gcs.uid
      WHERE gcs.name IN ('${companyName}')
        AND o.status IN ('open')
        AND o.payment_provider IN ('stripe')
        AND o.payment_method_token IN ('visa')
        AND o.transaction_id IS NULL
        AND o.payment_status IN ('payment_required')
        AND o.origin IN ('cms')
      ORDER BY o.created_at DESC
      LIMIT 1
    `;
  }

  /**
   * Verify order transaction ID is populated
   * @param {string} orderId - The order ID to check
   */
  verifyTransactionId(orderId) {
    return `
      SELECT
        order_id,
        transaction_id,
        payment_status,
        status
      FROM orders
      WHERE order_id = '${orderId}'
        AND transaction_id IS NOT NULL
    `;
  }

  /**
   * Verify order status
   * @param {string} orderId - The order ID to check
   * @param {string} expectedStatus - Expected order status
   */
  verifyOrderStatus(orderId, expectedStatus) {
    return `
      SELECT
        order_id,
        status,
        payment_status
      FROM orders
      WHERE order_id = '${orderId}'
        AND status = '${expectedStatus}'
    `;
  }

  /**
   * Get order details including customer information
   * @param {string} orderId - The order ID
   */
  getOrderDetails(orderId) {
    return `
      SELECT
        o.order_id,
        o.amount,
        o.status,
        o.transaction_id,
        o.payment_status,
        o.company_id,
        o.order_customer_id
      FROM orders o
      WHERE o.order_id = '${orderId}'
    `;
  }
}

export default new OrderWorkflowQueries();
