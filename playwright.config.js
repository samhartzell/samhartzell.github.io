const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.js",
  use: {
    baseURL: "file://" + __dirname + "/",
  },
  projects: [
    {
      name: "Desktop",
      use: { viewport: { width: 1280, height: 720 } },
    },
    {
      name: "Tablet",
      use: { viewport: { width: 768, height: 1024 } },
    },
    {
      name: "Mobile",
      use: { viewport: { width: 375, height: 667 } },
    },
  ],
});
