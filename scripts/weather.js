// Description:
//   weather
//
// Commands:
//    hubot weather <place> - Return weather

var request = require('request');
var printf = require('printf');

module.exports = function(robot) {
  robot.respond(/weather (.*)/i, function(msg) {
    // cityId一覧: http://weather.livedoor.com/forecast/rss/primary_area.xml
    cityIds = {
      "tokyo" : "130010",
      "morioka" : "030010",
      "sendai" : "040010"
    }
    cityId = cityIds[msg.match[1]]
    apiUrl = printf("http://weather.livedoor.com/forecast/webservice/json/v1?city=%s", cityId);

    // URLにアクセスしてデータを取得する
    request(apiUrl, function(err, response, body) {
      if (err) {
        msg.send(printf("リクエストエラーががが:%s", err));
        return;
      }

      if(response.statusCode == 200) {
        try {
          json = JSON.parse(body);
        } catch(e) {
          msg.send(printf("JSONパースエラーががが: %s", e));
        }
        forecast = json.forecasts[json.forecasts.length-2];
        weather = printf("%sの%sの天気は%sです", json.location.city, forecast.dateLabel, forecast.telop);
        msg.send(weather);
      } else {
        msg.send(printf("はわわわ！その場所知らないですごめんなさい><: %s", response.statusCode));
      }
    });
  });
}
