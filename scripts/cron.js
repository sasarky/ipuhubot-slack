// Description:
//   ipukun の Cronjob 機能
//

var cronJob = require('cron').CronJob;
var meigen = require('../src/class/ipuhubot-meigen');
var tenki = require('../src/class/ipuhubot-tenki');
var ipuhubot_room = require('../src/class/ipuhubot-room');
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

  new cronJob('0 0 8 * * *', function() {
    tenki.get(function(view_msg) {
      send("#general", view_msg);
    });
  }).start();

  new cronJob('59 59 23 * * *', function() {
    ipuhubot_room.harfCount();
  }).start();
  // }}}

  // {{{ WeekDay
  new cronJob('0 30 8 * * *', function() {
    meigen.get('', function(body) {
      if (body == 'error') {
        send("#general", "No meigen No Life");
      } else {
        send("#general", printf('%s by %s\n%s', body.meigen, body.author, body.image));
      }
    });
  }).start();

  new cronJob('0 0 9 * * 1,2,3,4,5', function() {
    send("#general", "https://qiita-image-store.s3.amazonaws.com/0/29945/9e4bd52c-3fc3-a7c2-e8d2-b9911db5b5c8.png");
  }).start();

  new cronJob('0 0 12 * * 1,2,3,4,5', function() {
    send("#general", "午後も張り切っていこー！");
  }).start();

  new cronJob('0 0 18 * * 1,2,3,4,5', function() {
    send("#general", "今日も一日お疲れ様！");
  }).start();
  // }}}
}
