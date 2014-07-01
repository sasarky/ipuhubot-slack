# Description:
#   DOCOMO
#

request = require('request').defaults({
  strictSSL: false
})
client = require('redis').createClient()

module.exports = (robot) ->
  api = "https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue/?APIKEY=#{process.env.HUBOT_DOCOMO_TOKEN}"

  robot.hear /(.*)/, (msg) ->
    if msg.message.room == 'ipukun_talk'
      client.get('hubot:talk:last_context', (err, val) ->
        query = msg.match[1]
        request.post(api, body: JSON.stringify({utt: query, context: val}), (error, response, body) ->
          client.set('hubot:talk:last_context', val)
          msg.send "@#{msg.message.user.name}: #{JSON.parse(body).utt}"
        )
      )
