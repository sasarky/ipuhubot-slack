# Description:
#   WCup

request = require 'request'

class WCup
  constructor: () ->
    @api = 'http://worldcup.sfg.io/matches/today'

  today: (arg, callback) ->
    request.get(@api, (error, response, body) ->
      today_matches = JSON.parse(body)
      
      unless today_matches
        callback('error')

      message = "本日の試合情報です。\n"
      for match in today_matches
        if match.status is 'future'
          message = message + "#{match.home_team.country} vs #{match.away_team.country}\n"
        else
          message = message + "#{match.home_team.country}:#{match.home_team.goals} vs #{match.away_team.country}:#{match.home_team.goals}\n"
      callback(message)
    )

module.exports = new WCup
