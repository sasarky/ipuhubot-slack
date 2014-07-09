// Description:
//   Messing around with the igr API.
// Commands:
//   hubot igr takizawa kudari - Return IGR滝沢駅下り時刻表
//   hubot igr morioka nobori - Return IGR滝沢駅上り時刻表
//   hubot igr morioka kudari - Return IGR盛岡駅下り時刻表
var igr = require('../src/class/ipuhubot-igr');

module.exports = function(robot) {
  robot.respond(/IGR (.+)$/i, function(msg) {
    items = msg.match[1].split(/\s+/);
    if(!items[0] || !items[1]){
      console.log("arg error");
      return;
    }

    igr.get(items[0],items[1], function(body) {
      if (!body) {
        msg.send("No igr No Life");
        return;
      }
      msg.send(body);
    });
  });
};