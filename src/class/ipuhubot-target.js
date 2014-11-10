// Description:
//   Target

var printf = require('printf');
var request = require('request');
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

var Target = function(){
}

Target.prototype.set =  function(user, target, callback) {
  key = 'hubot:target';
  client.get(key, function(err, val) {
    var targets = {};
    if (val) {
      targets = JSON.parse(val);
    }
    targets[user] = {
      'title': target
    };
    client.set(key, JSON.stringify(targets));
    var result = {
      'status': 'success'
    };
    callback(result);
  });
};

Target.prototype.list =  function(callback) {
  key = 'hubot:target';
  client.get(key, function(err, val) {
    var targets = {};
    if (val) {
      targets = JSON.parse(val);
    }
    callback(targets);
  });
};

module.exports = new Target
