/**
 * Subscription Workflow Database Queries
 * Contains SQL queries for subscription workflow test operations
 */

class SubscriptionWorkflowQueries {
  /**
   * Get an active subscription for workflow tests
   * Filters by:
   * - Company: from Cypress.env('circuly_shopify_stripe')
   * - Payment provider: stripe
   * - Payment method: visa
   * - Order status: open
   * - Order origin: checkout
   * - Subscription type: normal
   * - Subscription status: active
   * - Subscription duration: > 5
   */
  getActiveSubscriptionForTests() {
    return `
      SELECT
        s.subscription_id
      FROM subscriptions s
      LEFT JOIN orders o ON o.order_id = s.order_id AND o.company_id = s.company_id
      LEFT JOIN general_company_settings gcs ON o.company_id = gcs.uid
      WHERE gcs.name IN ('${Cypress.env('circuly_shopify_stripe')}')
        AND o.payment_provider = 'stripe'
        AND o.payment_method_token = 'visa'
        AND o.status = 'open'
        AND o.origin = 'checkout'
        AND s.subscription_type IN ('normal')
        AND s.status IN ('active')
        AND s.subscription_duration > 3
        AND s.subscription_id NOT IN (SELECT parent_id FROM subscriptions WHERE parent_id IS NOT NULL)
      ORDER BY s.created_at DESC
      LIMIT 1 OFFSET 1
    `;
  }

  /**
   * Verify subscription status in database
   * @param {string} subscriptionId - The subscription ID to check
   * @param {string} expectedStatus - Expected subscription status
   */
  verifySubscriptionStatus(subscriptionId, expectedStatus) {
    return `
      SELECT
        subscription_id,
        status
      FROM subscriptions
      WHERE subscription_id = '${subscriptionId}'
        AND status = '${expectedStatus}'
    `;
  }

  /**
   * Verify subscription status is bought out or pending buyout after buyout action
   * @param {string} subscriptionId - The subscription ID to check
   */
  verifyBuyoutStatus(subscriptionId) {
    return `
      SELECT
        subscription_id,
        status
      FROM subscriptions
      WHERE subscription_id = '${subscriptionId}'
        AND status IN ('bought out', 'pending buyout')
    `;
  }

  /**
   * Set subscription_type to 'consumable' and quantity to 2 — DB setup before Change Quantity test
   * @param {string} subscriptionId - The subscription ID to update
   */
  setupSubscriptionForQuantityTest(subscriptionId) {
    return `
      UPDATE subscriptions
      SET subscription_type = 'consumable', quantity = 2
      WHERE subscription_id = '${subscriptionId}'
    `;
  }

  /**
   * Revert subscription_type back to 'normal' — DB cleanup after Change Quantity test
   * @param {string} subscriptionId - The subscription ID to revert
   */
  revertSubscriptionAfterQuantityTest(subscriptionId) {
    return `
      UPDATE subscriptions
      SET subscription_type = 'normal', quantity = 2
      WHERE subscription_id = '${subscriptionId}'
    `;
  }

  /**
   * Verify subscription quantity in database after Change Quantity action
   * @param {string} subscriptionId - The subscription ID to check
   * @param {number|string} expectedQty - Expected quantity value
   */
  verifySubscriptionQuantity(subscriptionId, expectedQty) {
    return `
      SELECT
        subscription_id,
        quantity
      FROM subscriptions
      WHERE subscription_id = '${subscriptionId}'
        AND quantity = ${expectedQty}
    `;
  }

  /**
   * Get the current subscription_frequency_interval from DB
   * @param {string} subscriptionId - The subscription ID
   */
  getCurrentBillingFrequencyInterval(subscriptionId) {
    return `
      SELECT
        subscription_id,
        subscription_frequency_interval
      FROM subscriptions
      WHERE subscription_id = '${subscriptionId}'
    `;
  }

  /**
   * Verify subscription_frequency_interval value in database after billing frequency update
   * @param {string} subscriptionId - The subscription ID to check
   * @param {number|string} expectedInterval - Expected interval value (e.g. 1 or 2)
   */
  verifyBillingFrequencyInterval(subscriptionId, expectedInterval) {
    return `
      SELECT
        subscription_id,
        subscription_frequency_interval
      FROM subscriptions
      WHERE subscription_id = '${subscriptionId}'
        AND subscription_frequency_interval = ${expectedInterval}
    `;
  }

