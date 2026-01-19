# Custom Commands Quick Reference

## 📚 For QA Engineers - Beginner to Intermediate Level

This guide shows you how to use custom commands in your Cypress tests. Custom commands make your tests cleaner and easier to write!

---

## 🗃️ Database Commands

### 1. Get Recent Orders
Get the last N orders from the database.

```javascript
cy.getRecentOrders(10).then((orders) => {
  // You now have the last 10 orders
  cy.log('First order:', orders[0].order_id);
});
```

### 2. Count Total Orders
Count how many orders are in the database.

```javascript
cy.countOrders().then((total) => {
  cy.log(`Total orders: ${total}`);
  expect(total).to.be.greaterThan(0);
});
```

### 3. Get Order by ID
Find a specific order by its database ID.

```javascript
cy.getOrderById(123).then((order) => {
  if (order) {
    cy.log('Found order:', order.order_id);
  } else {
    cy.log('Order not found');
  }
});
```

### 4. Get Orders by Status
Find all orders with a specific status.

```javascript
cy.getOrdersByStatus('completed').then((orders) => {
  cy.log(`Found ${orders.length} completed orders`);
});
```

Common statuses: `'completed'`, `'pending'`, `'cancelled'`, `'processing'`

### 5. Get Orders by Company
Find all orders for a specific company.

```javascript
cy.getOrdersByCompany(456).then((orders) => {
  cy.log(`Company 456 has ${orders.length} orders`);
});
```

### 6. Verify Order Exists
Check if an order exists in the database (with automatic assertion).

```javascript
cy.verifyOrderExists('ORDER-123').then((order) => {
  cy.log('Order exists and verified!');
});
```

### 7. Custom Query
Run any SQL query you want.

```javascript
const query = 'SELECT * FROM orders WHERE amount > 100';
cy.queryDatabase(query).then((results) => {
  cy.log(`Found ${results.length} orders over $100`);
});
```

---

## 📝 Complete Test Example

Here's a simple, real-world test:

```javascript
describe('Order Verification Tests', () => {

  it('should verify new orders are in database', () => {
    // Step 1: Count orders before
    cy.countOrders().then((beforeCount) => {
      cy.log('Orders before:', beforeCount);

      // Step 2: Create order on website (your UI test)
      // cy.visit('/create-order')
      // cy.createNewOrder() // your custom command

      // Step 3: Count orders after
      cy.countOrders().then((afterCount) => {
        // Verify count increased
        expect(afterCount).to.equal(beforeCount + 1);
        cy.log('✓ New order added to database');
      });
    });
  });

  it('should verify order has correct status', () => {
    // Get recent order
    cy.getRecentOrders(1).then((orders) => {
      const order = orders[0];

      // Check status is valid
      const validStatuses = ['pending', 'completed', 'processing', 'cancelled'];
      expect(validStatuses).to.include(order.status);

      cy.log(`Order ${order.order_id} has status: ${order.status}`);
    });
  });

  it('should verify completed orders have amounts', () => {
    // Get completed orders
    cy.getOrdersByStatus('completed').then((orders) => {
      // Check each order has an amount
      orders.forEach((order) => {
        expect(order.amount).to.exist;
        expect(order.amount).to.be.greaterThan(0);
      });

      cy.log(`✓ All ${orders.length} completed orders have valid amounts`);
    });
  });
});
```

---

## 🎯 Common Testing Patterns

### Pattern 1: Before/After Comparison
```javascript
it('test something changes in database', () => {
  // Get initial state
  cy.countOrders().then((before) => {

    // Do something (create, update, delete)
    // ... your test actions ...

    // Check new state
    cy.countOrders().then((after) => {
      expect(after).to.not.equal(before);
    });
  });
});
```

### Pattern 2: Verify Data Exists
```javascript
it('verify order was created', () => {
  const orderId = 'ORDER-123';

  cy.verifyOrderExists(orderId).then((order) => {
    expect(order.status).to.equal('completed');
    expect(order.amount).to.equal(99.99);
  });
});
```

### Pattern 3: Check Multiple Records
```javascript
it('verify all company orders', () => {
  cy.getOrdersByCompany(1).then((orders) => {
    // Verify all orders
    orders.forEach((order) => {
      expect(order.company_id).to.equal(1);
      expect(order.amount).to.be.greaterThan(0);
    });
  });
});
```

---

## 🚀 Tips for Clean Tests

### ✅ DO:
```javascript
// Simple and clear
cy.getRecentOrders(5).then((orders) => {
  expect(orders.length).to.equal(5);
});
```

### ❌ DON'T:
```javascript
// Too complex
cy.task('queryDb', 'SELECT * FROM orders ORDER BY created_at DESC LIMIT 5')
  .then((results) => {
    // Harder to read
  });
```

### ✅ DO:
```javascript
// Use descriptive test names
it('should verify completed orders have payment info', () => {
  // ...
});
```

### ❌ DON'T:
```javascript
// Vague test name
it('test orders', () => {
  // What are we testing?
});
```

---

## 📖 Available Custom Commands

### Database Commands (`database-commands.js`)
- ✅ `cy.queryDatabase(query)` - Run any SQL query
- ✅ `cy.getOrderById(id)` - Get specific order
- ✅ `cy.getOrdersByCompany(companyId)` - Get company orders
- ✅ `cy.getOrdersByStatus(status)` - Get orders by status
- ✅ `cy.countOrders()` - Count all orders
- ✅ `cy.verifyOrderExists(orderId)` - Check order exists
- ✅ `cy.getRecentOrders(limit)` - Get recent orders

### Customer Commands (`customer-commands.js`)
- Check the file for available customer commands

### Product Commands (`product-commands.js`)
- Check the file for available product commands

### Order Commands (`order-commands.js`)
- Check the file for available order commands

---

## 🆘 Need Help?

1. **See examples**: Check `cypress/e2e/03-orders/order-database-example.cy.js`
2. **Read command code**: Look in `cypress/support/commands/`
3. **Ask Claude**: Use `@cypress-test-helper` for help
4. **Run examples**:
   ```bash
   npx cypress run --spec "cypress/e2e/03-orders/order-database-example.cy.js"
   ```

---

## 🎓 Learning Path

**Beginner:**
1. Start with `cy.getRecentOrders()`
2. Try `cy.countOrders()`
3. Use `cy.getOrdersByStatus()`

**Intermediate:**
1. Use `cy.verifyOrderExists()`
2. Combine commands in tests
3. Write custom queries with `cy.queryDatabase()`

**Advanced:**
1. Create your own custom commands
2. Chain multiple database checks
3. Create complex test scenarios

---

Keep your tests simple, clean, and easy to understand! 🎯
