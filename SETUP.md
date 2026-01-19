# Cypress Project Setup Guide

## Prerequisites

- Node.js v18.17.0 or higher (see `.nvmrc`)
- npm or yarn
- Git

## Initial Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd hub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and update it with your actual values:

```bash
cp .env.example .env
```

Edit `.env` and configure:
- HUB application URLs
- Shopify credentials
- Database connection details
- Test user credentials

### 4. Verify Installation

Run the health check to ensure everything is configured correctly:

```bash
npm run cy:health-check
```

All 5 health check tests should pass.

## Available Scripts

- `npm run cy:open` - Open Cypress Test Runner in interactive mode
- `npm run cy:run` - Run all tests in headless mode
- `npm run cy:run:chrome` - Run tests in Chrome browser
- `npm run cy:health-check` - Run health check tests to verify setup
- `npm run cy:run:customers` - Run customer module tests only
- `npm run cy:run:products` - Run product module tests only
- `npm run cy:run:orders` - Run order module tests only
- `npm test` - Run health check (default test command)

## Project Structure

```
hub/
├── cypress/
│   ├── e2e/                    # Test files organized by module
│   │   ├── 00-health-check/   # Health check tests
│   │   ├── 01-customers/       # Customer tests
│   │   ├── 02-products/        # Product tests
│   │   └── ...
│   ├── fixtures/               # Test data and selectors
│   ├── plugins/                # Cypress plugins (DB integration)
│   └── support/                # Custom commands and helpers
├── reports/                    # Test execution reports
├── screenshots/                # Failure screenshots
├── videos/                     # Test execution videos
├── .env                        # Environment variables (not in git)
├── .env.example                # Example environment file
├── cypress.config.js           # Main Cypress configuration
└── cypress.health-check.config.js  # Health check configuration
```

## Git Workflow

The project uses two main branches:

- `main` - Production-ready code
- `development` - Active development branch

## Database Integration

This project includes MySQL database integration. Configure your database credentials in `.env`:

```
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=hub_database
DB_PORT=3306
```

## Running Tests

### Interactive Mode (Development)

```bash
npm run cy:open
```

This opens the Cypress Test Runner where you can select and run tests interactively.

### Headless Mode (CI/CD)

```bash
npm run cy:run
```

### Run Specific Test Suites

```bash
npm run cy:run:customers
npm run cy:run:products
npm run cy:run:orders
```

## Troubleshooting

### Health Check Failures

If health check tests fail:
1. Ensure all dependencies are installed: `npm install`
2. Verify Cypress is properly installed: `npx cypress verify`
3. Check Node.js version: `node --version` (should be v18.17.0+)

### Environment Issues

If tests can't connect to your application:
1. Verify `.env` file exists and has correct values
2. Check that URLs in `.env` are accessible
3. Ensure baseUrl in `cypress.config.js` matches your environment

### Database Connection Issues

If database tasks fail:
1. Verify database credentials in `.env`
2. Ensure MySQL is running
3. Test connection manually using a MySQL client

## Claude Code Integration

This project includes Claude Code configuration in `.claudecodeignore` to optimize AI assistance.

## Support

For issues or questions:
1. Check the documentation in the `docs/` folder
2. Review test examples in `cypress/e2e/`
3. Consult the Cypress documentation at https://docs.cypress.io
