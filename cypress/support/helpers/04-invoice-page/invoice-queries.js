/**
 * Invoice List Page Database Queries
 * Contains SQL queries for invoice list page tests.
 *
 * Confirmed DB schema:
 *   invoices."type"          — string, e.g. 'recurring payment' (quoted: reserved word)
 *   invoices.paid            — boolean true/false
 *   invoices.cancelled_invoice_id / original_invoice_id / replaced_invoice_id — int|null
 *   transactions.status      — 'succeeded' | 'settled' (joined via invoice_number + company_id)
 */

class InvoiceQueries {
  // ==================== COUNT QUERIES ====================

  /**
   * Get total invoice count for the company.
   * Used to verify UI pagination total.
   */
  getTotalInvoiceCount() {
    return `
      SELECT COUNT(DISTINCT i.id) AS total
      FROM public.invoices i
      LEFT JOIN general_company_settings gcs ON i.company_id = gcs.uid
      WHERE gcs.name IN ('${Cypress.env('circuly_shopify_stripe')}')
    `;
  }

  /**
   * Get invoice count filtered by a single transaction status.
   * Used to verify UI count after applying one Status filter option.
   * @param {string} status - 'succeeded' | 'settled'
   */
  getInvoiceCountByStatus(status) {
    return `
      SELECT COUNT(DISTINCT i.id) AS total
      FROM public.invoices i
      LEFT JOIN general_company_settings gcs ON i.company_id = gcs.uid
      LEFT JOIN public.transactions t
        ON i.invoice_number = t.invoice_number
        AND i.company_id = t.company_id
      WHERE gcs.name IN ('${Cypress.env('circuly_shopify_stripe')}')
        AND t.status = '${status}'
    `;
  }

  /**
   * Get invoice count filtered by multiple transaction statuses combined.
   * Used to verify UI count when both Succeeded + Settled are selected together.
   * @param {string[]} statuses - e.g. ['succeeded', 'settled']
   */
  getInvoiceCountByStatuses(statuses) {
    const inList = statuses.map((s) => `'${s}'`).join(', ');
    return `
      SELECT COUNT(DISTINCT i.id) AS total
      FROM public.invoices i
      LEFT JOIN general_company_settings gcs ON i.company_id = gcs.uid
      LEFT JOIN public.transactions t
        ON i.invoice_number = t.invoice_number
        AND i.company_id = t.company_id
      WHERE gcs.name IN ('${Cypress.env('circuly_shopify_stripe')}')
        AND t.status IN (${inList})
    `;
  }

  /**
   * Get invoice count filtered by type.
   * NOTE: "type" is a reserved word in PostgreSQL — must be double-quoted.
   * Used to verify UI count after applying the Type filter.
   * @param {string} type - 'recurring payment' (space, not hyphen)
   */
  getInvoiceCountByType(type) {
    return `
      SELECT COUNT(DISTINCT i.id) AS total
      FROM public.invoices i
      LEFT JOIN general_company_settings gcs ON i.company_id = gcs.uid
      WHERE gcs.name IN ('${Cypress.env('circuly_shopify_stripe')}')
        AND i."type" = '${type}'
    `;
  }

  /**
   * Get invoice count filtered by paid boolean.
   * Used to verify UI count after applying the Paid filter.
   * @param {boolean} paid - true | false
   */
  getInvoiceCountByPaymentStatus(paid) {
    return `
      SELECT COUNT(DISTINCT i.id) AS total
      FROM public.invoices i
      LEFT JOIN general_company_settings gcs ON i.company_id = gcs.uid
      WHERE gcs.name IN ('${Cypress.env('circuly_shopify_stripe')}')
        AND i.paid = ${paid}
    `;
  }

  // ==================== INVOICE LOOKUP ====================

  /**
   * Find the first suitable invoice for refund/cancel flow tests.
   * Criteria:
   *   - type = 'recurring payment'
   *   - transaction status = 'succeeded' OR 'settled'
   *   - paid = true
   *   - not cancelled / not a replacement / not replaced
   *   - order: payment_method_token = 'visa', status = 'open', origin = 'checkout'
   *
   * Returns: id, transaction_id, invoice_number, paid, status, type
   */
  getFirstPaidRPInvoiceNoCancelledId() {
    return `
      SELECT i.id, i.transaction_id, i.invoice_number, i.paid, t.status, i."type"
      FROM public.invoices i
      LEFT JOIN general_company_settings gcs ON i.company_id = gcs.uid
      LEFT JOIN public.transactions t
        ON i.invoice_number = t.invoice_number
        AND i.company_id = t.company_id
      LEFT JOIN orders o
        ON o.order_id = t.order_id
        AND o.company_id = t.company_id
      WHERE t.status IN ('succeeded', 'settled')
        AND i."type" IN ('recurring payment')
        AND i.paid = true
        AND i.cancelled_invoice_id IS NULL
        AND i.original_invoice_id IS NULL
        AND i.replaced_invoice_id IS NULL
        AND gcs.name IN ('${Cypress.env('circuly_shopify_stripe')}')
        AND o.payment_method_token = 'visa'
        AND o.status = 'open'
        AND o.origin = 'checkout'
        AND t.transaction_id NOT IN (
          SELECT refunded_transaction_id
          FROM public.transactions
          WHERE refunded_transaction_id IS NOT NULL
        )
      ORDER BY i.created_at DESC
      LIMIT 1
    `;
  }

  /**
   * Find a second suitable invoice (OFFSET 1) for the cancel test (Test 7).
   * Using a different invoice than Test 6 to avoid state conflicts.
   */
  getSecondPaidRPInvoiceNoCancelledId() {
    return `
      SELECT i.id, i.transaction_id, i.invoice_number, i.paid, t.status, i."type"
      FROM public.invoices i
      LEFT JOIN general_company_settings gcs ON i.company_id = gcs.uid
      LEFT JOIN public.transactions t
        ON i.invoice_number = t.invoice_number
        AND i.company_id = t.company_id
      LEFT JOIN orders o
        ON o.order_id = t.order_id
        AND o.company_id = t.company_id
      WHERE t.status IN ('succeeded', 'settled')
        AND i."type" IN ('recurring payment')
        AND i.paid = true
        AND i.cancelled_invoice_id IS NULL
        AND i.original_invoice_id IS NULL
        AND i.replaced_invoice_id IS NULL
        AND gcs.name IN ('${Cypress.env('circuly_shopify_stripe')}')
        AND o.payment_method_token = 'visa'
        AND o.status = 'open'
        AND o.origin = 'checkout'
        AND t.transaction_id NOT IN (
          SELECT refunded_transaction_id
          FROM public.transactions
          WHERE refunded_transaction_id IS NOT NULL
        )
      ORDER BY i.created_at DESC
      LIMIT 1 OFFSET 1
    `;
  }

  /**
   * Get invoice paid status by invoice_number — used for post-action verification.
   * @param {string} invoiceNumber - invoice_number value to look up
   */
  getInvoiceByNumber(invoiceNumber) {
    return `
      SELECT invoice_number, paid
      FROM public.invoices
      WHERE invoice_number = '${invoiceNumber}'
    `;
  }

  /**
   * Get cancelled_invoice_id for a specific invoice by id.
   * Used to verify the cancel action set cancelled_invoice_id to a non-null value.
   * @param {number} invoiceId - invoice.id to look up
   */
  getInvoiceCancelStatus(invoiceId) {
    return `
      SELECT id, cancelled_invoice_id
      FROM public.invoices
      WHERE id = ${invoiceId}
    `;
  }
}

export default new InvoiceQueries();
