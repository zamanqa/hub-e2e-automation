const { defineConfig } = require('cypress');

// Load environment variables from .env file
require('dotenv').config();

module.exports = defineConfig({
  // Global settings
  defaultCommandTimeout: 20000,
  chromeWebSecurity: false,
  projectId: "fenkjz",

  // Reporter configuration (using cypress-mochawesome-reporter)
  reporter: "cypress-mochawesome-reporter",

  // Global retries
  retries: {
    runMode: 2,
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
      // Login credentials
      loginUrl: process.env.LOGIN_URL || 'https://hub.development.circuly.io/en/auth/login',
      testUserEmail: process.env.TEST_USER_EMAIL || 'super.admin@circuly.io',
      testUserPassword: process.env.TEST_USER_PASSWORD || 'Pa$$word131152489',

      // Company IDs
      circuly_shopify_stripe: process.env.circuly_shopify_stripe || 'circuly shopify stripe',

      // Checkout URL (from your previous project)
      url: 'https://circuly-checkout-development.herokuapp.com/en/',

      // PostgreSQL configuration (from your previous project)
      pg_user: 'ZdFFUsWiIuILvub',
      pg_password: 'rxoz32pYOeqYEAMVG263',
      pg_host: 'circuly-development-v12.csmudpdd3zlm.eu-central-1.rds.amazonaws.com',
      pg_database: 'postgres',
      ssl: false,
      pg_port: 5432,
    },

    setupNodeEvents(on, config) {
      // Mochawesome reporter plugin
      require("cypress-mochawesome-reporter/plugin")(on);

      // MySQL database tasks (existing)
      require('./cypress/plugins/index.js')(on, config);

      // PostgreSQL database task (from your previous project)
      on("task", {
        async queryDb(queryString) {
          const { Client } = require("pg");
          const pgConfig = {
            user: config.env.pg_user || "ZdFFUsWiIuILvub",
            password: config.env.pg_password || "rxoz32pYOeqYEAMVG263",
            host: config.env.pg_host || "development",
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
