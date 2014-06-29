# Description:
#   Pokemon
#
# Commands:
#   hubot battle - show gal img

pokemon = require('../src/class/ipuhubot-pokemon')
async = require('async')

module.exports = (robot) ->
  robot.respond /pokemon\sbattle/i, (msg) ->
    async.waterfall [
      (callback) ->
        pokemon.getPokemonRandom((err, pokemon) ->
          setTimeout(() ->
            callback(null, pokemon.resource_uri)
          , 1000)
        )
      ,
      (uri, callback) ->
        pokemon.getPokemonInfo(uri, (err, info) ->
          body = "
野生の #{info.name} があらわれた！\n
HP: #{info.hp}, 攻撃力: #{info.attack}\n
防御力: #{info.defense}, 素早さ: #{info.speed}"
          msg.send body
          setTimeout(() ->
            callback(null)
          , 1000)
        )
      ,
      (callback) ->
        msg.send "IPU君！君に決めた！！"
        msg.send "IPU君は怯えて攻撃できない"
        msg.send "Game Over"
    ]

