// Description:
//   Messing around with the today API.
// Commands:
//   hubot today  - Return today at random.
var today = require('../src/class/ipuhubot-today');

module.exports = function(robot) {
	robot.respond(/TODAY/i, function(msg) {
		var day_info = new Date();
		var to = {month:(day_info.getMonth()+1), day:day_info.getDate()};
		
		today.get(to.month+'/'+to.day, function(body) {
			if (!body) {
				msg.send("No today No Life");
				return;
			}
			//今日が何の日かをランダムに
			var kinenbi_list = body.feed.kinenbi[0].item;
			var random = Math.floor( Math.random() * kinenbi_list.length); //乱数
			var kinenbi = kinenbi_list[random];
			if(kinenbi.indexOf("（") != -1){
				var kinenbi_info = kinenbi_list[random].split('（');
				kinenbi = kinenbi_info[0];
			}

			//wikipediaリンク
			var wiki = body.feed.wikipedia[0];

			msg.send('今日は'+ kinenbi+'です。「'+to.month+'月'+to.day+'日: '+wiki+' 」');
		});
	});
};