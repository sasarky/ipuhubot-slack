// Description:
//   Mecab Test
//

var mecab = require('mecab-async');
var request = require('request');
var printf = require('printf');

module.exports = function(robot) {
  robot.hear(/(.*)/i, function(msg) {
    if (msg.envelope.room == 'ipukun_school') {
      request.post({url: 'http://sasarky.net:8888/talk', body: 'query=' + msg.match[0]}, function(err, res, body) {
        if (!err) {
          msg.reply(JSON.parse(body).text);
        } else {
          msg.reply('うまくいかなくてごめんね。。。')
        }
      });
    }
  });
}
