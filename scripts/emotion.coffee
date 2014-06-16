# Description:
#   emotion
#
# Commands:
#   hubot emo - emotion

printf = require 'printf'
request = require 'request'
_ = require 'underscore'

emotionMap=
  hello: 0
  happybirthday: 98
  hbd: 98

emote= (emotion) ->
  s = printf '%02d', emotionMap[emotion]
  return "https://raw.githubusercontent.com/sasarky/ipuhubot/master/images/#{s}.png"

emotions= ->
  console.log("koko")
  _.keys emotionMap

module.exports = (robot) ->

  robot.respond /emo\s(.*)/i, (msg) ->
    emotion = msg.match[1]
    msg.send emote(emotion)

  robot.respond /emo\slist$/i, (msg) ->
    msg.send emotions().join "\n"