  /**
   * Get current subscription_duration and subscription_price for the Change Attributes test
   * @param {string} subscriptionId - The subscription ID
   */
  getSubscriptionAttributesForTest(subscriptionId) {
    return `
      SELECT
        subscription_id,
        subscription_duration,
        subscription_price
      FROM subscriptions
      WHERE subscription_id = '${subscriptionId}'
    `;
  }

  /**
   * Verify subscription_duration and subscription_price in DB after Change Attributes action
   * @param {string} subscriptionId - The subscription ID to check
   * @param {number|string} expectedDuration - Expected subscription duration value
   * @param {number|string} expectedPrice - Expected subscription installment unit price
   */
  verifySubscriptionAttributes(subscriptionId, expectedDuration, expectedPrice) {
    return `
      SELECT
        subscription_id,
        subscription_duration,
        subscription_price
      FROM subscriptions
      WHERE subscription_id = '${subscriptionId}'
        AND subscription_duration = ${expectedDuration}
        AND subscription_price = ${expectedPrice}
    `;
  }

  /**
   * Revert subscription_duration and subscription_price after Change Attributes test
   * @param {string} subscriptionId - The subscription ID to revert
   * @param {number|string} originalDuration - Original duration to restore
   * @param {number|string} originalPrice - Original price to restore
   */
  revertSubscriptionAttributes(subscriptionId, originalDuration, originalPrice) {
    return `
      UPDATE subscriptions
      SET subscription_duration = ${originalDuration}, subscription_price = ${originalPrice}
      WHERE subscription_id = '${subscriptionId}'
    `;
  }

  /**
   * Set subscription_type to 'digital' — DB setup before Set as Ended test
   * @param {string} subscriptionId - The subscription ID to update
   */
  setSubscriptionTypeToDigital(subscriptionId) {
    return `
      UPDATE subscriptions
      SET subscription_type = 'digital'
      WHERE subscription_id = '${subscriptionId}'
    `;
  }

  /**
   * Set subscription status to 'pending return' — DB setup before Reactivate test
   * @param {string} subscriptionId - The subscription ID to update
   */
  setSubscriptionStatusToPendingReturn(subscriptionId) {
    return `
      UPDATE subscriptions
      SET status = 'pending return'
      WHERE subscription_id = '${subscriptionId}'
    `;
  }

  /**
   * Get subscription details for assertions
   * @param {string} subscriptionId - The subscription ID
   */
  getSubscriptionDetails(subscriptionId) {
    return `
      SELECT
        subscription_id,
        status,
        serial_number,
        subscription_extension_price,
        subscription_frequency,
        subscription_frequency_interval,
        subscription_end
      FROM subscriptions
      WHERE subscription_id = '${subscriptionId}'
    `;
  }

  /**
   * Get total subscription count for the company — used to verify UI pagination total in Test 1
   * Counts ALL subscriptions for the company regardless of status
   */
  getTotalSubscriptionCount() {
    return `
      SELECT COUNT(*) AS total
      FROM public.subscriptions s
      LEFT JOIN general_company_settings gcs ON s.company_id = gcs.uid
      WHERE gcs.name IN ('${Cypress.env('circuly_shopify_stripe')}')
    `;
  }

  /**
   * Get subscription count filtered by status for the company
   * Used to verify UI pagination total after applying a Status filter
   * @param {string} status - DB status value e.g. 'active', 'cancelled', 'paused'
   */
  getSubscriptionCountByStatus(status) {
    return `
      SELECT COUNT(*) AS total
      FROM public.subscriptions s
      LEFT JOIN general_company_settings gcs ON s.company_id = gcs.uid
      WHERE gcs.name IN ('${Cypress.env('circuly_shopify_stripe')}')
        AND s.status = '${status}'
    `;
  }

  /**
   * Get subscription count filtered by subscription_type for the company
   * Used to verify UI pagination total after applying a Type filter
   * @param {string} type - DB subscription_type value e.g. 'consumable', 'normal', 'digital'
   */
  getSubscriptionCountByType(type) {
    return `
      SELECT COUNT(*) AS total
      FROM public.subscriptions s
      LEFT JOIN general_company_settings gcs ON s.company_id = gcs.uid
      WHERE gcs.name IN ('${Cypress.env('circuly_shopify_stripe')}')
        AND s.subscription_type = '${type}'
    `;
  }

  /**
   * Get recurring payments count for a subscription
   * @param {string} subscriptionId - The subscription ID
   */
  getRecurringPaymentsCount(subscriptionId) {
    return `
      SELECT COUNT(*) as count
      FROM recurring_payments
      WHERE subscription_id = '${subscriptionId}'
        AND deleted_at IS NULL
    `;
  }
}

export default new SubscriptionWorkflowQueries();
