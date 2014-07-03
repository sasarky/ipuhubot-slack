// Description:
//   Show AppStore, GooglePlay Ranking
// command:
//    hubot ios - show appstore ranking

var request = require('request');
var xml2json = require('xml2json');
var printf = require('printf');

module.exports = function(robot) {
  robot.respond(/IOS/i, function(msg) {
    url = "https://itunes.apple.com/jp/rss/topfreeapplications/limit=10/json";
    request.get(url, function(err, res, body) {
      message = '';
      // ここって forin とかのほうがいいのかな
      JSON.parse(body).feed.entry.forEach(function(ent, index, array) {
        message = printf('%s[%d] %s ( %s )\n',
          message, index+1, ent.title.label, ent.link.attributes.href);
      });
      msg.send(message);
    })
  })
}
