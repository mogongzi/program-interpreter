const assert = require("assert");

module.exports = (eva) => {
  assert.strictEqual(eva.eval([
    ['begin',
      ]
  ]), 20);
};
