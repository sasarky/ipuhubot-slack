// Description:
//   Mecab Test
//

var mecab = require('mecab-async');

module.exports = function(robot) {
  robot.hear(/(.*)/i, function(msg) {
    if (msg.envelope.room == 'ipukun_school') {
      mecab.parse(msg.message.text, function(err, result) {
        if (err) {
          throw err;
        }
        msg.send(result);
      });
    }
  });
}
