# Description:
# App
#

request = require 'request'
xml2json = require 'xml2json'
printf = require 'printf'

module.exports = (robot) ->
  robot.respond /IOS/i, (msg) ->
    url = "https://itunes.apple.com/jp/rss/topfreeapplications/limit=10/json"
    request.get(url, (err, res, body) ->
      message = ''
      i = 1
      for ent in JSON.parse(body).feed.entry
        console.log ent
        message = printf '%s[%d] %s ( %s )\n', message, i++, ent.title.label, ent.link.attributes.href
      msg.send message
    )
