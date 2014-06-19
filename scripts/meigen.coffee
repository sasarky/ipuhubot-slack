# Description:
#   Messing around with the Meigen API.
#
# Commands:
#   hubot meigen  - Return meigen at random.
module.exports = (robot) ->
  robot.respond /(meigen)/i, (msg) ->
    robot.http("http://meigen.o-bit.biz/api")
      .get() (err, res, body) ->
        meigen = JSON.parse(body)
        unless meigen?
          msg.send "No meigen No Life"
          return

        msg.send "#{meigen.meigen} by #{meigen.author}\n#{meigen.image}"
