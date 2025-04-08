const js = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");

module.exports = [
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      globals: {
        process: "readonly",  // ✅ Fixes 'process' not defined
        console: "readonly",  // ✅ Fixes 'console' not defined
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "no-console": "off",  // ✅ Allows `console.log()`
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];
