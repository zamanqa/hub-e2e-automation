# Selector Collection Guide

## Using Claude Chrome Extension

### Step-by-Step Process

1. **Open your HUB application** in Chrome browser
2. **Navigate to the module** you want to test (e.g., Customers)
3. **Click Claude Extension** icon in Chrome toolbar
4. **Ask Claude to identify elements**

### Example Prompts

#### For List/Index Pages:
```
"On this Customers list page, identify:
1. The search input field with its selector
2. The 'Add Customer' button with multiple selector options
3. All table column headers
4. Edit and Delete buttons in each row
5. Pagination controls"
```

#### For Create/Edit Forms:
```
"On this Customer form, identify all input fields:
- First Name input
- Last Name input
- Email input
- Phone input
- Save and Cancel buttons
Give me CSS selectors and data attributes for each."
```

### Recording Selectors

1. Copy selectors from Claude's response
2. Add to `/cypress/fixtures/selectors/shopify/selectors.json`
3. Update page object files to use these selectors
4. Test selectors in Cypress before finalizing

### Selector Priority

1. **data-cy** or **data-testid** (Best - most stable)
2. **id** attributes
3. **name** attributes
4. **class** names (unique)
5. **CSS selectors** (combined attributes)
6. **XPath** (last resort)

## Next Steps

After collecting selectors:
1. Update `selectors.json` file
2. Create/update page object classes
3. Write test cases using page objects
4. Validate selectors don't break
