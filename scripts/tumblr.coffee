# Description:
#   Tumblr
#
# Commands:
#   hubot gal - show gal img

request = require 'request'

module.exports = (robot) ->
  robot.respond /gal/i, (msg) ->
    token = process.env.HUBOT_TUMBLR_TOKEN
    url = "http://api.tumblr.com/v2/blog/mincang.tumblr.com/posts/photo?api_key=#{token}"
    request.get(url, (error, response, body) ->
      # alt_sizes[0] は割りとでかいので [1] を使う
      msg.send msg.random(JSON.parse(body)['response']['posts'])['photos'][0]['alt_sizes'][1]['url']
    )
