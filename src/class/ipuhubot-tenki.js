// Description:
//   Tenki

var printf = require('printf');
var request = require('request');
var _ = require('underscore');

var Tenki = function(){
}

// TODO: 後に場所ちゃんとやる
Tenki.prototype.get =  function(place, callback) {
  var url = 'http://api.openweathermap.org/data/2.5/forecast?q=' + place;
  var d = new Date;

  request.get(url, function(err, res, body) {
    var body = JSON.parse(body);
    var begin_time  = printf('%s-%02s-%02s 09:00:00', d.getYear() + 1900, d.getMonth() + 1, d.getDate());
    var end_time  = printf('%s-%02s-%02s 23:59:59', d.getYear() + 1900, d.getMonth() + 1, d.getDate());
    begin_unixtime = new Date(begin_time) / 1000 | 0;
    end_unixtime = new Date(end_time) / 1000 | 0;

    var message = printf('今日の %s の天気です\n', place);

    _.each(body.list, function(result) {
      if (result.dt < end_unixtime && result.dt >= begin_unixtime) {
        result_dt = new Date((result.dt) * 1000);
        view_time = printf('%02s:%02s', result_dt.getHours(), result_dt.getMinutes());
        message += printf('%s: %s (%s 度)\n', view_time, result.weather[0].main, Math.floor(result.main.temp - 272))
      }
    });
    callback(message);
  });
};

module.exports = new Tenki
