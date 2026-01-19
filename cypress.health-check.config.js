const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: null,
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: false,
    screenshotOnRunFailure: false,
    defaultCommandTimeout: 10000,

    setupNodeEvents(on, config) {
      require('./cypress/plugins/index.js')(on, config);
      return config;
    },

    specPattern: 'cypress/e2e/00-health-check/**/*.cy.js'
  }
});
