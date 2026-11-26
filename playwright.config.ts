import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:4173";
const chromium = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const launchOptions = {
  executablePath: chromium,
  args: [
    "--enable-webgl",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
};

export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  workers: 2,
  use: { baseURL, trace: "retain-on-failure" },
  projects: [
    {
      name: "desktop",
      testIgnore: ["**/mobile.spec.ts", "**/safari.spec.ts"],
      use: { ...devices["Desktop Chrome"], launchOptions },
    },
    {
      name: "mobile",
      testMatch: "**/mobile.spec.ts",
      use: { ...devices["Pixel 7"], launchOptions },
    },
    {
      name: "iphone-safari-emulation",
      testMatch: "**/safari.spec.ts",
      use: { ...devices["iPhone 13"], browserName: "webkit" },
    },
  ],
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 4173",
    url: baseURL,
    env: {
      SMTP_USER: "",
      SMTP_APP_PASSWORD: "",
      CONTACT_RECEIVER_EMAIL: "",
    },
    timeout: 30_000,
  },
});
