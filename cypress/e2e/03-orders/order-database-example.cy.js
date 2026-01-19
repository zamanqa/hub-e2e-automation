/**
 * Example: Using Database Custom Commands
 * Simple examples for QA Engineers
 */

describe('Order Database Tests - Examples', () => {

  it('Example 1: Get recent orders', () => {
    // Get last 5 orders from database
    cy.getRecentOrders(5).then((orders) => {
      // Check we got results
      expect(orders).to.have.length.greaterThan(0);

      // Log first order details
      cy.log('First Order ID:', orders[0].order_id);
      cy.log('Order Status:', orders[0].status);
    });
  });

  it('Example 2: Count total orders', () => {
    // Count all orders in database
    cy.countOrders().then((total) => {
      // Verify we have orders
      expect(total).to.be.greaterThan(0);
      cy.log(`Database has ${total} orders`);
    });
  });

  it('Example 3: Get orders by status', () => {
    // Get all completed orders
    cy.getOrdersByStatus('completed').then((orders) => {
      cy.log(`Found ${orders.length} completed orders`);

      // If we have orders, check first one
      if (orders.length > 0) {
        expect(orders[0].status).to.equal('completed');
      }
    });
  });

  it('Example 4: Verify specific order exists', () => {
    // First, get a recent order
    cy.getRecentOrders(1).then((orders) => {
      if (orders.length > 0) {
        const orderId = orders[0].order_id;

        // Verify it exists in database
        cy.verifyOrderExists(orderId).then((order) => {
          expect(order.order_id).to.equal(orderId);
          cy.log('✓ Order verified successfully');
        });
      }
    });
  });

  it('Example 5: Get order by ID', () => {
    // Get order with specific ID
    cy.getOrderById(1).then((order) => {
      if (order) {
        cy.log('Order found:', order.order_id);
        expect(order.id).to.equal(1);
      } else {
        cy.log('No order found with ID 1');
      }
    });
  });

  it('Example 6: Get orders for a company', () => {
    // Get all orders for company ID 1
    cy.getOrdersByCompany(1).then((orders) => {
      cy.log(`Company 1 has ${orders.length} orders`);

      // Verify all orders belong to company 1
      orders.forEach((order) => {
        expect(order.company_id).to.equal(1);
      });
    });
  });

  it('Example 7: Custom database query', () => {
    // Run your own SQL query
    const query = `
      SELECT status, COUNT(*) as count
      FROM public.orders
      GROUP BY status
    `;

    cy.queryDatabase(query).then((results) => {
      cy.log('Order counts by status:');
      results.forEach((row) => {
        cy.log(`${row.status}: ${row.count} orders`);
      });
    });
  });

  it('Example 8: Check order has required fields', () => {
    // Get a recent order and verify it has all fields
    cy.getRecentOrders(1).then((orders) => {
      if (orders.length > 0) {
        const order = orders[0];

        // Verify required fields exist
        expect(order).to.have.property('id');
        expect(order).to.have.property('order_id');
        expect(order).to.have.property('status');
        expect(order).to.have.property('amount');
        expect(order).to.have.property('currency');
        expect(order).to.have.property('created_at');

        cy.log('✓ All required fields present');
      }
    });
  });
});
