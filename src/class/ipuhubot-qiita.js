// Description:
//   Qiita

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

var Qiita = function(){
}

Qiita.prototype.entry =  function(user, qiita_user, callback) {
  key = 'hubot:qiita:users';
  client.get(key, function(err, val) {
    var users = {};
    if (val) {
      users = JSON.parse(val);
    }
    // すでにエントリーしていた時
    if (users[user]) {
      var result = {
        status: 'failed',
        message: 'user is already entried'
      }
      callback(result);
      return;
    }
    users[user] = {
      name: user,
      qiita_user: qiita_user
    };
    var result = {
      status: 'success'
    };
    client.set(key, JSON.stringify(users));
    callback(result);
  });
};

Qiita.prototype.battle =  function(user, callback) {
  key = 'hubot:qiita:users';
  client.get(key, function(err, val) {
    if (val) {
      var users = JSON.parse(val);
      if (!users[user]) {
        var result = {
          status: 'failed',
          message: 'not entry'
        };
        callback(result);
        return;
      }
      // 自分は除く
      var my_user = users[user];
      delete(users[user]);
      if (Object.keys(users).length == 0) {
        var result = {
          status: 'failed',
          message: 'not entry'
        };
        callback(result);
        return;
      }
      var enemy_user = _.sample(users);
      var qiita_api = printf('https://qiita.com/api/v1/users/%s/items', my_user.qiita_user);
      request.get(qiita_api, function(err, res, body) {
        my_item = _.sample(JSON.parse(body));

        var qiita_api = printf('https://qiita.com/api/v1/users/%s/items', enemy_user.qiita_user);
        request.get(qiita_api, function(err, res, body) {
          enemy_item = _.sample(JSON.parse(body));

          var result = {
            status: 'success',
            my_user: my_user,
            my_item: my_item,
            enemy_user: enemy_user,
            enemy_item: enemy_item
          }
          callback(result);
        });
      });
    } else {
      var result = {
        status: 'failed',
        message: 'no entry'
      };
      callback(result);
    }
  });
};

module.exports = new Qiita
