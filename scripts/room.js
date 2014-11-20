// Description:
//   Channel Util Command
//
// Commands:

var printf = require('printf');
var _ = require('underscore');

var ipuhubot_room = require("../src/class/ipuhubot-room");

module.exports = function(robot) {
  robot.hear(/.*/i, function(msg) {
    room = msg.message.room;
    ipuhubot_room.addMessage(room);
  });

  robot.respond(/ROOMS$/i, function(msg) {
    ipuhubot_room.show(function(message) {
      msg.send(message);
    });
  });
}
