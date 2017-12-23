module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  env: {
    browser: true
  },
  rules: {
    "no-unused-vars": ["error", { "vars": "all", "args": "none", "ignoreRestSiblings": false }],
    "no-console": ["error", { allow: ["warn", "error"] }],
    "no-fallthrough": ["error", { "commentPattern": "break[\\s\\w]*omitted" }],
    "semi": ["warn", "always", { "omitLastInOneLineBlock": true}],
    "no-extra-semi": "off"
  },
  globals: {
    moment: true,
    $: true,
    google: true,
  }
};
