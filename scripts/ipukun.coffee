# Description:
#   ipu-kun
#
# Commands:
#   hubot emo - emotion

printf = require 'printf'
_ = require 'underscore'

class Ipukun
    emotionMap:
        hello: 0

    emote: (emotion) ->
        return "https://raw.githubusercontent.com/sasarky/ipuhubot/master/images/00.png"

    emotions: ->
        _.keys @emotionMap

module.exports = (robot) ->

    robot.respond /emo ?(.*)/i, (msg) ->
        ipukun = new Ipukun
        emotion = msg.match[1]
        msg.send ipukun.emote(emotion)
    robot.hear /nemui|眠い/, (msg) ->
        msg.send '無理しないで寝よっ！'
