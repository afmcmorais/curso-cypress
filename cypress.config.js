const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return {
        browsers: config.browsers.filter(browser => browser.name !== 'electron')
      }
    },
  },
  //defaultCommandTimeout: 1000
});
