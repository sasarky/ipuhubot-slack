// Description:
//   dj
//
// Commands:
//   hubot dj
github = require('githubot');

module.exports = function(robot) {
  robot.respond(/TRIP$/i, function (msg) {
    robot.http("http://api.cheekitrip.com/api/rank/spot/popular")
    .query({
      limit: 100,
    })
    .get()(function(err, res, body) {
      var spots = JSON.parse(body);
      var spot  = msg.random(spots);
      
      robot.http("http://graph.facebook.com/" + spot.spot._id )
      .get()(function(err, res, body) {
        var fb_spot = JSON.parse(body);
        var website = (fb_spot.website)?("\n公式Webサイトはこちら " + fb_spot.website):"";
        msg.send("ここ行ってみたら？    " + fb_spot.name + " (" + spot.spot.location.prefecture.name + spot.spot.location.city.name + ") " + fb_spot.link + website);
      });
    });
  });
};
