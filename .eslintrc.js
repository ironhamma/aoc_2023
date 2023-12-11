module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-restricted-syntax': 'off',
    'no-loop-func': 'off',
    'max-len': 'off',
    'no-plusplus': 'off',
    'no-restricted-globals': 'off',
    'no-console': 'off',
    'no-continue': 'off',
    'prefer-const': 'off',
    'arrow-parens': 'off',
  },
};
