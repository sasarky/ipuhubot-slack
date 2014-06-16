# Description:
#   Tumblr
#
# Commands:
#   hubot gal - show gal img

request = require 'request'

module.exports = (robot) ->
    robot.respond /gal/i, (msg) ->
        token = process.env.HUBOT_TUMBLR_TOKEN
        url = "http://api.tumblr.com/v2/blog/castleofpoems.tumblr.com/posts?api_key=#{token}"
        request.get(url, (error, response, body) ->
          img = msg.random(msg.random(JSON.parse(body)['response']['posts'])['photos'])
          url = img['alt_sizes'][1]['url']
          msg.send url
        )
