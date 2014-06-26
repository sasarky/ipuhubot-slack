# Description:
#   Utility commands surrounding Hubot uptime.
#
# Commands:
#   hubot ping - Reply with pong
#   hubot echo <text> - Reply back with <text>
#   hubot time - Reply with current time
#   hubot whisper <channel> <txt> - send message to channel

printf = require 'printf'
request = require 'request'

module.exports = (robot) ->
  robot.respond /PING$/i, (msg) ->
    msg.send "PONG"

  robot.respond /HI$/i, (msg) ->
    msg.send "やあ！ぼくの名前はいぷ君だよ"

  robot.respond /ADAPTER$/i, (msg) ->
    msg.send robot.adapterName

  robot.respond /ECHO (.*)$/i, (msg) ->
    msg.send msg.match[1]

  robot.respond /TIME$/i, (msg) ->
    d = new Date
    hour = d.getHours()
    minute = d.getMinutes()
    img = printf "http://www.bijint.com/iwate/tokei_images/%02d%02d.jpg", hour, minute
    msg.send img

  robot.respond /DIE$/i, (msg) ->
    if robot.auth.hasRole(msg.envelope.user,'admin')
      msg.send "Goodbye, cruel world."
      process.exit 0
    else
      msg.send "you dont have admin role"


  robot.respond /whisper (.*) (.*)$/i, (msg) ->
    room = msg.match[1]
    kotoba = msg.match[2]
    robot.messageRoom(room, kotoba)

  robot.hear /nemui|眠い/, (msg) ->
    msg.send '無理しないで寝よっ！'

  robot.hear /疲れた|つかれた/, (msg) ->
    msg.send 'お疲れ様！ https://raw.githubusercontent.com/sasarky/ipuhubot/master/images/99.png'

  robot.hear /ひま|暇/, (msg) ->
    request.get("https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://b.hatena.ne.jp/hotentry/it.rss", (error, response, body) ->
      if response.statusCode is 200
        data = msg.random(JSON.parse(body)['responseData']['feed']['entries'])
        msg.send "これでも読んでみたら？\n " + data['title'] + "\n" + data['link']
      else
        msg.send 'error'
    )

  robot.respond /AME$/i, (msg) ->
    msg.send "http://agora.ex.nii.ac.jp/digital-typhoon/radar/graphics/east-i.jpg"
