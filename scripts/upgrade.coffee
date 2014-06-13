module.exports = (robot) ->
    robot.respond /UPGRADE$/i, (msg) ->
        msg.send 'buoooon'
