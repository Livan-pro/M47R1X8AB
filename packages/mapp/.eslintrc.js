module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: "@typescript-eslint/parser"
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
    "prettier/vue",
    "plugin:vue/recommended",
  ],
  plugins: [
    "prettier",
  ],
  // add your custom rules here
  rules: {
    "quotes": ["error", "double", { avoidEscape: true }],
    "vue/max-attributes-per-line": [2, {
      "singleline": 20,
      "multiline": {
        "max": 1,
        "allowFirstLine": false,
      },
    }],
    "vue/attribute-hyphenation": ["error", "never"],
  },
  overrides: [
    {
      files: ["app/**/*.ts", "app/**/*.vue", "types/*.d.ts"]
    }
  ],
}
