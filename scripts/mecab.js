// Description:
//   Mecab Test
//

var mecab = require('mecab-async');
var printf = require('printf');

module.exports = function(robot) {
  robot.hear(/(.*)/i, function(msg) {
    if (msg.envelope.room == 'ipukun_school') {
      mecab.parse(msg.message.text, function(err, result) {
        result.forEach(function(row) {
          msg.reply(printf("%s (%s)", row[0], row[1]));
        });
      });
    }
  });
}
