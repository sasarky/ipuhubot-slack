# Description:
#   DOCOMO
#

request = require('request').defaults({
  strictSSL: false
})

module.exports = (robot) ->
  api = "https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue/?APIKEY=#{process.env.HUBOT_DOCOMO_TOKEN}"

  robot.hear /(.*)/, (msg) ->
    if msg.message.room == 'ipukun_talk'
      console.log (msg.message.room)
      request.post(api, body: JSON.stringify({utt: "hello"}), (error, response, body) ->
        msg.send "@#{msg.message.user.name}: #{JSON.parse(body).utt}"
      )
