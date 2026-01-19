# Claude Code Integration Guide

## Quick Start with Claude Code

Claude Code is already integrated in this project! Here's how to use it effectively:

### 1. Easy Commands

Simply ask Claude to help you with:

#### Generate Tests
```
@cypress-test-helper Write a test for creating a new product
```

#### Debug Issues
```
@cypress-test-helper Why is this test failing? [paste error]
```

#### Add Features
```
@test-generator Create a test suite for order management
```

#### Refactor Code
```
Help me refactor cypress/e2e/01-customers/customer-crud.cy.js to use page objects
```

### 2. Project-Specific Prompts

We've created custom prompts in `.claude/prompts/`:

- **cypress-test-helper.md** - General Cypress help, knows project structure
- **test-generator.md** - Generate test cases following project patterns

### 3. Common Use Cases

#### Generate a New Test File
```
@test-generator Create tests for subscription management in cypress/e2e/04-subscriptions/
```

#### Add Custom Commands
```
Create a custom command for adding items to cart and save it in cypress/support/commands/
```

#### Fix Failing Tests
```
@cypress-test-helper This test is failing: [paste test code and error]
```

#### Create Page Objects
```
Create a page object for the customer list page following the base page pattern
```

#### Generate Test Data
```
Create sample test data for products in cypress/fixtures/test-data/products.json
```

### 4. Best Practices with Claude

1. **Be Specific**: Mention file paths and exact features
   - Good: "Add a test for editing customers in cypress/e2e/01-customers/"
   - Bad: "Add a test"

2. **Use @mentions**: Reference the custom prompts
   - `@cypress-test-helper` for general help
   - `@test-generator` for creating new tests

3. **Provide Context**: Share relevant files or error messages
   - "Here's my test file [paste code], it's failing with [error]"

4. **Ask for Explanations**: Understand the code
   - "Explain how the database integration works in cypress/plugins/index.js"

### 5. Quick Examples

#### Example 1: Generate Complete Test Suite
```
@test-generator Create a complete test suite for payment processing:
- Test successful payment
- Test failed payment
- Test payment refund
- Include database verification
```

#### Example 2: Debug and Fix
```
@cypress-test-helper My customer creation test is timing out. Here's the test:
[paste code]
Error: Timed out after 10000ms
```

#### Example 3: Improve Existing Code
```
Review cypress/e2e/02-products/product-crud.cy.js and suggest improvements for:
- Better error handling
- Use of custom commands
- Test data management
```

#### Example 4: Add New Feature
```
Add a custom command to handle Shopify authentication and save it in:
cypress/support/commands/auth-commands.js
```

### 6. Project Structure Reference

When asking Claude for help, you can reference:

```
cypress/
├── e2e/                    # Your test files
│   ├── 00-health-check/   # Health check tests
│   ├── 01-customers/       # Customer tests
│   ├── 02-products/        # Product tests
│   └── ...
├── fixtures/               # Test data
│   ├── test-data/         # JSON test data
│   └── selectors/         # CSS/XPath selectors
├── support/
│   ├── commands/          # Custom commands
│   ├── page-objects/      # Page object models
│   └── database/          # DB helpers
└── plugins/               # Cypress plugins
```

### 7. Available npm Scripts

Tell Claude to use these commands:
- `npm run cy:open` - Open Cypress UI
- `npm run cy:health-check` - Verify setup
- `npm run cy:run` - Run all tests
- `npm run cy:run:customers` - Run customer tests
- `npm run cy:run:products` - Run product tests
- `npm test` - Run health check

### 8. Tips for Better Results

1. **Share the file path** when asking to modify or create files
2. **Include error messages** when debugging
3. **Mention test data requirements** when generating tests
4. **Ask for explanations** to understand the generated code
5. **Request specific patterns** (e.g., "use page objects", "add database verification")

### 9. Example Workflow

```
1. You: "@test-generator Create tests for managing customer subscriptions"

2. Claude: [Generates test file with proper structure]

3. You: "Add database verification to check subscription was created"

4. Claude: [Adds cy.task('queryDatabase') calls]

5. You: "Now create a page object for the subscription page"

6. Claude: [Creates page object following base-page pattern]
```

### 10. Getting Help

Ask Claude:
- "Show me examples from existing tests"
- "What custom commands are available?"
- "How do I use the database integration?"
- "What's the pattern for page objects in this project?"

## Pro Tips

- Use `@cypress-test-helper` prefix for context-aware help
- Claude knows your project structure and patterns
- Ask for code reviews before committing
- Request both tests AND documentation together
- Ask Claude to explain why it made certain choices

---

**Remember**: Claude has full context of your project structure, existing patterns, and best practices. Just describe what you need!
