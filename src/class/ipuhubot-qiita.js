// Description:
//   Pokemon

var async = require('async');
var printf = require('printf');
var request = require('request');
var _ = require('underscore');

var Qiita = function() {
}

Qiita.prototype.getStockCount = function(user, callback) {
  url = printf("https://qiita.com/api/v1/users/%s/items", user);
  request.get(url, function(error, response, body) {
    body = JSON.parse(body);
    Qiita.prototype.calculateStockCount(body, function(sum) {
      callback(sum);
    });
  });
}

Qiita.prototype.calculateStockCount = function(body, callback) {
  sum = 0;
  body.forEach(function(entry) {
    sum += entry.stock_count;
  });
  // ほんとにこの sum ってあってる？
  callback(sum);
}

module.exports = new Qiita
