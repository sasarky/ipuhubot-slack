# Description:
#   Logger
#

logger = require('../src/class/ipuhubot-logger')

module.exports = (robot) ->
  robot.hear /(.*)/i, (msg) ->
    logger.log (msg.message)
