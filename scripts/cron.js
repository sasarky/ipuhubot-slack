// Description:
//   ipukun の Cronjob 機能
//

var cronJob = require('cron').CronJob;
var meigen = require('../src/class/ipuhubot-meigen');
var printf = require('printf');
var github = require('githubot');
var _ = require('underscore');

module.exports = function(robot) {
  send = function(room, msg) {
    robot.messageRoom(room, msg);
  }

  // {{{ Daily
  new cronJob('0 0 0 * * *', function() {
    send("#general", "夜更かししちゃだめだぞ");
  }).start();
  // }}}

  // {{{ WeekDay
  new cronJob('0 0 9 * * 1,2,3,4,5', function() {
    send("#general", "今日も一日がんばりましょー！");
    meigen.get('', function(body) {
      if (body == 'error') {
        send("#general", "No meigen No Life");
      } else {
        send("#general", printf('%s by %s\n%s', body.meigen, body.author, body.image));
      }
    })
  }).start();

  new cronJob('0 0 12 * * 1,2,3,4,5', function() {
    send("#general", "午後も張り切っていこー！");
  }).start();

  new cronJob('0 0 18 * * 1,2,3,4,5', function() {
    send("#general", "今日も一日お疲れ様！");
  }).start();

  new cronJob('0 0 8 * * 1,2,3,4,5', function() {
    github.get("https://api.github.com/gists/2e2c97ed80e994c9286a", function (info) {
      problem = _.sample(info.files)
      url = printf("http://projecteuler.net/problem=%d", problem.filename);
      send("#general", problem.content + "\n\n" + url);
    });
  }).start();
  // }}}

  new cronJob('0 0 8 * * 1,2,3,4,5', function() {
    request.get("http://zekkei-switch.herokuapp.com/locations/fetch_location.json", function(error, response, body) {
      if (response.statusCode == 200) {
        data = JSON.parse(body);
        msg.send(printf("%s\n%s\n%s", data.name, data.description, data.photo));
      } else {
        msg.send('error');
      }
    });
  }).start();
}
