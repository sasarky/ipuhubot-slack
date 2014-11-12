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

Qiita.prototype.getEntryUsers = function(callback) {
  key = 'hubot:qiita:users';
  client.get(key, function(err, val) {
    callback(JSON.parse(val));
  });
};

Qiita.prototype.getUser = function(name, callback) {
  Qiita.prototype.getEntryUsers(function(users) {
    // {{{ validation
    // user が誰も居ない時
    if (!users) {
      callback({
        status: 'failed',
        message: 'not entry'
      });
      return;
    }

    // 自分が entry していない時 (method にしてもいいかも)
    if (!users[name]) {
      callback({
        status: 'failed',
        message: 'not entry'
      });
      return;
    }
    // }}}

    callback(users[name]);
  });
};

Qiita.prototype.selectEnemyUser = function(user, callback) {
  Qiita.prototype.getEntryUsers(function(users) {
    // {{{ validation
    // user が誰も居ない時
    if (!users) {
      callback({
        status: 'failed',
        message: 'not entry'
      });
      return;
    }

    // 自分が entry していない時 (method にしてもいいかも)
    if (!users[user]) {
      callback({
        status: 'failed',
        message: 'not entry'
      });
      return;
    }
    // 自分は除く
    var my_user = users[user];
    delete(users[user]);

    // 自分以外がエントリーしていないとき
    if (Object.keys(users).length == 0) {
      callback({
        status: 'failed',
        message: 'not entry'
      });
      return;
    }
    // }}}

    // ランダムで選ぶ
    callback(_.sample(users));
  });
};

Qiita.prototype.getItem = function(user, callback) {
  var qiita_name = user.qiita_user;
  var qiita_api = printf('https://qiita.com/api/v1/users/%s/items', qiita_name);
  request.get(qiita_api, function(err, res, body) {
    callback(_.sample(JSON.parse(body)));
  });
};

module.exports = new Qiita
