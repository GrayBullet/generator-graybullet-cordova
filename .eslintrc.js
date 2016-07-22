module.exports = {
  extends: 'google',
  env: {
    node: true,
    jasmine: true
  },
  rules: {
    'space-before-function-paren': [1, {anonymous: 'always', named: 'never'}],
    'max-len': [1, 120]
  }
};
