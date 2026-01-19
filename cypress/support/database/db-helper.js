class DatabaseHelper {
  
  query(sql, params = []) {
    return cy.task('queryDatabase', { sql, params });
  }

  execute(sql, params = []) {
    return cy.task('executeQuery', { sql, params });
  }

  // Customer queries
  getCustomers(limit = 10) {
    return this.query(
      'SELECT * FROM customers WHERE platform = ? AND is_test_data = 1 LIMIT ?',
      ['shopify', limit]
    );
  }

  createCustomer(customerData) {
    const sql = `
      INSERT INTO customers (first_name, last_name, email, platform, is_test_data, created_at)
      VALUES (?, ?, ?, ?, 1, NOW())
    `;
    return this.execute(sql, [
      customerData.firstName,
      customerData.lastName,
      customerData.email,
      'shopify'
    ]);
  }

  deleteTestCustomers() {
    return this.execute(
      'DELETE FROM customers WHERE is_test_data = 1 AND platform = ?',
      ['shopify']
    );
  }

  // Product queries
  getProducts(limit = 10) {
    return this.query(
      'SELECT * FROM products WHERE platform = ? AND is_test_data = 1 LIMIT ?',
      ['shopify', limit]
    );
  }

  // Order queries
  getOrders(limit = 10) {
    return this.query(
      'SELECT * FROM orders WHERE platform = ? AND is_test_data = 1 LIMIT ?',
      ['shopify', limit]
    );
  }
}

module.exports = new DatabaseHelper();
