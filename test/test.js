// test.js
var assert = require('assert');
var moduleMeigen = require('../src/class/ipuhubot-meigen');

describe('class/ipuhubot-meigen', function() { // {{{
  it('get', function(done) {
    moduleMeigen.get('test', function(res) {
      assert.ok(res);
      done();
    });
  });
});
// }}}
