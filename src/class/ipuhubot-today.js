// Description:
// 今日は何の日

var parseString = require('xml2js').parseString; //xml perser
var request = require('request');
var Today = function(){
	this.api = 'http://www.mizunotomoaki.com/wikipedia_daytopic/api.cgi/';
};

Today.prototype.get =  function(arg, callback) {
	var self = this;
	request.get(self.api + arg, function(error, response, body){
		if(error){
			console.log('connect error');
			return;
		}

		parseString(body, function (err, result) {
			if(err){
				console.log('perse error');
				return;
			}

			callback(result);
		});
	});
};

module.exports = new Today;