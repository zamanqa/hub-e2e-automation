# Database Integration Guide

## Setup

1. Configure database connection in `.env` file
2. Update credentials in `cypress.config.js`
3. Use database helper in tests

## Usage in Tests

### Query Database

```javascript
const db = require('../../support/database/db-helper');

it('should verify customer in database', () => {
  db.getCustomers(5).then((customers) => {
    expect(customers).to.have.length(5);
    // Use customer data in test
  });
});
```

### Create Test Data

```javascript
it('should create customer with DB data', () => {
  const customerData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com'
  };
  
  db.createCustomer(customerData).then(() => {
    // Customer created in DB
    // Now test UI shows this customer
    cy.navigateToCustomers();
    cy.searchCustomer(customerData.email);
    cy.contains(customerData.firstName).should('be.visible');
  });
});
```

### Cleanup Test Data

```javascript
after(() => {
  db.deleteTestCustomers();
});
```

## Database Schema

Expected tables:
- `customers` (id, first_name, last_name, email, platform, is_test_data)
- `products` (id, sku, name, price, stock, platform, is_test_data)
- `orders` (id, order_number, customer_id, total, status, platform, is_test_data)

All test data should have `is_test_data = 1` flag for easy cleanup.
