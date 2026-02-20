const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.js",
  use: {
    baseURL: "file://" + __dirname + "/",
  },
  projects: [
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Tablet",
      use: { viewport: { width: 768, height: 1024 } },
    },
    {
      name: "Mobile",
      use: { ...devices["iPhone 13"] },
    },
  ],
});
