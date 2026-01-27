# Claude Memory - Project Knowledge Base

> **Last Updated**: January 27, 2026
>
> This file contains all important project information, patterns, and conventions that Claude should remember across sessions.

---

## Project Overview

**Project Name**: HUB Cypress E2E Automation - Shopify Integration
**Framework**: Cypress v13.17.0
**Database**: PostgreSQL
**UI Library**: Headless UI (NOT Vuetify)
**Company**: circuly shopify stripe

---

## File Structure

```
hub-e2e-automation/
├── cypress/
│   ├── e2e/
│   │   └── 01-order-page/
│   │       ├── orderList.cy.js
│   │       └── orderDetail.cy.js
│   ├── support/
│   │   ├── page-objects/
│   │   │   ├── OrderListPage.js
│   │   │   └── OrderDetailPage.js
│   │   └── helpers/
│   │       ├── order-queries.js
│   │       └── subscription-queries.js
│   └── fixtures/
│       └── testData.json
└── docs/
    ├── test-writing-guide.md
    └── claude-memory.md (this file)
```

---

## Code Organization Pattern

### **Page Object Structure (CRITICAL)**

**✅ CORRECT PATTERN** - Selector-Action Pairing:
```javascript
class PageName {
  // ==================== SECTION NAME ====================

  // Selector
  get buttonName() {
    return cy.get('selector');
  }

  // Action
  clickButton() {
    this.waitForElement(this.buttonName, 5000);
    this.buttonName.click();
    cy.wait(2000);
    cy.log('✓ Verified: Action completed');
  }

  // Selector (next element)
  get inputField() {
    return cy.get('input-selector');
  }

  // Action (for inputField)
  enterText(text) {
    this.inputField.type(text);
    cy.log(`✓ Verified: Entered: ${text}`);
  }
}

export default new PageName();
```

**❌ WRONG PATTERN** - Don't group all selectors together:
```javascript
// DON'T DO THIS:
// Selector
get button1() { ... }
// Selector
get button2() { ... }
// Selector
get button3() { ... }

// Action
clickButton1() { ... }
// Action
clickButton2() { ... }
```

---

## Selector Patterns (Headless UI)

### Buttons
```javascript
cy.get('button').contains('Text')
cy.get('button[data-cy="btn-submit"]')
cy.get('button[data-cy="btn-close"]')
```

### Filter Dropdowns
```javascript
// Filter button
cy.get('button[aria-haspopup="listbox"]').contains('Status')

// Dropdown options
cy.get('div[role="listbox"][aria-labelledby]').should('be.visible');
cy.get('div[role="listbox"] div[role="option"]').each(($option) => {
  const optionText = $option.find('span.block').text().trim();
  if (optionText.toLowerCase() === status.toLowerCase()) {
    cy.wrap($option).click();
    return false;
  }
});
```

### Tabs
```javascript
cy.get('a').contains('Draft')
cy.get('a').contains('Consumable')
```

### Pagination
```javascript
cy.get('button[data-testid="btn-go-to-first"]')
cy.get('button[data-testid="btn-prev-page"]')
cy.get('button[data-testid="btn-next-page"]')
cy.get('button[data-testid="btn-go-to-last"]')
cy.get('span[data-testid="from-to-of-total"]')
```

### Checkboxes
```javascript
// Use .check() NOT .click()
cy.get('input[type="checkbox"]').check({ force: true })
```

### Notes Section
```javascript
// Dynamic textarea ID
cy.get('textarea[id^="input-v-"]')

// Note message display
cy.get('[data-test-id="note-message"]')
```

---

## Database Queries

### Company Filter (Always Use)
```sql
LEFT JOIN general_company_settings gcs ON o.company_id = gcs.uid
WHERE gcs.name IN ('circuly shopify stripe')
```

### Order Queries Location
**File**: `cypress/support/helpers/order-queries.js`

**Key Methods**:
- `getFifthOrderWithoutSubscription()` - Gets 2nd order (OFFSET 1)
- `getAllOrdersForCompany()` - All orders
- `getOrderCountForCompany()` - Count orders

**Current Query Configuration**:
```sql
-- Gets 2nd order without subscription
LIMIT 1 OFFSET 1
```

### Subscription Queries Location
**File**: `cypress/support/helpers/subscription-queries.js`

**Key Methods**:
- `getSubscriptionById(subscriptionId)` - Verify subscription exists
- `hasRecurringPayments(subscriptionId)` - Check recurring_payments table
- `getSubscriptionsByOrderId(orderId)` - All subscriptions for order

**Important Table**: `public.recurring_payments` (NOT subscriptions table)

---

## Test Structure

### Single Test Pattern (PREFERRED)
```javascript
describe('Page Name - Comprehensive Tests', () => {
  let testData;
  let testOrderId;

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data;
    });
  });

  it('should complete all page tests', () => {
    cy.log('========== Complete Test Flow ==========');

    // Step 1: ...
    cy.log('--- Step 1: Description ---');
    // Test code

    // Step 2: ...
    cy.log('--- Step 2: Description ---');
    // Test code

    // Step 3: ...
    cy.log('--- Step 3: Description ---');
    // Test code
  });
});
```

