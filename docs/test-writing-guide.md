# Test Writing Guide

## Overview

This guide documents the established patterns and best practices for writing Cypress E2E tests in this project. Follow these conventions to maintain consistency and ensure all tests work reliably.

---

## Table of Contents

1. [Page Object Model Structure](#page-object-model-structure)
2. [Selector Patterns (Headless UI)](#selector-patterns-headless-ui)
3. [Action Method Patterns](#action-method-patterns)
4. [Test File Structure](#test-file-structure)
5. [Database Query Helpers](#database-query-helpers)
6. [Verification Patterns](#verification-patterns)
7. [Special Techniques](#special-techniques)
8. [Complete Example](#complete-example)

---

## Page Object Model Structure

### Class-based Singleton Pattern

All page objects follow this structure with **selector-action pairing**:

**IMPORTANT**: Each selector should be immediately followed by its related action(s). This makes the code easier to read and maintain.

```javascript
/**
 * [Page Name] Page Object
 * Contains selectors and actions for the [Page Name] page
 */

class PageName {
  // ==================== SECTION NAME ====================

  // Selector
  get elementName() {
    return cy.get('selector');
  }

  // Action
  methodName() {
    this.waitForElement(this.elementName, 5000);
    this.elementName.click();
    cy.wait(2000);
    cy.log('✓ Verified: Action completed');
  }

  // Selector (another element)
  get anotherElement() {
    return cy.get('another-selector');
  }

  // Action (for anotherElement)
  anotherMethod() {
    this.anotherElement.type('text');
    cy.log('✓ Verified: Another action completed');
  }

  // ==================== HELPER METHODS ====================

  waitForElement(element, maxWait = 5000) {
    return element.should('be.visible', { timeout: maxWait });
  }
}

export default new PageName();
```

### Section Organization

Organize page objects with clear comment headers:

```javascript
// ==================== NAVIGATION ====================
// ==================== SEARCH ====================
// ==================== FILTERS ====================
// ==================== TABS ====================
// ==================== PAGINATION ====================
// ==================== TABLE CHECKBOXES ====================
// ==================== ACTION BUTTONS ====================
// ==================== TABLE VERIFICATION ====================
// ==================== URL VERIFICATION ====================
// ==================== HELPER METHODS ====================
```

---

## Selector Patterns (Headless UI)

### Filter Buttons

```javascript
get statusFilter() {
  return cy.get('button[aria-haspopup="listbox"]').contains('Status');
}

get paymentStatusFilter() {
  return cy.get('button[aria-haspopup="listbox"]').contains('Payment status');
}
```

### Dropdown Options

```javascript
selectStatusFilter(status) {
  this.waitForElement(this.statusFilter, 5000);
  this.statusFilter.click();
  cy.wait(1000);

  // Wait for dropdown to be visible and find the matching option
  cy.get('div[role="listbox"][aria-labelledby]').should('be.visible');
  cy.get('div[role="listbox"] div[role="option"]').each(($option) => {
    const optionText = $option.find('span.block').text().trim();
    if (optionText.toLowerCase() === status.toLowerCase()) {
      cy.wrap($option).click();
      return false; // break the loop
    }
  });

  cy.wait(2000);
  cy.log(`✓ Verified: Selected status filter: ${status}`);
}
```

### Search Input

```javascript
get searchInput() {
  return cy.get('.flex.flex-col.space-y-1.w-64').find('input[type="text"]').eq(0);
}

searchByOrderId(orderId) {
  this.waitForElement(this.searchInput, 3000);
  this.searchInput.click({ multiple: true });
  this.searchInput.type(orderId);
  cy.wait(2000);
  cy.log(`✓ Verified: Searched for order ID: ${orderId}`);
}
```

### Tabs (Links)

```javascript
get draftTab() {
  return cy.get('a').contains('Draft');
}

clickDraftTab() {
  this.waitForElement(this.draftTab, 5000);
  this.draftTab.click();
  cy.wait(2000);
  cy.url().should('include', 'draft');
  cy.log('✓ Verified: Clicked Draft tab');
}
```

### Pagination with data-testid

```javascript
get paginationText() {
  return cy.get('span[data-testid="from-to-of-total"]');
}

get firstPageButton() {
  return cy.get('button[data-testid="btn-go-to-first"]');
}

get previousPageButton() {
  return cy.get('button[data-testid="btn-prev-page"]');
}

get nextPageButton() {
  return cy.get('button[data-testid="btn-next-page"]');
}

get lastPageButton() {
  return cy.get('button[data-testid="btn-go-to-last"]');
}
```

### Action Buttons

```javascript
get exportButton() {
  return cy.contains('span', 'Export');
}

get markFulfilledButton() {
  return cy.get('button').contains('Mark fulfilled').first();
}
```

### Modal Buttons

```javascript
clickExport() {
  // Wait for the first "Export" button and click it
  this.waitForElement(this.exportButton, 5000);
  this.exportButton.click();

  // Wait for the second "Export" button inside the modal and click it
  cy.get('button[data-cy="btn-submit"]').click();
  cy.log('✓ Verified: Clicked Export button in the modal');
  cy.wait(2000)

  // Verify that the success message appears
  cy.contains('p', 'Successfully requested!').should('be.visible');
  cy.log('✓ Verified: Successfully requested message is displayed');

  // Click the "Close" button in the modal
  cy.get('button[data-cy="btn-close"]').click();
  cy.log('✓ Verified: Clicked Close button');
}
```

---

## Action Method Patterns

### Standard Action Method

Every action method should follow this pattern:

```javascript
methodName() {
  // 1. Wait for element to be visible
  this.waitForElement(this.elementName, 5000);

  // 2. Perform action
  this.elementName.click();

  // 3. Wait for stability
  cy.wait(2000);

  // 4. Log completion
  cy.log('✓ Verified: Action completed');
}
```

### Checkbox Selection

**IMPORTANT**: Use `.check({ force: true })` instead of `.click({ force: true })`

```javascript
selectOrderByOrderId(orderId) {
  // Find the row containing the order ID and click its checkbox
  cy.get('tbody tr')
    .contains(orderId)  // Find the cell containing the orderId
    .parents('tr')  // Move up to the parent row
    .find('input[type="checkbox"]')  // Find the checkbox input within the row
    .check({ force: true });  // Use .check() to ensure the checkbox is checked

  cy.wait(1000);
  cy.log(`✓ Verified: Selected order with ID: ${orderId}`);
}
```

### Multiple Actions with Modal

```javascript
clickMarkFulfilled() {
  // Wait for the "Mark Fulfilled" button and click it
  this.waitForElement(this.markFulfilledButton, 5000);
  this.markFulfilledButton.click();

  // Wait for the "Submit" button inside the modal and click it
  cy.get('button[data-cy="btn-submit"]').click();
  cy.wait(3000)
  cy.log('✓ Verified: Clicked Submit button');

  // Verify that the success message appears
  cy.contains('p', 'Successfully requested!').should('be.visible');
  cy.wait(2000)
  cy.log('✓ Verified: Successfully requested message is displayed');

  // Click the "Close" button in the modal
  cy.get('button[data-cy="btn-close"]').click();
  cy.log('✓ Verified: Clicked Close button');
}
```

---

## Test File Structure

### Import Statements

```javascript
import PageObjectName from '../../support/page-objects/PageObjectName';
import QueryHelper from '../../support/helpers/query-helper';
```

### Single describe() Block with Multiple it() Blocks

```javascript
describe('Page Name - Comprehensive Tests', () => {
  let testData;

  before(() => {
    // Load test data from fixture
    cy.fixture('testData').then((data) => {
      testData = data;
    });
  });

  it('Test 1: should perform first test', () => {
    cy.log('========== Test 1: Description ==========');

    // Navigate to page
    PageObject.navigateToPage();

    // Perform actions
    PageObject.performAction();

    // Verify results
    PageObject.verifyResult();

    cy.log('✓ Verified: Test completed successfully');
  });

  it('Test 2: should perform second test', () => {
    cy.log('========== Test 2: Description ==========');

    // Test implementation
  });

  // ... more tests
});
```

### Test Structure Pattern

Each test should follow this pattern:

```javascript
it('Test N: should [description]', () => {
  cy.log('========== Test N: [Description] ==========');

  // 1. Navigate to page
  PageObject.navigateToPage();

  // 2. Clear filters (if applicable)
  PageObject.clearAllFilters();

  // 3. Add waits if needed for page load
  cy.wait(5000);

  // 4. Perform actions
  PageObject.performAction();

  // 5. Verify results
  PageObject.verifyResult();

  // 6. Final log
  cy.log('✓ Verified: Test completed');
});
```

---

## Database Query Helpers

### Query Helper Class Structure

```javascript
/**
 * [Module] Database Queries
 * Contains SQL queries for [module]-related database operations
 */

class ModuleQueries {
  /**
   * Get all records for company
   * Returns records sorted by created_at descending
   */
  getAllRecordsForCompany() {
    return `
      SELECT
        o.field1,
        o.field2,
        o.field3
      FROM table_name o
      LEFT JOIN general_company_settings gcs ON o.company_id = gcs.uid
      WHERE gcs.name IN ('circuly shopify stripe')
      ORDER BY o.created_at DESC
    `;
  }

  /**
   * Get specific record with filters
   * Filters by: [list filters]
   */
  getSpecificRecord() {
    return `
      SELECT
        o.field1,
        o.field2
      FROM table_name o
      LEFT JOIN general_company_settings gcs ON o.company_id = gcs.uid
      WHERE gcs.name IN ('circuly shopify stripe')
        AND o.status = 'value'
      ORDER BY o.created_at DESC
      LIMIT 1 OFFSET 4
    `;
  }

  /**
   * Get total count of records
   */
  getRecordCount() {
    return `
      SELECT COUNT(*) as total_records
      FROM table_name o
      LEFT JOIN general_company_settings gcs ON o.company_id = gcs.uid
      WHERE gcs.name IN ('circuly shopify stripe')
    `;
  }
}

export default new ModuleQueries();
```

### Using Database Queries in Tests

```javascript
// Get all records
cy.task('queryDb', OrderQueries.getAllOrdersForCompany()).then((orders) => {
  expect(orders).to.have.length.greaterThan(0);
  const firstOrderId = orders[0].order_id;
  cy.log(`Found order ID from DB: ${firstOrderId}`);

  // Use the data
  OrderListPage.searchByOrderId(firstOrderId);
});

// Get count and compare with UI
cy.task('queryDb', OrderQueries.getOrderCountForCompany()).then((result) => {
  const dbCount = parseInt(result[0].total_orders);
  cy.log(`Database order count: ${dbCount}`);

  OrderListPage.getTotalOrderCount().then((uiCount) => {
    cy.log(`UI pagination order count: ${uiCount}`);
    expect(uiCount).to.equal(dbCount);
  });
});
```

---

## Verification Patterns

### URL Parameter Verification

```javascript
verifyUrlContains(parameter, value) {
  cy.url().should('include', `${parameter}=${value}`);
  cy.log(`✓ Verified: URL contains ${parameter}=${value}`);
}
```

### Success Message Verification

```javascript
cy.contains('p', 'Successfully requested!').should('be.visible');
cy.log('✓ Verified: Successfully requested message is displayed');
```

### Pagination Text Verification

```javascript
OrderListPage.paginationText.should('contain', '1-10');
```

### Table Content Verification

```javascript
verifyOrderInTable(orderId) {
  cy.get('tbody').contains(orderId).should('be.visible');
  cy.log(`✓ Verified: Order ${orderId} is visible in table`);
}
```

### Database vs UI Count Verification

```javascript
cy.task('queryDb', OrderQueries.getOrderCountForCompany()).then((result) => {
  const dbCount = parseInt(result[0].total_orders);

  OrderListPage.getTotalOrderCount().then((uiCount) => {
    expect(uiCount).to.equal(dbCount);
    cy.log('✓ Verified: Database count matches UI count');
  });
});
```

---

## Special Techniques

### Finding First Record by Date

```javascript
cy.task('queryDb', OrderQueries.getAllOrdersForCompany()).then((orders) => {
  const firstOrder = orders.reduce((prev, current) => {
    return (new Date(prev.created_at) < new Date(current.created_at)) ? prev : current;
  });

  const firstOrderId = firstOrder.order_id;
  cy.log(`Found first order ID from DB: ${firstOrderId}`);
});
```

### Returning Cypress Values (Maintaining Chainability)

```javascript
getTotalOrderCount() {
  return this.paginationText.invoke('text').then((text) => {
    // Extract total from format "1-10 of 55"
    const match = text.match(/of\s+(\d+)/);
    const total = match ? parseInt(match[1]) : 0;
    cy.log(`✓ Verified: Total orders shown in pagination: ${total}`);

    // Return the total in a chainable Cypress command
    return cy.wrap(total);  // This ensures you return a Cypress command instead of a raw value
  });
}
```

### Tab URL Verification

```javascript
clickDraftTab() {
  this.waitForElement(this.draftTab, 5000);
  this.draftTab.click();
  cy.wait(2000);
  cy.url().should('include', 'draft');  // Verify URL contains tab name
  cy.log('✓ Verified: Clicked Draft tab');
}
```

### Conditional Test Execution

```javascript
cy.task('queryDb', OrderQueries.getFifthOrderWithoutSubscription()).then((orders) => {
  if (orders && orders.length > 0) {
    const fifthOrder = orders[0];
    const orderId = fifthOrder.order_id;
    cy.log(`Found 5th order from DB: ${orderId}`);

    // Perform test actions
    OrderListPage.searchByOrderId(orderId);
    OrderListPage.verifyOrderInTable(orderId);
  } else {
    cy.log('⚠ Warning: No order found matching the criteria');
  }
});
```

---

## Complete Example

### Page Object: OrderListPage.js

```javascript
/**
 * Order List Page Object
 * Contains selectors and actions for the Order List page
 */

class OrderListPage {
  // ==================== NAVIGATION ====================
  navigateToOrderList() {
    cy.visit(Cypress.env('baseUrl') + 'en/cms/orders');
    cy.wait(3000);
    cy.log('✓ Verified: Navigated to Order List page');
  }

  // ==================== FILTERS ====================
  get statusFilter() {
    return cy.get('button[aria-haspopup="listbox"]').contains('Status');
  }

  get clearFiltersButton() {
    return cy.get('button').contains('Clear');
  }

  selectStatusFilter(status) {
    this.waitForElement(this.statusFilter, 5000);
    this.statusFilter.click();
    cy.wait(1000);

    cy.get('div[role="listbox"][aria-labelledby]').should('be.visible');
    cy.get('div[role="listbox"] div[role="option"]').each(($option) => {
      const optionText = $option.find('span.block').text().trim();
      if (optionText.toLowerCase() === status.toLowerCase()) {
        cy.wrap($option).click();
        return false;
      }
    });

    cy.wait(2000);
    cy.log(`✓ Verified: Selected status filter: ${status}`);
  }

  clearAllFilters() {
    this.waitForElement(this.clearFiltersButton, 5000);
    this.clearFiltersButton.click();
    cy.wait(2000);
    cy.log('✓ Verified: Cleared all filters');
  }

  // ==================== URL VERIFICATION ====================
  verifyUrlContains(parameter, value) {
    cy.url().should('include', `${parameter}=${value}`);
    cy.log(`✓ Verified: URL contains ${parameter}=${value}`);
  }

  // ==================== HELPER METHODS ====================
  waitForElement(element, maxWait = 5000) {
    return element.should('be.visible', { timeout: maxWait });
  }
}

export default new OrderListPage();
```

### Database Helper: order-queries.js

```javascript
/**
 * Order Database Queries
 * Contains SQL queries for order-related database operations
 */

class OrderQueries {
  /**
   * Get all orders for company 'circuly shopify stripe'
   * Returns orders sorted by created_at descending
   */
  getAllOrdersForCompany() {
    return `
      SELECT
        o.order_id,
        o.company_id,
        o.status,
        o.created_at
      FROM orders o
      LEFT JOIN general_company_settings gcs ON o.company_id = gcs.uid
      WHERE gcs.name IN ('circuly shopify stripe')
      ORDER BY o.created_at DESC
    `;
  }

  /**
   * Get total count of orders for company
   */
  getOrderCountForCompany() {
    return `
      SELECT COUNT(*) as total_orders
      FROM orders o
      LEFT JOIN general_company_settings gcs ON o.company_id = gcs.uid
      WHERE gcs.name IN ('circuly shopify stripe')
    `;
  }
}

export default new OrderQueries();
```

### Test File: orderList.cy.js

```javascript
import OrderListPage from '../../support/page-objects/OrderListPage';
import OrderQueries from '../../support/helpers/order-queries';

describe('Order List Page - Comprehensive Tests', () => {
  let testData;

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data;
    });
  });

  it('Test 1: should filter orders successfully', () => {
    cy.log('========== Test 1: Filtering Functionality ==========');

    // Navigate to Order List page
    OrderListPage.navigateToOrderList();

    // Apply Status filter
    OrderListPage.selectStatusFilter('open');

    // Verify URL contains status=open
    OrderListPage.verifyUrlContains('status', 'open');

    // Clear filters
    OrderListPage.clearAllFilters();
    cy.log('✓ Verified: Filters cleared successfully');
  });

  it('Test 2: should verify order count matches between database and UI', () => {
    cy.log('========== Test 2: DB Count vs UI Count Verification ==========');

    // Navigate to Order List page
    OrderListPage.navigateToOrderList();
    OrderListPage.clearAllFilters();

    // Get total count from database
    cy.task('queryDb', OrderQueries.getOrderCountForCompany()).then((result) => {
      const dbCount = parseInt(result[0].total_orders);
      cy.log(`Database order count: ${dbCount}`);

      // Get total count from UI pagination
      OrderListPage.getTotalOrderCount().then((uiCount) => {
        cy.log(`UI pagination order count: ${uiCount}`);

        // Verify counts match
        expect(uiCount).to.equal(dbCount);
        cy.log('✓ Verified: Database count matches UI count');
      });
    });
  });
});
```

---

## Key Takeaways

1. **Always use `waitForElement()` before interactions** - Ensures element is visible before acting
2. **Add `cy.wait()` after actions** - Provides stability between operations
3. **Include `cy.log()` for verification** - Helps with debugging and test output
4. **Use `.check({ force: true })` for checkboxes** - More reliable than `.click()`
5. **Use `cy.wrap()` to maintain chainability** - When returning values in custom methods
6. **Single describe() with multiple it()** - Keep all tests in one describe block
7. **Clear filters at start of each test** - Ensures clean state
8. **Verify success messages in modals** - Confirm operations completed successfully
9. **Use data-testid attributes** - More stable than CSS selectors
10. **Document all SQL queries with JSDoc** - Makes queries easier to understand

---

## Naming Conventions

### Files
- Test files: `[feature-name].cy.js` (e.g., `orderList.cy.js`)
- Page objects: `[PageName].js` with PascalCase (e.g., `OrderListPage.js`)
- Query helpers: `[module]-queries.js` (e.g., `order-queries.js`)

### Methods
- Actions: `verbNoun()` (e.g., `clickExport()`, `selectStatusFilter()`)
- Verifications: `verifyNoun()` (e.g., `verifyUrlContains()`, `verifyOrderInTable()`)
- Getters: `get elementName()` (e.g., `get statusFilter()`)

### Variables
- Use descriptive names (e.g., `firstOrderId`, `dbCount`, `uiCount`)
- Use camelCase for variables
- Use PascalCase for class names
- Use UPPER_CASE for constants

---

*Last Updated: January 2026*
*Based on Order List Page implementation*
