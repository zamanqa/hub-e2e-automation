const { defineConfig } = require('cypress');

// Load environment variables from .env file
require('dotenv').config();

module.exports = defineConfig({
  projectId: "fenkjz",
  e2e: {
    baseUrl: null,
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: false,
    screenshotOnRunFailure: false,
    defaultCommandTimeout: 10000,

    setupNodeEvents(on, config) {
      require('./cypress/plugins/index.js')(on, config);

      // PostgreSQL database task
      on("task", {
        async queryDb(queryString) {
          const { Client } = require("pg");
          const pgConfig = {
            user: 'ZdFFUsWiIuILvub',
            password: 'rxoz32pYOeqYEAMVG263',
            host: 'circuly-development-v12.csmudpdd3zlm.eu-central-1.rds.amazonaws.com',
            database: 'postgres',
            ssl: false,
            port: 5432,
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

    specPattern: 'cypress/e2e/00-health-check/**/*.cy.js'
  }
});
