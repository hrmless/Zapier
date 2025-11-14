module.exports = {
  extends: 'eslint:recommended',
  env: {
    node: true,
    es2020: true
  },
  rules: {
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-console': 'error'
  }
};