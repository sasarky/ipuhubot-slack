// Description:
//   cheekit rinen
//
// Commands:
//   hubot cheekit

module.exports = function(robot) {
  robot.hear(/cheekit$/i, function(msg) {
    msg.send("make local hapiness!");
  });
};
