var github = require('githubot');
var _ = require('underscore');

module.exports = function(robot) {
  robot.respond(/EULER$/i, function(msg) {
    github.get("https://api.github.com/gists/2e2c97ed80e994c9286a", function (info) {
      problem = _.sample(info.files)
      url = printf("http://projecteuler.net/problem=%d", problem.filename);
      msg.send(problem.content + "\n\n" + url);
    });
  });
}
