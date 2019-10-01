module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  plugins: ["@typescript-eslint"],
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-parameter-properties": "off",
    "@typescript-eslint/interface-name-prefix": ["error", "always"],
    "require-atomic-updates": "off",
    quotes: ["error", "double", { avoidEscape: true }],
    semi: ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "max-len": ["error", { code: 150 }],
    "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
  }
}
