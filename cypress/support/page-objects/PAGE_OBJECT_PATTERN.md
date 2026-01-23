# Page Object Model Pattern Guide

## Structure Format

All Page Object files MUST follow this format for better readability and maintainability:

### Pattern: Selector → Action Pairs

Each UI element should be organized as:
1. **Section Header** - Clearly labeled section
2. **Selector** - Getter method for the element
3. **Action(s)** - Methods that interact with or verify that element

```javascript
// ==================== ELEMENT NAME ====================
// Selector
get elementName() {
  return cy.get('selector-here');
}

// Action
performActionOnElement(params) {
  this.elementName.click();
  // additional logic
}
```

## Benefits of This Pattern

✅ **Easy to Navigate** - Each selector is immediately followed by its related actions
✅ **Better Understanding** - Clear relationship between selectors and test actions
✅ **Maintainability** - Easy to find and update specific element interactions
✅ **Matching Test Cases** - Actions align with test steps sequentially

## Smart Wait Helper

All Page Objects should include a `waitForElement()` helper method that:
- Waits up to 5 seconds (configurable) for an element to be visible
- Proceeds immediately if the element is already visible
- Prevents unnecessary fixed waits

```javascript
// ==================== HELPER METHODS ====================
/**
 * Smart wait helper - waits up to maxWait milliseconds for element to be visible
 * If element appears before maxWait, proceeds immediately
 * @param {Cypress.Chainable} element - The Cypress element to wait for
 * @param {number} maxWait - Maximum time to wait in milliseconds (default: 5000)
 */
waitForElement(element, maxWait = 5000) {
  return element.should('be.visible', { timeout: maxWait });
}
```

**Usage in Actions:**
```javascript
// Action
clickLoginButton() {
  this.waitForElement(this.loginButton);  // Smart wait up to 5s
  this.loginButton.click();
}
```

## Complete Example

```javascript
class ExamplePage {
  // ==================== HELPER METHODS ====================
  waitForElement(element, maxWait = 5000) {
    return element.should('be.visible', { timeout: maxWait });
  }
  // ==================== USERNAME INPUT ====================
  // Selector
  get usernameInput() {
    return cy.get('input[name="username"]');
  }

  // Action
  enterUsername(username) {
    this.waitForElement(this.usernameInput);
    this.usernameInput.clear().type(username);
  }

  // Action
  verifyUsernameVisible() {
    this.waitForElement(this.usernameInput);
  }

  // ==================== PASSWORD INPUT ====================
  // Selector
  get passwordInput() {
    return cy.get('input[name="password"]');
  }

  // Action
  enterPassword(password) {
    this.waitForElement(this.passwordInput);
    this.passwordInput.clear().type(password);
  }

  // ==================== LOGIN BUTTON ====================
  // Selector
  get loginButton() {
    return cy.get('button[type="submit"]');
  }

  // Action
  clickLogin() {
    this.waitForElement(this.loginButton);
    this.loginButton.click();
  }

  // ==================== PAGE NAVIGATION ====================
  // Action
  visit() {
    cy.visit('/login');
  }
}

export default new ExamplePage();
```

## Section Organization

### 1. UI Elements (in order of appearance/usage)
- Each element gets its own section
- Selector first, then all related actions
- Use visual separators (`====`) for clarity

### 2. Standalone Actions (at the end)
- Navigation methods (`visit()`)
- Complex verification methods
- Helper methods without specific selectors

## Naming Conventions

### Selectors (getters)
- Use descriptive nouns: `get loginButton()`, `get usernameInput()`
- Camel case format

### Actions (methods)
- Use action verbs: `clickLogin()`, `enterUsername()`, `verifyUsernameVisible()`
- Camel case format
- Prefix with action type:
  - `click*()` - for clicking elements
  - `enter*()` or `set*()` - for input fields
  - `select*()` - for dropdowns
  - `verify*()` - for assertions

## Section Headers

Use this format for section headers:
```javascript
// ==================== ELEMENT NAME ====================
```

Make headers:
- ALL CAPS for element name
- Descriptive and clear
- Consistent width (20 `=` signs on each side)

## Order of Organization

1. **Page-level elements** (title, main containers)
2. **Form elements** (in the order they appear on page)
3. **Buttons** (related to the form/section)
4. **Dynamic elements** (modals, dropdowns)
5. **Verification methods** (if not tied to specific elements)
6. **Navigation methods** (visit, etc.)

## DON'T Do This (Old Pattern)

```javascript
// ❌ BAD: All selectors grouped together
class BadPage {
  get usernameInput() { return cy.get('...'); }
  get passwordInput() { return cy.get('...'); }
  get loginButton() { return cy.get('...'); }

  // All actions grouped together (far from selectors)
  enterUsername(username) { this.usernameInput.type(username); }
  enterPassword(password) { this.passwordInput.type(password); }
  clickLogin() { this.loginButton.click(); }
}
```

## DO This (New Pattern)

```javascript
// ✅ GOOD: Selector → Action pairs
class GoodPage {
  // ==================== USERNAME INPUT ====================
  // Selector
  get usernameInput() { return cy.get('...'); }

  // Action
  enterUsername(username) { this.usernameInput.type(username); }

  // ==================== PASSWORD INPUT ====================
  // Selector
  get passwordInput() { return cy.get('...'); }

  // Action
  enterPassword(password) { this.passwordInput.type(password); }

  // ==================== LOGIN BUTTON ====================
  // Selector
  get loginButton() { return cy.get('...'); }

  // Action
  clickLogin() { this.loginButton.click(); }
}
```

## Verification Logging Best Practice

**IMPORTANT:** After every verification/assertion, log a message to confirm the action has been verified. This makes test execution clearer and helps with debugging.

### Pattern for Verification Logging

```javascript
// Action with verification
verifyLoginSuccessful() {
  this.waitForElement(this.dashboardTitle);
  this.dashboardTitle.should('be.visible');
  cy.log('✓ Verified: Login successful - Dashboard is visible');
}

// Another example
verifyErrorMessage(expectedMessage) {
  this.waitForElement(this.errorMessage);
  this.errorMessage.should('contain.text', expectedMessage);
  cy.log(`✓ Verified: Error message displayed - "${expectedMessage}"`);
}

// Example with multiple verifications
verifyOrderCreated(orderNumber) {
  this.waitForElement(this.successMessage);
  this.successMessage.should('be.visible');
  cy.log('✓ Verified: Success message is visible');

  this.orderNumberDisplay.should('contain.text', orderNumber);
  cy.log(`✓ Verified: Order number displayed - ${orderNumber}`);
}
```

### Benefits of Verification Logging

✅ **Clear Test Execution** - Easy to see which verifications passed in the Cypress log
✅ **Better Debugging** - Quickly identify which verification failed and which passed
✅ **Test Readability** - Understand test flow by reading the logs
✅ **Documentation** - Logs serve as execution documentation

### Logging Guidelines

- Use `cy.log()` after successful verifications
- Prefix with `✓ Verified:` for consistency
- Include what was verified and relevant details
- Keep messages concise but descriptive
- For dynamic values, include them in the log message

## Future Updates

- All NEW page objects MUST follow this pattern
- EXISTING page objects should be refactored to this pattern when modified
- This pattern applies to ALL page object files in the project
- **ALL verification methods MUST include cy.log() statements** (Added: 2026-01-21)

---

**Last Updated:** 2026-01-21
**Version:** 1.1
