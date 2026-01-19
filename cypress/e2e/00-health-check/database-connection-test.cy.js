describe('Database Connection Test', () => {
  it('should connect to PostgreSQL and query orders table', () => {
    const query = `
      SELECT id, order_id, discount, shipping_amount, tax_amount, tax_percent,
             amount, currency, payment_provider, payment_method_token,
             total_item_count, status, history, order_customer_id,
             transaction_id, psp_object, company_id, created_at, updated_at,
             tag, tag_date, "name", replace_order_id, payment_status,
             cancellation_reason, swap_reason, meta, parent_id,
             cancellation_date, tracking_numbers, utm_source, origin,
             shipping_method, referral_successful, draft_order_id,
             subscription_type, checkboxes, completed, retailer_id, auto_sync
      FROM public.orders
      LIMIT 10;
    `;

    cy.task('queryDb', query).then((rows) => {
      cy.log('✓ Database connection successful!');
      cy.log('Number of rows returned:', rows.length);

      // Log sample data
      if (rows.length > 0) {
        cy.log('Sample order:', JSON.stringify(rows[0], null, 2));
      }

      // Assertions
      expect(rows).to.be.an('array');
      cy.log(`Retrieved ${rows.length} orders from database`);
    });
  });

  it('should verify database connection details', () => {
    cy.log('PostgreSQL Configuration:');
    cy.log('Host:', Cypress.env('pg_host'));
    cy.log('Database:', Cypress.env('pg_database'));
    cy.log('Port:', Cypress.env('pg_port'));
    cy.log('User:', Cypress.env('pg_user'));

    expect(Cypress.env('pg_host')).to.exist;
    expect(Cypress.env('pg_database')).to.exist;
  });
});
