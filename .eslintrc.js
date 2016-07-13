module.exports = {
  extends: 'google',
  env: {
    jasmine: true
  },
  rules: {
    'space-before-function-paren': [
      2, {
        anonymous: 'always',
        named: 'never'
      }
    ]
  }
};
