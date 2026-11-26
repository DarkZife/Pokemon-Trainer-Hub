import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Skip generated build files and installed dependencies.
  {
    ignores: ["dist/**", "node_modules/**"],
  },

  // Apply recommended checks to JavaScript files.
  js.configs.recommended,

  // Website scripts run in the browser.
  {
    files: ["src/scripts/**/*.js"],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // Tool configuration files run in Node.js.
  {
    files: ["vite.config.js", "eslint.config.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
]);