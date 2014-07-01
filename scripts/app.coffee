# Description:
# App
#

request = require 'request'
xml2json = require 'xml2json'
printf = require 'printf'

module.exports = (robot) ->
  robot.respond /IOS/i, (msg) ->
    url = "https://itunes.apple.com/jp/rss/topgrossingapplications/limit=10/xml"
    request.get(url, (err, res, body) ->
      message = ''
      for ent in JSON.parse(xml2json.toJson(body)).feed.entry
        console.log ent.title, ent.category.label, ent['im:image'][0]['$t']
      msg.send message
    )
