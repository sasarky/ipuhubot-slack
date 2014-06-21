# Description:
#   WCup

printf = require 'printf'
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
          d = new Date(match.datetime)
          datetime = printf '%02d:%02d', d.getHours(), d.getMinutes()
          message = message + "[#{datetime}] #{match.home_team.country} vs #{match.away_team.country}\n"
        else if match.status is 'in progress'
          message = message + "[Playing!!] #{match.home_team.country}:#{match.home_team.goals} vs #{match.away_team.country}:#{match.away_team.goals}\n"
        else if match.status is 'completed'
          message = message + "[winner: #{match.winner}] #{match.home_team.country}:#{match.home_team.goals} vs #{match.away_team.country}:#{match.away_team.goals}\n"
      callback(message)
    )

module.exports = new WCup
