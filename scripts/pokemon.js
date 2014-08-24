// Description:
//   Pokemon
//
// Commands:
//   hubot battle - do battle

var pokemon = require('../src/class/ipuhubot-pokemon')
var _ = require('underscore');
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
  robot.respond(/pokemon\srank$/i, function(msg) {
    pokemon.getDamageRank(function(err, body) {
      msg.send(body.key.replace(/hubot:dekaipu:damage:/, '') + ": " + body.damage)
    });
  });

  robot.respond(/pokemon\scenter$/i, function(msg) {
    user_name = msg.message.user.name;
    async.waterfall([
      function(callback) {
        pokemon.checkLock(function(err, lock) {
          if (lock != "false" && lock != null) {
            msg.send("だれかが操作中ですわ。明後日きやがれ");
            return;
          } else {
            pokemon.lock(user_name, function(err, result) {
              setTimeout(function() {
                callback(null);
              }, 1000);
            });
          }
        })
      },
      function(callback) {
        pokemon.getUserInfo(user_name, function(err, info) {
          if (info.money < 100) {
            msg.send(printf("金もってねえやつはくんな！"));
            pokemon.unlock(function(err, result) {
              return;
            });
          } else {
            msg.send(printf("いらっしゃいませ。一回100円です"));
            info.money = Number(info.money) - 100;
            setTimeout(function() {
              callback(null, info);
            }, 1000);
          }
        });
      },
      function(info, callback) {
        pokemon.getParty(user_name, function(err, party) {
          party = JSON.parse(party);
          Object.keys(party).forEach(function(key) {
            mon = party[key];
            mon.hp = mon.max_hp;
            pokemon.setPokemonInfo(user_name, mon, function(err, result) {
            });
          });
          setTimeout(function() {
            callback(null, info);
          }, 1000);
        });
      },
      function(info, callback) {
        msg.send("回復しました");
        pokemon.setUserInfo(user_name, info, function(err, result) {
          pokemon.unlock(function(err, result) {
            return;
          });
        });
      },
    ]);
  });

  robot.respond(/pokemon\sbattle$/i, function(msg) {
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

  robot.respond(/pokemon\sstatus$/i, function(msg) {
    user_name = msg.message.user.name;
    pokemon.getUserInfo(user_name, function(err, info) {
      msg.send(printf("%s の情報\n所持金: %s円\nバッジ数: %s", user_name, info.money, 0));
    });
  });

  // New Pokemon
  robot.respond(/pokemon\sparty$/i, function(msg) {
    user_name = msg.message.user.name;
    msg.send(user_name + " のパーティ");
    pokemon.getParty(user_name, function(err, party) {
      party = JSON.parse(party);
      Object.keys(party).forEach(function (key) {
        mon = party[key];
        pokemon.getPokemonImg(mon.name, function(err, img) {
          msg.send(printf("%s [LV: %s][HP: %s/%s][ATK: %s, DEF: %s, SP_ATK: %s, SP_DEF: %s, SPD: %s]\n%s", mon.name, mon.lv, mon.hp, mon.max_hp, mon.attack, mon.defense, mon.sp_atk, mon.sp_def, mon.speed, img));
        });
      });
    });
  });

  // 最初のポケモンを手に入れられるやつ
  robot.respond(/pokemon\sokido$/i, function(msg) {
    key = 'okido';
    user_name = msg.message.user.name;

    async.waterfall([
      // チュートリアルチェック
      function(callback) {
        pokemon.getUserInfo(user_name, function(err, info) {
          if (info == null) {
            callback(null);
          } else if (info.tutorial == true) {
            msg.send("お前さんはすでにポケモンを手に入れているようじゃ");
            return;
          } else {
            callback(null);
          }
        });
      },
      // 操作チェック
      function(callback) {
        pokemon.checkLock(function(err, lock) {
          if (lock != "false" && lock != null) {
            msg.send("おっと誰かが操作中のようじゃ");
            return;
          } else {
            pokemon.lock(user_name, function(err, result) {
              setTimeout(function() {
                callback(null);
              }, 1000);
            });
          }
        })
      },
      // 選択中
      function(callback) {
        // ふしぎだね、ぜにがめ、ひとかげ
        firstPokemons = [1, 4, 7];
        msg.send(printf("%s 君よ、最初のポケモンはこいつらじゃ\n好きなポケモンの番号を選ぶのじゃ", user_name));
        firstPokemons.forEach(function(i) {
          url = printf("api/v1/pokemon/%s", i);
          pokemon.getPokemonInfo(url, function(err, mon) {
            pokemon.getPokemonImg(mon.name, function(err, img) {
              msg.send(printf("%s: %s\n%s", i, mon.name, img));
            });
          });
        });
        callback(null);
      },
    ])
  });

  robot.respond(/pokemon\sokido\sselect\s(.*)$/i, function(msg) {
    user_name = msg.message.user.name;

    async.waterfall([
      // 操作チェック
      function(callback) {
        pokemon.checkLock(function(err, lock) {
          if (lock == null || lock == false || lock == "false") {
            msg.send(printf("%s よ！ こういうものには つかいどきが あるのじゃ！", user_name));
            return;
          } else if (lock == user_name) {
            callback(null);
          } else {
            msg.send("おっと誰かが操作中のようじゃ");
            return;
          }
        });
      },
      // 一応チュートリアルチェック (こないはずだけど)
      function(callback) {
        pokemon.getUserInfo(user_name, function(err, info) {
          if (info == null) {
            callback(null);
          } else if (info.tutorial == true) {
            msg.send("お前さんはすでにポケモンを手に入れているようじゃ");
            // デッドロックしないようにするために unlock する
            pokemon.unlock(function(err, result) {
              return;
            });
          } else {
            callback(null);
          }
        });
      },
      // 番号チェック
      function(callback) {
        select_num = Number(msg.match[1]);
        if ([1, 4, 7].indexOf(select_num) != -1) {
          pokemon.getPokemon(user_name, select_num, function(err, result, mon) {
            if (result == "success") {
              msg.send("やった！" + mon.name + " をゲットしたぞ！");
            }
            callback(null);
          });
        } else {
          msg.send("その番号は無効じゃ。。。ゲームオーバーじゃ!!!");
        }
      },
      function(callback) {
        pokemon.setTutorial(user_name, function(err, result) {
          callback(null);
        });
      },
      // 最後にロックを外す
      function(callback) {
        pokemon.unlock(function(err, result) {
          callback(null);
        });
      },
    ])
  });

  robot.respond(/pokemon\sbouken$/i, function(msg) {
    user_name = msg.message.user.name;

    async.waterfall([
      // 操作チェック
      function(callback) {
        pokemon.checkLock(function(err, lock) {
          if (lock != "false" && lock != null) {
            msg.send("おっと誰かが操作中じゃ");
            return;
          } else {
            pokemon.lock(user_name, function(err, result) {
              setTimeout(function() {
                callback(null);
              }, 1000);
            });
          }
        });
      },
      function(callback) {
        pokemon.getUserInfo(user_name, function(err, info) {
          if (info == null || !info.tutorial) {
            msg.send("おーい！草むらに入っちゃいかーん！\nわしの研究所にくるのじゃ！");
            pokemon.unlock(function(err, result) {
              return;
            });
          } else {
            msg.send("さあ今日は冒険にでかけよう!");
            setTimeout(function() {
              callback(null);
            }, 1000);
          }
        });
      },
      function(callback) {
        pokemon.getMyPokemon(user_name, function(err, my_poke) {
          if (my_poke.hp <= 0 ) {
            msg.send("手持ちのポケモンが瀕死だ！ポケモンセンターにいって回復しよう");
            pokemon.unlock(function(err, result) {
              return;
            });
          } else {
            setTimeout(function() {
              callback(null, my_poke);
            }, 1000);
          }
        });
      },
      function(my_poke, callback) {
        // とりあえず今はランダムで
        pokemon.getPokemonRandom(function(err, enemy) {
          pokemon.getPokemonInfo(enemy.resource_uri, function(err, enemy_info) {
            pokemon.getPokemonImg(enemy.name, function(err, img) {
              pokemon.calculateStatus(enemy_info, 1, function(err, enemy_cal) {
                // 上書きしちゃう
                enemy_info.hp = enemy_cal.hp;
                enemy_info.attack = enemy_cal.attack;
                enemy_info.defense = enemy_cal.defense;
                enemy_info.sp_atk = enemy_cal.sp_atk;
                enemy_info.sp_def = enemy_cal.sp_def;
                enemy_info.speed = enemy_cal.speed;
                msg.send(printf("%s が現れた！\nHP:%s, ATK:%s, DEF:%s\n%s", enemy_info.name, enemy_info.hp, enemy_info.attack + enemy_info.sp_atk, enemy_info.defense + enemy_info.sp_def, img));
                setTimeout(function() {
                  callback(null, my_poke, enemy_info);
                }, 1000);
              });
            });
          });
        });
      },
      // 手持ちのポケモンを出す
      function(my_poke, enemy, callback) {
        pokemon.getPokemonImg(my_poke.name, function(err, img) {
          msg.send(printf("いけ! %s\nHP:%s, ATK:%s, DEF:%s\n%s", my_poke.name, my_poke.hp, my_poke.attack + my_poke.sp_atk, my_poke.defense + my_poke.sp_def, img));
          setTimeout(function() {
            callback(null, my_poke, enemy);
          }, 2000);
        });
      },
      function(my_poke, enemy, callback) {
        // とりあえず今は面倒なので足し算で済ませる
        my_poke_power = my_poke.attack + my_poke.defense + my_poke.sp_atk + my_poke.sp_def + my_poke.speed;
        enemy_power = enemy.attack + enemy.defense + enemy.sp_atk + enemy.sp_def + enemy.speed;
        if (my_poke_power > enemy_power) {
          my_poke.hp = Math.floor(my_poke.hp - (enemy_power / 10));
          if (my_poke.hp < 0) {
            my_poke.hp = 0;
          }
          msg.send(printf("やったぞ！バトルに勝利し%sの経験値をゲットした!", enemy.exp));
          pokemon.getExpTable(function(err, exp_table) {
            my_poke.exp = my_poke.exp + enemy.exp;
            if (my_poke.exp >= exp_table[my_poke.lv + 1]) {
              my_poke.lv = my_poke.lv + 1;
              msg.send(printf("%s は LV %s にあがった", my_poke.name, my_poke.lv));
              pokemon.calculateStatus(my_poke, my_poke.lv, function(err, cal_status) {
                my_poke.max_hp = cal_status.hp;
                my_poke.hp = cal_status.hp;
                my_poke.attack = cal_status.attack;
                my_poke.defense = cal_status.defense;
                my_poke.sp_atk = cal_status.sp_atk;
                my_poke.sp_def = cal_status.sp_def;
                my_poke.speed = cal_status.speed;
              });
            }
            setTimeout(function() {
              callback(null, my_poke, enemy, true);
            }, 2000);
          });
        } else {
          my_poke.hp = 0;
          msg.send("バトルに負けた。目の前が真っ暗になった");
          setTimeout(function() {
            callback(null, my_poke, enemy, false);
          }, 2000);
        }
      },
      function(my_poke, callback) {
        pokemon.setPokemonInfo(user_name, my_poke, function(err, result) {
          pokemon.unlock(function(err, result) {
            return;
          });
        });
      },
    ]);
  });


}
