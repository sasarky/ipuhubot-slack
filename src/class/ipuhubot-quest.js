// Description:
//   Quest

var async = require('async');
var request = require('request');
var printf = require('printf');
var _ = require('underscore');
var client = require('redis').createClient()

var Quest = function() {
}

// 冒険者登録確認
Quest.prototype.checkRegistration =  function(user, callback) {
  key = printf('hubot:quest:user:%s', user);
  client.get(key, function(err, val) {
    callback(val);
  });
}

/*
// ボーナスポイント
Pokemon.prototype.addBonusPoint = function(user_name, point) {
  damage_key = printf("hubot:dekaipu:damage:%s", user_name);
  client.get(damage_key, function(err, val2) {
    client.set(damage_key, Number(val2) + point)
  });
}

// でかいぷだす
Pokemon.prototype.buildDekaIPU = function(callback) {
  dekaipu_hp = 500;
  client.set('hubot:dekaipu:hp', dekaipu_hp);
  client.set('hubot:dekaipu:appeared', 'true');
  client.set('hubot:dekaipu:last_attacker', 'false');
  callback(dekaipu_hp);
}

// 最後の攻撃者を確認
Pokemon.prototype.checkLastAttacker = function(callback) {
  client.get('hubot:dekaipu:last_attacker', function(err, val) {
    callback(val);
  });
}

// でかいぷ消す
Pokemon.prototype.delDekaIPU = function(callback) {
  client.set('hubot:dekaipu:appeared', 'false');
}

// 攻撃する
Pokemon.prototype.doAttack = function(user_name, pokemon, callback) {
  client.get('hubot:dekaipu:hp', function(err, hp) {
    dekaipu_hp = Number(hp) - pokemon.attack;
    client.set('hubot:dekaipu:hp', dekaipu_hp);
    client.set('hubot:dekaipu:last_attacker', user_name);
    damage_key = printf("hubot:dekaipu:damage:%s", user_name);
    client.get(damage_key, function(err, val2) {
      client.set(damage_key, Number(val2) + pokemon.attack);
    });
    callback(err, dekaipu_hp);
  });
}

// ダメージランキング表示
Pokemon.prototype.getDamageRank = function(callback) {
  client.keys("hubot:dekaipu:damage:*", function(err, keys) {
    _.each(keys, function(key) {
      client.get(key, function(err2, damage) {
        var obj = {key: key, damage:damage};
        callback(null, obj);
      });
    });
  });
}

// ポケモン情報取得
Pokemon.prototype.getPokemonInfo = function(uri, callback) {
  url = printf("http://pokeapi.co/%s", uri);
  request.get(url, function(err, res, body) {
    callback(err, JSON.parse(body));
  });
}

// ランダムにポケモンを選ぶ
Pokemon.prototype.getPokemonRandom = function(callback) {
  url = printf("%s/api/v1/pokedex/", this.api);
  request.get(url, function(err, res, body) {
    pokemon = _.sample(JSON.parse(body).objects[0].pokemon);
    callback(err, pokemon);
  });
}

// ポケモン画像
Pokemon.prototype.getPokemonImg = function(name, callback) {
  img_api = printf("http://ajax.googleapis.com/ajax/services/search/images?q=%s&v=1.0", name);
  request.get(img_api, function(err, res, body) {
    img_url = JSON.parse(body).responseData.results[0].unescapedUrl;
    callback(err, img_url);
  });
}
*/

module.exports = new Quest
