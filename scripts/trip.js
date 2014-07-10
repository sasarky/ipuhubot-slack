// Description:
//   ipukun recommends popular spot at random from CheekiTrip
//
// Commands:
//   hubot trip
var request = require('request');

module.exports = function(robot) {
  robot.respond(/TRIP$/i, function (msg) {
    request.get("http://api.cheekitrip.com/api/rank/spot/popular?limit=100", function(err, res, body){
      var spots = JSON.parse(body);
      var spot  = msg.random(spots);
      
      request.get("http://graph.facebook.com/" + spot.spot._id, function(err, res, body) {
        var fb_spot = JSON.parse(body);
        var website = (fb_spot.website)?("\n公式Webサイトはこちら " + fb_spot.website):"";
        msg.send("ここ行ってみたら？    " + fb_spot.name + " (" + spot.spot.location.prefecture.name + spot.spot.location.city.name + ") " + fb_spot.link + website);
      });
    });
  });
};
