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
    # logger が有効な場合だけとる
    unless this._is_enabled(message.user.room)
      return

    timestamp = dateformat(new Date(), "HH:MM:ss")
    text = "#{timestamp}\t#{message.user.room}\t#{message.user.name}\t#{message.text}\n"

    date = dateformat(new Date(), "yyyymmdd")
    file = "#{@log_dir}/#{date}.dat"
    fs.appendFile(file, text, 'utf8')

  # log をとっていいのかどうか
  _is_enabled: (room) ->
    # production 環境か
    if process.env.NODE_ENV != 'production'
      return false

    # 指定したチャンネルか
    allowed_channels = process.env.HUBOT_LOGGER_ALLOWED_CHANNELS ? 'ipuhubot'
    return room in allowed_channels.split(',')

module.exports = new Logger
