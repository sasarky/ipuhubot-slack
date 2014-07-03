// Description:
//   Meigen

var request = require('request');

var Meigen = function(){
  this.api = 'http://meigen.o-bit.biz/api';
}

Meigen.prototype.get =  function(arg, callback) {
  request.get(this.api, function(error, response, body) {
    meigen = JSON.parse(body);
    if (meigen) {
      callback(meigen);
    } else {
      callback('error');
    }
  });
};

module.exports = new Meigen
