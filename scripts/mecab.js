// Description:
//   Mecab Test
//

var mecab = require('mecab-async');
var printf = require('printf');

module.exports = function(robot) {
  robot.hear(/(.*)/i, function(msg) {
    if (msg.envelope.room == 'ipukun_school') {
      mecab.parse(msg.message.text, function(err, result) {
        // 単語ごとに区切ったやつであれこれ
        var sentence = [];
        result.forEach(function(word) {
          sentence.push(printf("%s(%s)", word[0], word[1]));
        });
        msg.reply(sentence);
      });
    }
  });
}
