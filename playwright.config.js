const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.js",
  webServer: {
    command: "npx serve -l 3000 --no-clipboard",
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:3000",
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
