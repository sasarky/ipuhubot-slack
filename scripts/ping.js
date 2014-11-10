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

  robot.hear(/.*/i, function(msg) {
    room = msg.message.room;
    client.get('hubot:room_talk_count', function(err, val) {
      val = JSON.parse(val);
      if (val == null) {
        val = {};
      }
      if (val[room] == null) {
        val[room] = 1;
      } else {
        val[room]++;
      }
      client.set('hubot:room_talk_count', JSON.stringify(val));
    });
  });

  robot.respond(/ROOMS$/i, function(msg) {
    client.get('hubot:room_talk_count', function(err, val) {
      val = JSON.parse(val);
      _.map(val, function(count, room_name) {
        msg.send(room_name + ": " + count);
      });
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

  robot.hear(/nemui|眠い/, function(msg) {
    msg.send('無理しないで寝よっ！');
  });

  robot.hear(/疲れた|つかれた/, function(msg) {
    msg.send('お疲れ様！ https://raw.githubusercontent.com/sasarky/ipuhubot/master/images/99.png');
  });

  robot.hear(/ひま|暇/, function(msg) {
    request.get("https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://b.hatena.ne.jp/hotentry/it.rss", function(error, response, body) {
      if (response.statusCode == 200) {
        data = msg.random(JSON.parse(body).responseData.feed.entries)
        msg.send("これでも読んでみたら？\n " + data.title + "\n" + data.link)
      } else {
        msg.send('error');
      }
    });
  });

  robot.respond(/AME$/i, function(msg) {
    msg.send("http://agora.ex.nii.ac.jp/digital-typhoon/radar/graphics/east-i.jpg");
  });

  robot.respond(/ohayo$/i, function(msg) {
    msg.send("おはよう!");
  });

  robot.hear(/^(.*\s)?(\w*)([\+|\-]{2})$/i, function(msg) {
    if (msg.match[1]) {
      user = msg.match[1].replace(/[\s|\:]/g, '');
    } else {
      user = msg.message.user.name;
    }
    word = msg.match[2];
    op = msg.match[3][0]
    key = printf("hubot:%s:%s", word, user);
    client.get(key, function(err, val) {
      expression = printf("lv = %d %s %d", Number(val), op, 1);
      eval(expression);
      msg.send(printf("%s の %s LV : %d", user, word, lv));
      client.set(key, lv);
    });
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

  robot.respond(/EVENT\s(.*)$/i, function(msg) {
    d = new Date;
    ym = printf('%d%02d', d.getYear()+ 1900, d.getMonth() + 1);
    key = printf('http://connpass.com/api/v1/event/?keyword=%s&ym=%s', msg.match[1], ym);
    request.get(key, function(error, response, body) {
      event = msg.random(JSON.parse(body).events);
      msg.send(printf("%s ( %s )", event.title, event.event_url));
    });
  });

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
    request.get("http://zekkei-switch.herokuapp.com/locations/fetch_location.json", function(error, response, body) {
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
