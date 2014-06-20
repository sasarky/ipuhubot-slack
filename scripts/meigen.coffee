# Description:
#   Messing around with the Meigen API.
#
# Commands:
#   hubot meigen  - Return meigen at random.
meigen = require('../src/class/ipuhubot-meigen')

module.exports = (robot) ->
    robot.respond /MEIGEN/i, (msg) ->
        meigen.get('', (body) ->
            if body == 'error'
                msg.send "No meigen No Life"
            else
                msg.send "#{body.meigen} by #{body.author}\n#{body.image}"
        )
