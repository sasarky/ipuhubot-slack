// Description:
//   Messing around with the Meigen API.
//
// Commands:
//   hubot meigen  - Return meigen at random.

var meigen = require('../src/class/ipuhubot-meigen');
var printf = require('printf');

module.exports = function(robot) {
  robot.respond(/MEIGEN/i, function(msg) {
    meigen.get('', function(body) {
      if (body == 'error') {
        msg.send("No meigen No Life");
      } else {
        msg.send(printf('%s by %s\n%s', body.meigen, body.author, body.image));
      }
    });
  });
}
