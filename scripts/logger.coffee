# Description:
#   Logs all message
#

fs = require "fs";
dateformat = require "dateformat"
hubot = require "hubot"

module.exports = (robot) ->
  robot.listeners.push new hubot.Listener(robot, ((msg) -> return true), (res) -> log_message(robot, res))

log_message = (robot, response) ->
  timestamp = dateformat(new Date(), "yyyy-mm-dd HH:MM:ss")
  message = "#{response.message.user.name}\t#{response.message.user.room}\t#{timestamp}\t#{response.message.text}\n"

  fs.appendFile('./logs/message.log', message ,'utf8')