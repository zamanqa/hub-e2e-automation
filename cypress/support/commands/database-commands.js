/**
 * Custom Database Commands
 * Simple commands for database operations
 */

/**
 * Query PostgreSQL database and return results
 * @param {string} query - SQL query to execute
 * @example cy.queryDatabase('SELECT * FROM orders WHERE id = 123')
 */
Cypress.Commands.add('queryDatabase', (query) => {
  cy.task('queryDb', query).then((results) => {
    cy.log(`✓ Query executed: Found ${results.length} rows`);
    return results;
  });
});

/**
 * Get a single order by ID
 * @param {number} orderId - Order ID to fetch
 * @example cy.getOrderById(123)
 */
Cypress.Commands.add('getOrderById', (orderId) => {
  const query = `SELECT * FROM public.orders WHERE id = ${orderId}`;
  return cy.task('queryDb', query).then((results) => {
    if (results.length > 0) {
      cy.log(`✓ Found order: ${results[0].order_id}`);
      return results[0];
    } else {
      cy.log('⚠ No order found with that ID');
      return null;
    }
  });
});

/**
 * Get all orders for a specific company
 * @param {number} companyId - Company ID
 * @example cy.getOrdersByCompany(456)
 */
Cypress.Commands.add('getOrdersByCompany', (companyId) => {
  const query = `SELECT * FROM public.orders WHERE company_id = ${companyId}`;
  return cy.task('queryDb', query).then((results) => {
    cy.log(`✓ Found ${results.length} orders for company ${companyId}`);
    return results;
  });
});

/**
 * Get orders by status
 * @param {string} status - Order status (e.g., 'completed', 'pending')
 * @example cy.getOrdersByStatus('completed')
 */
Cypress.Commands.add('getOrdersByStatus', (status) => {
  const query = `SELECT * FROM public.orders WHERE status = '${status}'`;
  return cy.task('queryDb', query).then((results) => {
    cy.log(`✓ Found ${results.length} orders with status: ${status}`);
    return results;
  });
});

/**
 * Count total orders in database
 * @example cy.countOrders()
 */
Cypress.Commands.add('countOrders', () => {
  const query = 'SELECT COUNT(*) as total FROM public.orders';
  return cy.task('queryDb', query).then((results) => {
    const total = results[0].total;
    cy.log(`✓ Total orders in database: ${total}`);
    return total;
  });
});

/**
 * Verify order exists in database
 * @param {string} orderId - Order ID to check
 * @example cy.verifyOrderExists('ORDER-123')
 */
Cypress.Commands.add('verifyOrderExists', (orderId) => {
  const query = `SELECT * FROM public.orders WHERE order_id = '${orderId}'`;
  return cy.task('queryDb', query).then((results) => {
    expect(results.length).to.be.greaterThan(0, `Order ${orderId} should exist in database`);
    cy.log(`✓ Order ${orderId} exists in database`);
    return results[0];
  });
});

/**
 * Get recent orders (last N orders)
 * @param {number} limit - Number of orders to fetch
 * @example cy.getRecentOrders(10)
 */
Cypress.Commands.add('getRecentOrders', (limit = 10) => {
  const query = `
    SELECT * FROM public.orders
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return cy.task('queryDb', query).then((results) => {
    cy.log(`✓ Retrieved ${results.length} recent orders`);
    return results;
  });
});
