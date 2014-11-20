var printf = require('printf');
var _ = require('underscore');

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

var Room = function(){
}

Room.prototype.show =  function(callback) {
  var cb = _.debounce(function(message) {
    callback(message);
  }, 1000);

  client.get('hubot:room_talk_count', function(err, val) {
    var val = JSON.parse(val);
    var message = '';
    _.map(val, function(count, room_name) {
      message = printf('%s\n%s: %s', message, room_name, count);
      cb(message);
    });
  });
};

Room.prototype.addMessage= function(room) {
  client.get('hubot:room_talk_count', function(err, val) {
    var val = JSON.parse(val);
    if (val == null) {
      val = {};
    }
    if (val[room] == null) {
      val[room] = 1;
    } else {
      val[room]++;
    }
    client.set('hubot:room_talk_count', JSON.stringify(val));
  });
};

Room.prototype.harfCount = function() {
  var cb = _.debounce(function(val) {
    console.log(val);
    client.set('hubot:room_talk_count', JSON.stringify(val));
  }, 1000);

  client.get('hubot:room_talk_count', function(err, val) {
    var val = JSON.parse(val);
    _.map(val, function(count, room) {
      var count = count / 2;
      if (count > 1) {
        val[room] = Math.floor(count);
      } else {
        delete val[room];
      }
      cb(val);
    });
  });
};

module.exports = new Room
