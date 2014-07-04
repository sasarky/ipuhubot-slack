// Description:
//   Tumblr
//
// Commands:
//   hubot gal - show gal img

var tumblr = require('../src/class/ipuhubot-tumblr')

module.exports = function(robot) {
  robot.respond(/gal/i, function(msg) {
    tumblr.get('/blog/mincang.tumblr.com/posts/photo', function(err, body) {
      // alt_sizes[0] は割りとでかいので [1] を使う
      msg.send(msg.random(JSON.parse(body).response.posts).photos[0].alt_sizes[1].url)
    });
  });
}
