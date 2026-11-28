import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Ignore build files and dependencies.
  {
    ignores: ["dist/**", "node_modules/**"],
  },

  // Recommended JavaScript checks.
  js.configs.recommended,

  // Browser scripts
  {
    files: ["src/scripts/**/*.js"],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // Node configuration files
  {
    files: ["vite.config.js", "eslint.config.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
]);