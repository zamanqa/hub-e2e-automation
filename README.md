# HUB Cypress Automation - Shopify

Cypress E2E test automation for HUB application integrated with Shopify platform.

## Project Structure

```
hub-cypress-shopify/
├── config/                     # Configuration files
├── cypress/
│   ├── e2e/                    # Test specifications (15 modules)
│   ├── fixtures/               # Test data and selectors
│   ├── support/                # Page objects, commands, utilities
│   └── plugins/                # Cypress plugins
├── reports/                    # Test execution reports
├── scripts/                    # Utility scripts
└── docs/                       # Documentation
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your actual credentials
   ```

3. **Open Cypress**
   ```bash
   npm run cy:open
   ```

4. **Run Tests**
   ```bash
   npm run cy:run
   ```

## Module Test Commands

- Customers: `npm run cy:run:customers`
- Products: `npm run cy:run:products`
- Orders: `npm run cy:run:orders`

## Documentation

See `/docs` folder for:
- Selector collection guide
- Database integration guide
- Test writing guidelines
