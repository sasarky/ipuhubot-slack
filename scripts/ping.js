// Description:
//   Utility commands surrounding Hubot uptime.
//
// Commands:
//   hubot ping - Reply with pong
//   hubot echo <text> - Reply back with <text>
//   hubot time - Reply with current time
//   hubot whisper <channel> <txt> - send message to channel

var tenki = require('../src/class/ipuhubot-tenki');
var hachipi = require('../src/class/ipuhubot-hachipi');
var ipuhubot_target = require('../src/class/ipuhubot-target');
var ipuhubot_qiita = require('../src/class/ipuhubot-qiita');

var async = require('async');
var printf = require('printf');
var request = require('request');
var cheerio = require('cheerio-httpcli');
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

module.exports = function(robot) {
  robot.hear(/YO!$/i, function(msg) {
    users = robot.brain.data.users;
    delete users[1];
    key = msg.random(Object.keys(users));
    user = users[key].name;
    msg.send(user + ": YO!");
  });

  robot.respond(/QIITA\sENTRY(\s(.+))*$/i, function(msg) {
    var user = msg.message.user.name;
    var qiita_user = user;
    if (msg.match[2]) {
      qiita_user = msg.match[2];
    }
    ipuhubot_qiita.entry(user, qiita_user, function(result) {
      if (result.status == 'success') {
        msg.send('Qiita Battle にエントリーしたよ!');
      }
    });
  });

  robot.respond(/QIITA\sBATTLE$/i, function(msg) {
    var user_name = msg.message.user.name;
    ipuhubot_qiita.getUser(user_name, function(user) {
      ipuhubot_qiita.selectEnemyUser(user_name, function(enemy) {
        ipuhubot_qiita.getItem(user, function(my_item) {
          ipuhubot_qiita.getItem(enemy, function(enemy_item) {
            if (my_item.stock_count > enemy_item.stock_count) {
              user.battle_result = 'winner';
              enemy.battle_result = 'loser';
            } else if (my_item.stock_count < enemy_item.stock_count) {
              user.battle_result = 'loser';
              enemy.battle_result = 'winner';
            } else {
              user.battle_result = 'draw';
              enemy.battle_result = 'draw';
            }
            msg.send(printf(
              '[%s : %s] %s : %s ( %s )\n[%s : %s] %s : %s ( %s )',
              user.battle_result, my_item.stock_count, user.name, my_item.title, my_item.url,
              enemy.battle_result, enemy_item.stock_count, enemy.name, enemy_item.title, enemy_item.url
            ));
          });
        });
      });
    });
  });

  robot.respond(/TARGET\sSET\s(.+)*$/i, function(msg) {
    var user = msg.message.user.name;
    if (msg.match[1]) {
      var target = msg.match[1];
      ipuhubot_target.set(user, target, function(result) {
        if (result.status == 'success') {
          msg.send('目標設定に成功したよ!\n目標の見方: ipukun target list');
        }
      });
    }
  });

  robot.respond(/TARGET\sLIST$/i, function(msg) {
    ipuhubot_target.list(function(targets) {
      var message = '';
      _.each(targets, function(target, user) {
        message = message + printf('%s: %s', user, target.title);
      });
      msg.send(message);
    });
  });

  robot.respond(/TENKI(\s(.+))*$/i, function(msg) {
    var place = 'tokyo'; // default は tokyo にしておこう
    if (msg.match[2]) {
      place = msg.match[2];
      // morioka が morioka-shi で takizawa がないから矯正
      if (place == 'morioka' || place == 'takizawa') {
        place = 'morioka-shi'
      }
    }

    tenki.get(place, function(view_msg) {
      msg.send(view_msg);
    });
  });

  robot.respond(/HACHIPI\sADD\s(.*)\s(.*)$/i, function(msg) {
    user = msg.message.user.name;
    key = msg.match[1];
    description = msg.match[2];

    if (!key || !description) {
      msg.send('Error!');
      return;
    }

    hachipi.add(user, key, description, function(result) {
      if (result.status == 'success') {
        msg.send(printf('アンケートを用意したよ!\nDescription: %s\nアンケートの答え方: ipukun hachipi answer %s "内容"', result.survey.description, key));
      } else {
        msg.send(printf('Error: %s', result.message));
      }
    });
  });

  robot.respond(/HACHIPI\sANSWER\s(.*)\s(.*)$/i, function(msg) {
    user = msg.message.user.name;
    key = msg.match[1];
    answer = msg.match[2];

    if (!key || !answer) {
      msg.send('Error!');
      return;
    }

    hachipi.answer(user, key, answer, function(result) {
      if (result.status == 'success') {
        msg.send(printf('%s のアンケートに答えたよ!\nアンケートの結果の見方: ipukun hachipi show %s', result.survey.description, key));
      } else {
        msg.send(printf('Error: %s', result.message));
      }
    });
  });

  robot.respond(/HACHIPI\sSHOW\s(.*)$/i, function(msg) {
    key = msg.match[1];

    hachipi.show(key, function(result) {
      if (result) {
        var message = '';
        _.each(result.answers, function(answer, user) {
          message = message + printf('%s: %s\n', user, answer.message);
        });
        msg.send(printf('%s の結果だよ!\n%s', result.description, message));
      } else {
        msg.send('そんな質問ないよ！');
      }
    });
  });

  robot.hear(/kikkake$/i, function(msg) {
    var url = 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://rss.dailynews.yahoo.co.jp/fc/rss.xml&num=10'
    request.get(url, function(err, res, body) {
      entry = _.sample(JSON.parse(body)['responseData']['feed']['entries']);
      msg.send("あ！そうそう！「" + entry.title + "」らしいですよ！\n" + entry.link);
    });
  });

  robot.respond(/TIME$/i, function(msg) {
    // XXX:moment hogehoge を使いたい
    d = new Date;
    hour = d.getHours();
    minute = d.getMinutes();
    img = printf("http://www.bijint.com/iwate/tokei_images/%02d%02d.jpg", hour, minute);
    msg.send(img);
  });

  robot.respond(/DIE$/i, function(msg) {
    if(robot.auth.hasRole(msg.envelope.user,'admin')) {
      msg.send("Goodbye, cruel world.");
      process.exit(0);
    } else {
      msg.send("you dont have admin role");
    }
  });


  robot.respond(/whisper (.*) (.*)$/i, function(msg) {
    room = msg.match[1];
    kotoba = msg.match[2];
    robot.messageRoom(room, kotoba);
  });

  robot.respond(/AME$/i, function(msg) {
    msg.send("http://agora.ex.nii.ac.jp/digital-typhoon/radar/graphics/east-i.jpg");
  });

  /* 一時停止
  robot.respond(/(\w+)\sRANK$/i, function(msg) {
    word = msg.match[1];
    redis_key = printf("hubot:%s:*", msg.match[1]);
    client.keys(redis_key, function(err, keys) {
      _.each(keys, function(key) {
        client.get(key, function(err2, val) {
          msg.send(key.replace(printf("hubot:%s:", word), '') + " : " + val);
        });
      });
    });
  });
  */

  robot.respond(/QIITA\sRANK$/i, function(msg) {
    users = ['sasarkyz', '7kaji', 'otukutun', 'isseium', 'n0bisuke', 'te2ka', 's4shiki', 'canno', 'ganezasan'];
    users.forEach(function(user) {
      url = "http://qiita.com/" + user;
      cheerio.fetch(url, {}, function (err, $, res){
        count = $('.second-line')[0].children[1].children[0].data;
        msg.send(user + ": " + count);
      });
    });
  });

  robot.respond(/zekkei$/i, function(msg) {
    var url = "http://zekkei-switch.herokuapp.com/locations/fetch_location.json";
    request.get(url, function(error, response, body) {
      if (response.statusCode == 200) {
        data = JSON.parse(body);
        msg.send(printf("%s\n%s\n%s", data.name, data.description, data.photo));
      } else {
        msg.send('error');
      }
    });
  });

  robot.respond(/zekkei\squestion$/i, function(msg) {
    request.get("http://zekkei-switch.herokuapp.com/locations/fetch_location.json", function(error, response, body) {
      if (response.statusCode == 200) {
        data = JSON.parse(body);
        msg.send(printf("ここどーこだ？\n%s", data.photo));
        client.set('hubot:zekkei:question', data.name);
      } else {
        msg.send('error');
      }
    });
  });

  robot.respond(/zekkei\sanswer\s(.*)$/i, function(msg) {
    client.get('hubot:zekkei:question', function(err, val) {
      ans = msg.match[1];
      if (ans == val) {
        msg.send('ぴんぽーん！');
      } else {
        msg.send(printf('ぶぶー！答えは %s でしたー！', val));
      }
    });
  });
}
