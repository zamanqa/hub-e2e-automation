# Project Structure Overview

## Directory Structure

```
hub-cypress-shopify/
│
├── config/                          # Configuration files
│   ├── environments/                # Environment-specific configs
│   └── database/                    # Database configuration
│
├── cypress/
│   ├── e2e/                         # Test specifications
│   │   ├── 01-customers/            # Customer module tests
│   │   ├── 02-products/             # Product module tests
│   │   ├── 03-orders/               # Order module tests
│   │   ├── 04-subscriptions/        # Subscription tests
│   │   ├── 05-payments/             # Payment tests
│   │   ├── 06-invoices/             # Invoice tests
│   │   ├── 07-debt-collection/      # Debt collection tests
│   │   ├── 08-recurring-payments/   # Recurring payment tests
│   │   ├── 09-returns/              # Returns tests
│   │   ├── 10-assets/               # Assets tests
│   │   ├── 11-repairs/              # Repairs tests
│   │   ├── 12-email-templates/      # Email template tests
│   │   ├── 13-vouchers/             # Voucher tests
│   │   ├── 14-stores/               # Store tests
│   │   ├── 15-insights/             # Insights tests
│   │   └── critical-flows/          # Cross-module integration tests
│   │
│   ├── fixtures/                    # Test data and selectors
│   │   ├── selectors/               # Platform-specific selectors
│   │   │   └── shopify/             # Shopify selector mappings
│   │   ├── test-data/               # Static test data
│   │   └── db-queries/              # Reusable SQL queries
│   │
│   ├── support/                     # Support files
│   │   ├── page-objects/            # Page Object Models
│   │   │   ├── base/                # Base page classes
│   │   │   ├── customers/           # Customer page objects
│   │   │   ├── products/            # Product page objects
│   │   │   └── [other modules]/     # Other module page objects
│   │   │
│   │   ├── database/                # Database integration
│   │   │   └── db-helper.js         # Database query helper
│   │   │
│   │   ├── commands/                # Custom Cypress commands
│   │   │   ├── customer-commands.js
│   │   │   ├── product-commands.js
│   │   │   └── order-commands.js
│   │   │
│   │   ├── utils/                   # Utility functions
│   │   ├── api-helpers/             # API utilities
│   │   └── e2e.js                   # Global support file
│   │
│   ├── plugins/                     # Cypress plugins
│   │   └── index.js                 # Plugin configuration
│   │
│   └── downloads/                   # Test downloads folder
│
├── reports/                         # Test execution reports
├── screenshots/                     # Test failure screenshots
├── videos/                          # Test execution videos
│
├── scripts/                         # Utility scripts
│   ├── seed-test-data.js           # Database seeding
│   └── cleanup-database.js         # Cleanup scripts
│
├── docs/                           # Documentation
│   ├── selector-collection-guide.md
│   ├── database-integration-guide.md
│   └── project-structure.md
│
├── cypress.config.js               # Cypress configuration
├── package.json                    # NPM dependencies
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
└── README.md                       # Project documentation
```

## Module Organization

Each module (01-15) follows the same structure:
- Test files in `/cypress/e2e/[module]/`
- Page objects in `/cypress/support/page-objects/[module]/`
- Commands in `/cypress/support/commands/[module]-commands.js`
- Selectors in `/cypress/fixtures/selectors/shopify/selectors.json`

## File Naming Conventions

- Test files: `[feature-name].cy.js` (e.g., `customer-crud.cy.js`)
- Page objects: `[page-name]-page.js` (e.g., `customers-list-page.js`)
- Commands: `[module]-commands.js` (e.g., `customer-commands.js`)
- Utilities: `[purpose]-helper.js` (e.g., `db-helper.js`)

## Next Steps

1. Collect selectors using Claude Extension
2. Update selector JSON files
3. Create page object classes
4. Write test specifications
5. Integrate with database
6. Run and validate tests
