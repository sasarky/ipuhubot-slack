# Description:
#   Messing around with the WCup API.
#
# Commands:
#   hubot wcup  - Return  at random.
wcup = require('../src/class/ipuhubot-wcup')

module.exports = (robot) ->
    robot.respond /(WCUP)\s(today)/i, (msg) ->
        wcup.today('', (body) ->
            if body == 'error'
                msg.send "No WCup No Life"
            else
                msg.send body
        )
