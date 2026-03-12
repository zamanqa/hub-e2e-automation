/**
 * Return & Repair Workflow Database Queries
 * Contains SQL queries for the return and repair workflow tests.
 *
 * Confirmed DB schema:
 *   subscriptions.serial_number     — nullable string
 *   subscriptions.subscription_type — 'normal' | ...
 *   subscriptions.status            — 'active' | ...
 *   subscriptions.subscription_duration — integer (months)
 *   product_trackings.location_status  — 'to repair' | 'in stock' | ...
 */

class ReturnRepairQueries {

  // ==================== SUBSCRIPTION LOOKUP ====================

  /**
   * Find a suitable serial number to drive the full return + repair flow.
   * Criteria:
   *   - active, normal subscription with a non-null serial_number
   *   - order paid via stripe / visa / open / checkout
   *   - subscription_duration > 5 (months) — ensures meaningful history
   *   - OFFSET 1 — avoids the most-recently-modified record
   *
   * Returns: serial_number
   */
  getSerialNumberForReturn() {
    return `
      SELECT
        s.serial_number
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
        AND s.serial_number IS NOT NULL
        AND s.subscription_duration > 5
        AND s.serial_number not in ('no-serial-number-found')
      ORDER BY s.created_at DESC
      LIMIT 1 OFFSET 1
    `;
  }

  // ==================== PRODUCT TRACKING VERIFICATION ====================

  /**
   * Get the latest product tracking record for a given serial number.
   * Used to verify location_status after a return or repair action.
   *
   * Expected values:
   *   - 'to repair'  — immediately after "Mark as returned"
   *   - 'in stock'   — after repair is submitted and completed
   *
   * @param {string} serialNumber — the serial_number value from subscriptions
   */
  getProductTrackingBySerialNumber(serialNumber) {
    return `
      SELECT id, serial_number, location_status
      FROM public.product_trackings
      WHERE serial_number = '${serialNumber}'
      ORDER BY created_at DESC
      LIMIT 1
    `;
  }
}

export default new ReturnRepairQueries();
