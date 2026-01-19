const { defineConfig } = require('cypress');

module.exports = defineConfig({
  // Global settings
  defaultCommandTimeout: 20000,
  chromeWebSecurity: false,
  projectId: "b68ot7",

  // Reporter configuration (using cypress-mochawesome-reporter)
  reporter: "cypress-mochawesome-reporter",

  // Global retries
  retries: {
    runMode: 1,
    openMode: 0
  },

  e2e: {
    baseUrl: 'https://your-hub-application.com',
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: true,
    screenshotOnRunFailure: true,
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 30000,
    experimentalSessionAndOrigin: true,

    // Spec pattern for test files
    specPattern: 'cypress/e2e/**/*.cy.js',

    env: {
      // Checkout URL (from your previous project)
      url: 'https://circuly-checkout-development.herokuapp.com/en/',

      // Shopify configuration
      shopify_base_url: 'https://your-shopify-store.myshopify.com',
      shopify_admin_url: 'https://your-shopify-store.myshopify.com/admin',
      shopify_api_url: 'https://your-shopify-store.myshopify.com/admin/api/2024-01',

      // Database configuration (for MySQL)
      db_host: 'localhost',
      db_user: 'your_db_user',
      db_password: 'your_db_password',
      db_name: 'hub_database',

      // PostgreSQL configuration (from your previous project)
      pg_user: 'XYZZZZZ',
      pg_password: 'XYZZZZZ',
      pg_host: 'XYZ',
      pg_database: 'postgres',
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
            user: config.env.pg_user || "XYZZZZZ",
            password: config.env.pg_password || "XYZZZZZ",
            host: config.env.pg_host || "XYZ",
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
