// Description:
//   ipukun posts drucker's article
//
// Commands:
//   hubot drucker [article id] - ipukun posts drucker's article. You can specify article id (1-369).If you does not specified, ipukun posts it at ramdom.
//   
// Memo
//   How to retrieve drucker's article list
//   $ for i in {1..19}; do wget "http://diamond.jp/category/s-drucker_3m?page=${i}"; done
var request = require('request');

module.exports = function(robot) {
  robot.respond(/DRUCKER( )*([0-9]+)*/i, function (msg) {
    request.get("https://raw.githubusercontent.com/isseium/misc/master/drucker/s-drucker-links-hash", function(err, res, body){
      var articles = JSON.parse(body);
      var article  = msg.random(articles);
      
      // 有効な記事番号が指定されていたとき
      var id = msg.match[2];
      if(id > 0 && id <= 369){
        article = articles[id - 1];
      }
      
      msg.send(article.title + " " + article.url);
    });
  });
};
