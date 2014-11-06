// Description:
//   Hachipi

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

var Hachipi = function(){
}

Hachipi.prototype.add =  function(user, key, description, callback) {
  key = printf('hubot:hachipi:%s', key);
  client.get(key, function(err, val) {
    if (val) {
      var result = {
        'status': 'failed',
        'message': 'key is duplicated'
      };
      callback(result);
    } else {
      var survey = {
        'owner': user,
        'description': description,
        'answers': {}
      };
      client.set(key, JSON.stringify(survey));
      var result = {
        'status': 'success',
        'survey': survey
      };
      callback(result);
    }
  });
};

Hachipi.prototype.answer =  function(user, key, answer, callback) {
  key = printf('hubot:hachipi:%s', key);
  client.get(key, function(err, val) {
    if (val) {
      var survey = JSON.parse(val);
      // 誰かが答えてる時
      if (survey.answers) {
        survey.answers[user] = {
          'message': answer
        };
      } else { // 誰も答えてないとき
        survey.answers = {};
        survey.answers[user] = {
          'message': answer
        }
      }
      client.set(key, JSON.stringify(survey));
      var result = {
        'status': 'success',
        'survey': survey
      };
      callback(result);
    } else {
      var result = {
        'status': 'failed',
        'message': 'key is undefined'
      };
      callback(result);
    }
  });
};

Hachipi.prototype.show =  function(key, callback) {
  key = printf('hubot:hachipi:%s', key);
  client.get(key, function(err, val) {
    callback(JSON.parse(val));
  });
};

module.exports = new Hachipi
