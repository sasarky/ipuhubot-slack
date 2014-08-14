// Description:
//   Pokemon
//
// Commands:
//   hubot battle - do battle

var pokemon = require('../src/class/ipuhubot-pokemon')
var async = require('async')
var cronJob = require('cron').CronJob
var printf = require('printf')

module.exports = function(robot) {
  // ランダムで出現させる
  new cronJob('0 0 5 * * *', function() {
    async.waterfall([
      // でかいぷいるか取得
      function(callback) {
        pokemon.appearedDekaIPU(function(val) {
          callback(null, val);
        });
      },
      // 判断
      function(val, callback) {
        if (val == 'true') {
          robot.messageRoom("#ipuhubot", "誰か相手してよ。。。");
          return;
        } else {
          setTimeout(function() {
            callback(null);
          }, 1000);
        }
      },
      // 出す
      function(callback) {
        pokemon.buildDekaIPU(function(hp) {
          setTimeout(function() {
            var message = printf("ずずずずずずず\nでかいぷが現れた！！HP: %s\n http://www.nintendo.co.jp/3ds/balj/img/top/main_kirby.png", hp);
            robot.messageRoom("#ipuhubot", message);
          }, 1000);
        });
      }
    ]);
  }).start();

  // NOTE: ここは hogheoge rank と merge させたい
  robot.respond(/pokemon\srank/i, function(msg) {
    pokemon.getDamageRank(function(err, body) {
      msg.send(body.key.replace(/hubot:dekaipu:damage:/, '') + ": " + body.damage)
    });
  });

  robot.respond(/pokemon\sbattle/i, function(msg) {
    async.waterfall([
      // ランダムで手持ちのポケモン選ぶ
      function(callback) {
        pokemon.appearedDekaIPU(function(val) {
          if(val == 'false') {
            msg.send("でかいぷ君が現れていないぞ！");
            return;
          }
          callback(null);
        });
      },
      function(callback) {
        pokemon.checkLastAttacker(function(attacker) {
          if(msg.message.user.name == attacker) {
            msg.send("二回連続攻撃はできないぞ！");
            return;
          } else if(attacker == 'false') {
            // 初回 50 point ボーナス
            bonus = 50;
            msg.send(printf("初回攻撃ボーナス %d ポイントだ！", bonus));
            pokemon.addBonusPoint(msg.message.user.name, bonus);
          }
          callback(null);
        });
      },
      function (callback) {
        pokemon.getPokemonRandom(function(err, pokemon_info) {
          msg.send(printf("%s！君にきめた！", pokemon_info.name));
          setTimeout(function() {
            pokemon.getPokemonImg(pokemon_info.name, function(err, img) {
              msg.send(img);
            });
            callback(null, pokemon_info.resource_uri);
          }, 1000);
        });
      },
      // 選んだポケモンを戦わせる
      function(uri, callback) {
        pokemon.getPokemonInfo(uri, function(err, info) {
          body = printf("攻撃力: %d\n", info.attack);
          msg.send(body);
          setTimeout(function() {
            callback(null, info);
          }, 1000);
        });
      },
      function (info, callback) {
        pokemon.doAttack(msg.message.user.name, info, function(err, damage, crit, hp) {
          if (crit) {
            msg.send("おっと！急所にあたった！");
          }
          msg.send(printf("%d のダメージ！", damage));
          if (hp < 0) {
            bonus = 100;
            msg.send(printf("やった！でかいぷ君を倒したぞ！ボーナスで %d ポイントだ！", bonus));
            pokemon.delDekaIPU();
            // 討伐ポイント 100
            pokemon.addBonusPoint(msg.message.user.name, bonus);
          } else {
            msg.send(printf("でかいぷ君にダメージを与えた！残りHPは %d だぞ！", hp));
          }
        });
      }
    ]);
  });
}
