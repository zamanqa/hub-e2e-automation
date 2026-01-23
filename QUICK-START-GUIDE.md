# Quick Start Guide - HUB E2E Automation

## ✅ Project Setup Complete!

All dependencies are installed and billing address form is updated with proper selectors.

---

## 🚀 Running Tests

### 1. Open Cypress Interactive Mode
```bash
npm run open
```
**Use this for:** Development and debugging tests

---

### 2. Run All Tests (Headless)
```bash
npm run cy:run
```
**Use this for:** CI/CD or quick verification

---

### 3. Run Specific Test File

**Billing Address Test:**
```bash
npx cypress run --spec "cypress/e2e/02-billing-address/billingAddressForm.cy.js"
```

**Order Creation Test:**
```bash
npm run oneCase
```

**Login Test:**
```bash
npx cypress run --spec "cypress/e2e/00-login-hub/loginHub.cy.js"
```

---

### 4. Run with Browser Visible
```bash
npm run allHubTestHead
```
**Use this for:** Watching tests execute in real browser

---

### 5. Run Health Check
```bash
npm run cy:health-check
```
**Use this for:** Verifying environment setup

---

## 📁 Project Structure

```
hub-e2e-automation/
├── cypress/
│   ├── e2e/                              # Test files
│   │   ├── 00-login-hub/                # Login tests
│   │   ├── 01-order-page/               # Order creation tests
│   │   ├── 02-billing-address/          # Billing form tests (NEW)
│   │   └── 100-health-check/            # Health checks
│   ├── fixtures/
│   │   └── testData.json                # Test data
│   ├── support/
│   │   ├── commands/                    # Custom commands
│   │   │   ├── auth-commands.js        # Login session management
│   │   │   └── database-commands.js    # Database queries
│   │   ├── page-objects/               # Page Object Models
│   │   │   ├── LoginPage.js
│   │   │   └── OrderCreationPage.js    # (Updated with billing form)
│   │   └── database/
│   │       └── db-helper.js            # Database helper utilities
├── .env                                 # Environment config (Created)
├── cypress.config.js                    # Cypress configuration
└── package.json                         # Dependencies & scripts
```

---

## 🔧 What Was Fixed

### Issue
```
Error: Expected to find element [data-cy="billing-first-name"] input, but never found it
```

### Solution
1. ✅ Updated all billing selectors to target Vuetify DOM structure:
   ```javascript
   // Before
   cy.get('[data-cy="billing-first-name"] input')

   // After
   cy.get('[data-cy="billing-first-name"] .v-field__input input')
   ```

2. ✅ Added scroll functionality to billing section
3. ✅ Added wait logic to ensure elements are visible
4. ✅ Added new `addressAddition` field support
5. ✅ Created dedicated test for billing address validation

---

## 📝 Updated Files

### Modified:
1. **OrderCreationPage.js** - Updated selectors & added scroll helper
2. **testData.json** - Added `addressAddition` field

### Created:
1. **billingAddressForm.cy.js** - New test for billing form
2. **.env** - Environment configuration
3. **BILLING-ADDRESS-UPDATE.md** - Detailed documentation
4. **QUICK-START-GUIDE.md** - This file

---

## 🎯 Key Features

### Billing Address Form Methods

```javascript
// Scroll to billing section (automatically called by fillBillingAddress)
OrderCreationPage.scrollToBillingSection();

// Fill complete billing address from fixture
OrderCreationPage.fillBillingAddress(testData.billingAddress);

// Fill individual fields
OrderCreationPage.fillGivenName('John');
OrderCreationPage.fillSurname('Doe');
OrderCreationPage.fillEmail('test@example.com');
OrderCreationPage.fillPhone('+1234567890');
OrderCreationPage.fillVatNumber('123456');
OrderCreationPage.fillCompany('Test Company');
OrderCreationPage.fillStreet('Main Street');
OrderCreationPage.fillStreetNumber('123');
OrderCreationPage.fillAddressAddition('Apt 4B');
OrderCreationPage.fillPostalCode('12345');
OrderCreationPage.fillCity('New York');
OrderCreationPage.selectCountry('Germany');
```

---

## 🔍 Debugging Tips

### If test fails with "element not found":
1. Run in interactive mode: `npm run open`
2. Use `cy.pause()` to debug at specific point
3. Check if element `data-cy` attribute exists in actual DOM
4. Increase timeout in selector: `cy.get(selector, { timeout: 10000 })`

### If test times out:
1. Check `.env` file has correct credentials
2. Verify application URL is accessible
3. Check network connection
4. Look at screenshot in `cypress/screenshots/` folder

### If billing form doesn't appear:
1. Ensure an item is added to the order first
2. Check if page requires scrolling to show form
3. Verify the "Billing address" header exists on page

---

## 📊 Test Data

Located in: `cypress/fixtures/testData.json`

```json
{
  "billingAddress": {
    "givenName": "Shahiduz",
    "surname": "Zaman",
    "email": "test.user.{{timestamp}}@circuly.io",
    "phone": "+4917656824720",
    "vatNumber": "159753",
    "company": "Test Company",
    "street": "WeberStr.",
    "streetNumber": "25",
    "addressAddition": "",
    "postalCode": "60318",
    "city": "Frankfurt am Main",
    "country": "Germany"
  }
}
```

**Note:** `{{timestamp}}` is automatically replaced with current timestamp to create unique emails.

---

## ⚙️ Environment Configuration

Located in: `.env`

Key variables:
- `BASE_URL` - HUB application URL
- `LOGIN_URL` - Login page URL
- `TEST_USER_EMAIL` - Test account email
- `TEST_USER_PASSWORD` - Test account password
- `circuly_shopify_stripe` - Company name to select
- Database credentials for PostgreSQL

---

## 🧪 Example Test Usage

```javascript
import OrderCreationPage from '../../support/page-objects/OrderCreationPage';

describe('My Test Suite', () => {
  let testData;

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data;
    });
  });

  it('should fill billing address', () => {
    // Navigate to order creation page
    OrderCreationPage.visit();
    OrderCreationPage.verifyPageLoaded();

    // Add item (required before billing form appears)
    // ... add item steps ...

    // Fill billing address
    OrderCreationPage.fillBillingAddress(testData.billingAddress);
  });
});
```

---

## 📞 Need Help?

- Check `BILLING-ADDRESS-UPDATE.md` for detailed changes
- Review `SETUP.md` for initial setup instructions
- Look at existing test files in `cypress/e2e/` for examples
- Use Cypress documentation: https://docs.cypress.io

---

## ✨ Next Steps

1. ✅ Run tests to verify everything works
2. ✅ Add more test cases for edge scenarios
3. ✅ Implement shipping address tests
4. ✅ Add order submission and verification
5. ✅ Integrate with CI/CD pipeline

---

**Last Updated:** 2026-01-23
**Status:** ✅ Ready to use
**Node Version Required:** v18.17.0+ (currently using v16.14.0 - upgrade recommended)
