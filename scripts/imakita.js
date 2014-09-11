var _ = require('underscore');
var printf = require('printf')

var url = require("url");
var redis = require('redis');
var client;
if (process.env.REDISTOGO_URL) {
  var rtg = url.parse(process.env.REDISTOGO_URL);
  client = redis.createClient(rtg.port, rtg.hostname);
  client.auth(rtg.auth.split(":")[1]);
} else {
  client = redis.createClient();
}

module.exports = function(robot) {
  // BOT の名前とってきたい
  robot.hear(/^[^(ipukun)].*$/, function(msg) {
    var user_name = msg.message.user.name;
    var key = printf('hubot:imakita:%s', msg.message.room);
    client.get(key, function(err, val) {
      val = JSON.parse(val);
      if (val == null) {
        val = [];
      }
      val.push(user_name + ": " + msg.message.text);

      if (val.length > 100) {
        val.shift();
      }
      client.set(key, JSON.stringify(val));
    });
  });

  robot.respond(/imakita$/i, function(msg) {
    var key = printf('hubot:imakita:%s', msg.message.room);
    client.get(key, function(err, val) {
      val = JSON.parse(val);
      var sangyo = _.sample(val, 3);
      _.each(sangyo, function(v) {
        msg.send(v);
      });
    });
  });
}
