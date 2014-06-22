# Description:
#   Logger

fs = require 'fs'
dateformat = require 'dateformat'

class Logger

  constructor: () ->
    if process.env.HUBOT_LOG_DIR
      @log_dir = process.env.HUBOT_LOG_DIR
    else
      @log_dir = '/home/logs'

  log: (message) ->
    timestamp = dateformat(new Date(), "HH:MM:ss")
    text = "#{timestamp}\t#{message.user.room}\t#{message.user.name}\t#{message.text}\n"

    date = dateformat(new Date(), "yyyymmdd")
    file = "#{@log_dir}/#{date}.dat"
    fs.appendFile(file, text, 'utf8')

module.exports = new Logger
