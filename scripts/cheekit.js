// Description:
//   cheekit rinen
//
// Commands:
//   hubot cheekit

module.exports = function(robot) {
  robot.hear(/^cheekit$/, function(msg) {
    msg.send("make local happiness!");
  });
};
