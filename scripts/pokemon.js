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
var client = require('redis').createClient()

module.exports = function(robot) {
  /*
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
  */

  // NOTE: ここは hogheoge rank と merge させたい
  robot.respond(/pokemon\srank$/i, function(msg) {
    pokemon.getDamageRank(function(err, body) {
      msg.send(body.key.replace(/hubot:dekaipu:damage:/, '') + ": " + body.damage)
    });
  });

  robot.respond(/pokemon\scenter$/i, function(msg) {
    async.waterfall([
      function(callback) {
        pokemon.checkLock(function(err, lock) {
          if (lock != "false" && lock != null) {
            msg.send("だれかが操作中ですわ。明後日きやがれ");
            return;
          } else {
            user_name = msg.message.user.name;
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
            var mon = party[key];
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

  robot.respond(/pokemon\sdendo$/i, function(msg) {
    msg.send(printf("初代ポケモンチャンピオン: %s\n%s\n%s", "@otukutun", "数多のポケモントレーナーの中から毎朝、出勤前にコツコツと偽IPU君を倒し続けた。終盤の駆け引きでは彼の右に出るものはいない", "https://pbs.twimg.com/profile_images/3205530758/09e19e7c9299888f8de60030ff36b37e.png"));
  });

  robot.respond(/pokemon\sadmin\sunlock$/i, function(msg) {
    var user_name = msg.message.user.name;
    if (user_name == 'sasarky') {
      pokemon.unlock(function(err, result) {
        msg.send("unlock しました");
      });
    } else {
      msg.send("お前にはむりだ");
    }
  });

  robot.respond(/pokemon\sstatus$/i, function(msg) {
    var user_name = msg.message.user.name;
    pokemon.getUserInfo(user_name, function(err, info) {
      msg.send(printf("%s の情報\n所持金: %s円\nバッジ数: %s", user_name, info.money, 0));
    });
  });

  // New Pokemon
  robot.respond(/pokemon\sparty$/i, function(msg) {
    var user_name = msg.message.user.name;
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
    user_name = msg.message.user.name;
    console.log("test");
    msg.send("テスト");

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
        var firstPokemons = [1, 4, 7];
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
    var user_name = msg.message.user.name;

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
        var select_num = Number(msg.match[1]);
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
    var user_name;
    async.waterfall([
      // 操作チェック
      function(callback) {
        pokemon.checkLock(function(err, lock) {
          if (lock != "false" && lock != null) {
            msg.send("おっと誰かが操作中じゃ");
            return;
          } else {
            user_name = msg.message.user.name;
            pokemon.lock(user_name, function(err, result) {
              callback(null);
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
            pokemon.selectDungeon(user_name, function(err, dungeon) {
              msg.send(printf("さあ今日は %s にでかけよう!", dungeon.japanese_name));
              callback(null, dungeon);
            });
          }
        });
      },
      function(dungeon, callback) {
        // getMyPokemon の時点でステータス計算してても良いかも
        pokemon.getMyPokemon(user_name, function(err, my_poke) {
          if (my_poke.hp <= 0 ) {
            msg.send("手持ちのポケモンが瀕死だ！ポケモンセンターにいって回復しよう");
            pokemon.unlock(function(err, result) { return; });
          } else {
            callback(null, my_poke, dungeon);
          }
        });
      },
      function(my_poke, dungeon, callback) {
        // とりあえず今はランダムで
        enemy = dungeon.enemies[_.sample(Object.keys(dungeon.enemies))];
        pokemon.getPokemonInfo(enemy.resource_uri, function(err2, enemy_info) {
          pokemon.getPokemonImg(enemy.name, function(err3, img) {
            pokemon.calculateStatus(enemy_info, enemy.level, function(err, enemy_cal) {
              // 上書きしちゃう
              enemy_info.hp = enemy_cal.hp;
              enemy_info.attack = enemy_cal.attack;
              enemy_info.defense = enemy_cal.defense;
              enemy_info.sp_atk = enemy_cal.sp_atk;
              enemy_info.sp_def = enemy_cal.sp_def;
              enemy_info.speed = enemy_cal.speed;
              msg.send(printf("Lv %s の %s が現れた！\nHP:%s, ATK:%s, DEF:%s\n%s", enemy.level, enemy.japanese_name, enemy_info.hp, enemy_info.attack + enemy_info.sp_atk, enemy_info.defense + enemy_info.sp_def, img));
              setTimeout(function() {
                callback(null, my_poke, enemy_info);
              }, 1000);
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
          }, 1000);
        });
      },
      function(my_poke, enemy, callback) {
        // とりあえず今は面倒なので足し算で済ませる
        var my_poke_power = my_poke.attack + my_poke.defense + my_poke.sp_atk + my_poke.sp_def + my_poke.speed;
        var enemy_power = enemy.attack + enemy.defense + enemy.sp_atk + enemy.sp_def + enemy.speed;
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
              pokemon.checkEvolution(my_poke, function(err, result, info) {
                if (my_poke.lv >= result) {
                  msg.send(printf("おや %s の様子が。。。\nやったぞ！ %s は %s に進化した！！！", my_poke.name, my_poke.name, info.name));
                  pokemon.delPokemonInfo(user_name, my_poke.name, function(err, hoge) {
                    my_poke.name = info.name;
                    my_poke.resource_uri = info.resource_uri;
                    pokemon.calculateStatus(my_poke, my_poke.lv, function(err, cal_status) {
                      my_poke.name = info.name;
                      my_poke.max_hp = cal_status.hp;
                      my_poke.hp = cal_status.hp;
                      my_poke.attack = cal_status.attack;
                      my_poke.defense = cal_status.defense;
                      my_poke.sp_atk = cal_status.sp_atk;
                      my_poke.sp_def = cal_status.sp_def;
                      my_poke.speed = cal_status.speed;
                      setTimeout(function() {
                        callback(null, my_poke);
                      }, 1000);
                    });
                  });
                } else {
                  pokemon.calculateStatus(my_poke, my_poke.lv, function(err, cal_status) {
                    my_poke.max_hp = cal_status.hp;
                    my_poke.hp = cal_status.hp;
                    my_poke.attack = cal_status.attack;
                    my_poke.defense = cal_status.defense;
                    my_poke.sp_atk = cal_status.sp_atk;
                    my_poke.sp_def = cal_status.sp_def;
                    my_poke.speed = cal_status.speed;
                    setTimeout(function() {
                      callback(null, my_poke);
                    }, 1000);
                  });
                }
              });
            } else {
              setTimeout(function() {
                callback(null, my_poke);
              }, 1000);
            }
          });
        } else {
          my_poke.hp = 0;
          msg.send("バトルに負けた。目の前が真っ暗になった");
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
