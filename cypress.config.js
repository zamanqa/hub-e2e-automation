const { defineConfig } = require('cypress');

// Load environment variables from .env file
require('dotenv').config();

module.exports = defineConfig({
  // Global settings
  defaultCommandTimeout: 20000,
  chromeWebSecurity: false,
  projectId: "ontjp9",

  // Reporter configuration (using cypress-mochawesome-reporter)
  reporter: "cypress-mochawesome-reporter",

  // Global retries
  retries: {
    runMode: 1,
    openMode: 0
  },

  e2e: {
    baseUrl: process.env.BASE_URL || 'https://hub.development.circuly.io/',
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: true,
    screenshotOnRunFailure: true,
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 30000,

    // Spec pattern for test files
    specPattern: 'cypress/e2e/**/*.cy.js',

    env: {
      // Application URLs
      baseUrl: process.env.BASE_URL || 'https://hub.development.circuly.io/',
      loginUrl: process.env.LOGIN_URL || 'https://hub.development.circuly.io/en/auth/login',

      // Login credentials
      testUserEmail: process.env.TEST_USER_EMAIL || 'super.admin@circuly.io',
      testUserPassword: 'Pa$$word131152489',

      // Company IDs
      circuly_shopify_stripe: process.env.circuly_shopify_stripe || 'circuly shopify stripe',

      // Checkout URL
      url: 'https://circuly-checkout-development.herokuapp.com/en/',

      // PostgreSQL configuration
      pg_user: process.env.PG_USER,
      pg_password: process.env.PG_PASSWORD,
      pg_host: process.env.PG_HOST,
      pg_database: process.env.PG_DATABASE || 'postgres',
      ssl: false,
      pg_port: process.env.PG_PORT || 5432,
    },

    setupNodeEvents(on, config) {
      // Mochawesome reporter plugin
      require("cypress-mochawesome-reporter/plugin")(on);

      // PostgreSQL database task
      on("task", {
        async queryDb(queryString) {
          const { Client } = require("pg");
          const pgConfig = {
            user: config.env.pg_user,
            password: config.env.pg_password,
            host: config.env.pg_host,
            database: config.env.pg_database || "postgres",
            ssl: false,
            port: config.env.pg_port || 5432,
          };
          const client = new Client(pgConfig);
          await client.connect();
          const res = await client.query(queryString);
          await client.end();
          return res.rows;
        },
      });

      return config;
    },
  }
});
