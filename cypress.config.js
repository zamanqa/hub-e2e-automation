const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://your-hub-application.com',
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 30000,
    
    env: {
      shopify_base_url: 'https://your-shopify-store.myshopify.com',
      shopify_admin_url: 'https://your-shopify-store.myshopify.com/admin',
      shopify_api_url: 'https://your-shopify-store.myshopify.com/admin/api/2024-01',
      
      db_host: 'localhost',
      db_user: 'your_db_user',
      db_password: 'your_db_password',
      db_name: 'hub_database',
    },
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require('./cypress/plugins/index.js')(on, config);
      return config;
    },
    
    retries: {
      runMode: 2,
      openMode: 0
    },
    
    reporterOptions: {
      reporterEnabled: 'mochawesome',
      mochawesomeReporterOptions: {
        reportDir: 'reports',
        overwrite: false,
        html: true,
        json: true,
        timestamp: 'mmddyyyy_HHMMss'
      }
    }
  }
});
