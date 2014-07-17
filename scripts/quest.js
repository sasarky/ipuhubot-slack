// Description:
//   Quest
//
// Commands:
//   hubot quest - quest

var quest = require('../src/class/ipuhubot-quest')
var async = require('async')
var cronJob = require('cron').CronJob
var printf = require('printf')

module.exports = function(robot) {
  robot.respond(/quest\srank/i, function(msg) {
    pokemon.getDamageRank(function(err, body) {
      msg.send(body.key.replace(/hubot:quest:floor:/, '') + ": " + body.damage)
    });
  });

  robot.respond(/quest$/i, function(msg) {
    async.waterfall([
      // 冒険者登録 check
      function(callback) {
        quest.checkRegistration(msg.message.user.name, function(result) {
          if(!result) {
            msg.send("冒険者登録していない");
            return;
          }
          callback(null);
        });
      },
      // 体力 check
      function(callback) {
        quest.checkHP(function(hp) {
          if(hp <= 0) {
            msg.send("体力が足りない！");
            return;
          }
          callback(null);
        });
      },
      // すすむ
      function(callback) {
        quest.gogogo(function(attacker) {
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
    ]);
  });
}
