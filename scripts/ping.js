// Description:
//   Utility commands surrounding Hubot uptime.
//
// Commands:
//   hubot ping - Reply with pong
//   hubot echo <text> - Reply back with <text>
//   hubot time - Reply with current time
//   hubot whisper <channel> <txt> - send message to channel

var printf = require('printf');
var request = require('request');
var client = require('redis').createClient()
var _ = require('underscore');

module.exports = function(robot) {
  robot.hear(/YO!$/i, function(msg) {
    users = robot.brain.data.users;
    delete users[1];
    key = msg.random(Object.keys(users));
    user = users[key].name;
    console.log(user);
    msg.send(user + ": YO!");
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

  robot.hear(/^ISHIKI\+\+$/i, function(msg) {
    user = msg.message.user.name;
    key = "hubot:ishiki:" + user;
    client.get(key, function(err, val) {
      ishiki = Number(val) + 1;
      msg.send(user + " の意識Lv : " + ishiki);
      client.set(key, ishiki);
    });
  });

  robot.respond(/ISHIKI$/i, function(msg) {
    client.keys("hubot:ishiki:*", function(err, keys) {
      _.each(keys, function(key) {
        client.get(key, function(err2, ishiki) {
          msg.send(key.replace(/hubot:ishiki:/, '') + " : " + ishiki);
        });
      });
    });
  });

}
