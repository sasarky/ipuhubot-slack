// Description:
//   Tumblr

var request = require('request');
var printf = require('printf');

var Tumblr = function() {
  this.api = 'http://api.tumblr.com/v2';
  this.token = process.env.HUBOT_TUMBLR_TOKEN;
}

Tumblr.prototype.get = function(point, callback) {
  url = this._getUrl(point);

  request.get(url, function(error, response, body) {
    callback(error, body);
  });
}

Tumblr.prototype._getUrl = function(point) {
  return printf('%s%s?api_key=%s', this.api, point, this.token);
}

module.exports = new Tumblr
