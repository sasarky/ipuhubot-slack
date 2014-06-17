# Description:
#   Tumblr
#
# Commands:
#   hubot gal - show gal img

tumblr = require('../src/class/ipuhubot-tumblr')

module.exports = (robot) ->
  robot.respond /gal/i, (msg) ->
    tumblr.get('/blog/mincang.tumblr.com/posts/photo', (err, body) ->
      # alt_sizes[0] は割りとでかいので [1] を使う
      msg.send msg.random(JSON.parse(body)['response']['posts'])['photos'][0]['alt_sizes'][1]['url']
    )

