# Description:
#   Messing around with the WCup API.
#
# Commands:
#   hubot wcup today - Return  WCup today's matches.
wcup = require('../src/class/ipuhubot-wcup')

module.exports = (robot) ->
    robot.respond /(WCUP)\s(.*)$/i, (msg) ->
        date = msg.match[2]
        wcup.getMatchResult(date, (body) ->
            if body == 'error'
                msg.send "No WCup No Life"
            else
                msg.send body
        )
