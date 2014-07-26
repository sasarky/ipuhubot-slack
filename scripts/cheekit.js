// Description:
//   cheekit rinen
//
// Commands:
//   hubot cheekit


var request = require('request');
var cheerio = require('cheerio-httpcli');
var util = require('util');

module.exports = function(robot) {
  robot.hear(/^cheekit$/, function(msg) {
    msg.send("make local happiness!");
  });


  //yotubato
  robot.hear(/^yotubato$/,function(msg){
  	cheerio.fetch('http://gazoreply.jp/tag/74/', {}, function (err, $, res) {
		var image_url = $("#photo-list img").map(function(d,i){return {"src":i.attribs.src,"alt":i.attribs.alt};});
		var randnum = Math.floor( Math.random() * image_url.length);
		msg.send(printf('%s \n%s',image_url[randnum]["alt"],image_url[randnum]["src"]));
	});
  });
};