---

## Important Conventions

### 1. Comments
- Always use `// Selector` before selector methods
- Always use `// Action` before action methods
- Pair each selector with its related action(s)

### 2. Logging
- Use `cy.log('✓ Verified: ...')` for successful actions
- Use `cy.log('⚠ Warning: ...')` for missing/optional items

### 3. Waits
- `cy.wait(2000)` after clicks
- `cy.wait(1000)` after text input
- `cy.wait(3000)` after submit/page navigation
- `cy.wait(5000)` after major page loads

### 4. Element Waiting
```javascript
waitForElement(element, maxWait = 5000) {
  return element.should('be.visible', { timeout: maxWait });
}
```

### 5. Checkboxes
**Always use `.check()` NOT `.click()`**
```javascript
cy.get('input[type="checkbox"]').check({ force: true })
```

### 6. URL Verification
```javascript
cy.url().should('include', `/orders/${orderId}`)
cy.url().should('include', 'status=open')
```

---

## Current Test Files

### orderList.cy.js
**Location**: `cypress/e2e/01-order-page/orderList.cy.js`
**Tests**: 11 tests in single describe block
- Test 1: Filtering functionality
- Test 2: Search functionality
- Test 3: Clear filter button
- Test 4: Clear filter and DB count vs UI count
- Test 5: Select multiple orders and export
- Test 6: Query 5th order, search, mark fulfilled
- Test 7: Test pagination controls
- Test 8: Filter by status='open' + URL verification
- Test 9: Filter by payment_status='paid' + URL verification
- Test 10: Click 'Draft' tab
- Test 11: Click 'Consumable' tab

### orderDetail.cy.js
**Location**: `cypress/e2e/01-order-page/orderDetail.cy.js`
**Tests**: All tests combined into 1 test
- Step 1: Search and open order (2nd order from DB)
- Step 2: Create and verify note
- Step 3: Product list + subscription creation + DB verification

---

## User Preferences

1. ✅ **Single test per file** - Combine all steps into one `it()` block
2. ✅ **Selector-Action pairing** - Each selector immediately followed by its action
3. ✅ **No time estimates** - Never say "this will take X minutes"
4. ✅ **Don't run tests automatically** - Always ask before running
5. ✅ **Use this memory file** - Reference this instead of searching chat history
6. ✅ **Comment everything** - Use `// Selector` and `// Action` labels
7. ✅ **No emojis in code** - Only use in chat responses

---

## Common Pitfalls to Avoid

1. ❌ **DON'T use Vuetify selectors** - This project uses Headless UI
2. ❌ **DON'T use `.click()` on checkboxes** - Use `.check({ force: true })`
3. ❌ **DON'T group all selectors together** - Pair with actions
4. ❌ **DON'T query subscriptions table for recurring payments** - Use recurring_payments table
5. ❌ **DON'T forget company filter** - Always include `gcs.name IN ('circuly shopify stripe')`
6. ❌ **DON'T create multiple describe() blocks** - Use single describe with one it()

---

## Quick Reference Commands

### Run Tests
```bash
# Run specific test file
npx cypress run --spec "cypress/e2e/01-order-page/orderDetail.cy.js"

# Run in headed mode
npx cypress run --spec "..." --headed --browser chrome
```

### Git Commands
```bash
# Stage files
git add <files>

# Commit with co-author
git commit -m "message

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push to branches
git push origin development
git push origin main
```

---

## Environment

**Base URL**: Pulled from `.env` file via `Cypress.env('baseUrl')`
**Working Directory**: `C:\Users\shahi\Circuly Project\hub e2e\hub-e2e-automation`
**Node Version**: v16.14.0
**Platform**: Windows (win32)

---

## Notes

- User updated selectors to fix dynamic IDs (e.g., `textarea[id^="input-v-"]`)
- Recurring payments query now uses `recurring_payments` table
- Order query uses `OFFSET 1` for 2nd order (not 5th)
- All tests should follow patterns in `test-writing-guide.md`

---

## How to Update This File

### When to Update

Update this file after:
- ✅ Creating new page objects or test files
- ✅ Discovering new selector patterns
- ✅ Adding new database queries or tables
- ✅ Changing project conventions or patterns
- ✅ Fixing bugs that reveal important information
- ✅ Completing major features or test suites
- ✅ User provides new preferences or requirements

### How Claude Should Update

At the end of a conversation session, Claude should:

1. **Review what was accomplished** - Look at files created/modified
2. **Identify important information** - New patterns, selectors, queries, etc.
3. **Update relevant sections** - Add to existing sections or create new ones
4. **Keep it concise** - Only essential information, no fluff
5. **Use the update format below**

### Update Format

Add updates to the bottom of relevant sections with a timestamp:

```markdown
## Section Name

[Existing content...]

**Update (Date)**: New information here
- New pattern discovered
- New selector added
- New convention established
```

### Quick Update Command

Claude can use this prompt at the end of a session:

```
Update docs/claude-memory.md with:
- New page objects: [list]
- New selectors: [list]
- New queries: [list]
- New patterns: [list]
- Important discoveries: [list]
```

---

*This is a living document. Update as project evolves.*
