# API Health Check Setup

## Overview
Added reusable API health check functionality to verify backend services are running before executing tests.

---

## Files Created

### 1. **Helper File**
**Location:** `cypress/support/helpers/api-health-check.js`

**Purpose:** Centralized API health check logic

**Methods:**
- `checkHubApi()` - Verifies HUB API is accessible
- `checkCheckoutApi()` - Verifies Checkout API is accessible
- `checkAllApis()` - Verifies all APIs at once

**Example Usage:**
```javascript
import ApiHealthCheck from '../support/helpers/api-health-check';

// In test file
ApiHealthCheck.checkAllApis();
```

---

### 2. **Custom Commands File**
**Location:** `cypress/support/commands/api-commands.js`

**Purpose:** Cypress custom commands for API health checks

**Commands:**
- `cy.checkApiHealth()` - Check all APIs
- `cy.checkHubApi()` - Check HUB API only
- `cy.checkCheckoutApi()` - Check Checkout API only

---

## Updated Files

### 1. **Main Support File**
**Location:** `cypress/support/e2e.js`

**Changes:**
```javascript
// Added import
import './commands/api-commands';
```

---

### 2. **Test File**
**Location:** `cypress/e2e/01-order-page/createManualOrder.cy.js`

**Changes:**
```javascript
before(() => {
  // Load test data from fixture
  cy.fixture('testData').then((data) => {
    testData = data;
  });

  // Verify all APIs are accessible
  cy.checkApiHealth();  // ← NEW
});
```

---

## Usage in Tests

### **Option 1: Use Custom Command (Recommended)**
```javascript
describe('My Test Suite', () => {
  before(() => {
    cy.checkApiHealth();  // Check all APIs
  });

  it('should do something', () => {
    // Your test code
  });
});
```

### **Option 2: Use Helper Directly**
```javascript
import ApiHealthCheck from '../../support/helpers/api-health-check';

describe('My Test Suite', () => {
  before(() => {
    ApiHealthCheck.checkAllApis();
  });

  it('should do something', () => {
    // Your test code
  });
});
```

### **Option 3: Check Individual APIs**
```javascript
describe('My Test Suite', () => {
  before(() => {
    cy.checkHubApi();       // Only HUB API
    cy.checkCheckoutApi();  // Only Checkout API
  });

  it('should do something', () => {
    // Your test code
  });
});
```

---

## API Endpoints Checked

### **HUB API**
- **URL:** `https://hub-api-development-680576524870.europe-west3.run.app/v1/version`
- **Expected Status:** 200, 301, or 302

### **Checkout API**
- **URL:** `https://checkout-api-development-680576524870.europe-west3.run.app/v1/version`
- **Expected Status:** 200, 301, or 302

---

## Benefits

✅ **Early Failure Detection** - Tests fail fast if APIs are down
✅ **Better Debugging** - See API status in Cypress logs before test execution
✅ **Reusable** - One command works across all test files
✅ **Maintainable** - API URLs centralized in one place
✅ **Flexible** - Can check all APIs or individual ones

---

## Example Output

When tests run, you'll see logs like:
```
========== API Health Check ==========
✓ HUB API Version: 200
✓ Checkout API Version: 200
✓ Verified: All APIs are accessible
```

---

## Adding More APIs

To add more API checks, update `api-health-check.js`:

```javascript
class ApiHealthCheck {
  // Add new method
  checkNewApi() {
    cy.request({
      method: 'GET',
      url: 'https://new-api-url.com/health',
      failOnStatusCode: false
    }).then((response) => {
      cy.log(`✓ New API: ${response.status}`);
      expect(response.status).to.be.oneOf([200, 301, 302]);
    });
  }

  // Update checkAllApis
  checkAllApis() {
    cy.log('========== API Health Check ==========');
    this.checkHubApi();
    this.checkCheckoutApi();
    this.checkNewApi();  // ← Add here
    cy.log('✓ Verified: All APIs are accessible');
  }
}
```

Then add custom command in `api-commands.js`:
```javascript
Cypress.Commands.add('checkNewApi', () => {
  ApiHealthCheck.checkNewApi();
});
```

---

## Architecture

```
cypress/
├── support/
│   ├── helpers/
│   │   └── api-health-check.js       # Core logic
│   ├── commands/
│   │   └── api-commands.js           # Cypress commands
│   └── e2e.js                         # Import commands
└── e2e/
    └── 01-order-page/
        └── createManualOrder.cy.js    # Use: cy.checkApiHealth()
```

---

**Created:** 2026-01-23
**Purpose:** Centralized API health checking for test reliability
**Pattern:** Helper + Custom Commands for maximum reusability
