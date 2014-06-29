# Description:
#   Pokemon
#
# Commands:
#   hubot battle - do battle

pokemon = require '../src/class/ipuhubot-pokemon'
async = require 'async'
cronJob = require('cron').CronJob

module.exports = (robot) ->
  robot.respond /pokemon\sappear/i, (msg) ->
    async.waterfall [
      # でかいぷいるか取得
      (callback) ->
        pokemon.appearedDekaIPU((val) ->
          callback(null, val)
        )
      ,
      # 判断
      (val, callback) ->
        if val == 'true'
          return
        else
          setTimeout(() ->
            callback(null)
          , 1000)
      ,
      (callback) ->
        pokemon.buildDekaIPU((val) ->
          setTimeout(() ->
            msg.send "ずずずずずずず\nでかいぷが現れた！！HP: #{val.hp}"
          , 1000)
        )
    ]

  robot.respond /pokemon\sbattle/i, (msg) ->
    async.waterfall [
      # ランダムで手持ちのポケモン選ぶ
      (callback) ->
        pokemon.appearedDekaIPU((val) ->
          if val == 'false'
            msg.send "でかいぷ君が現れていないぞ！"
            return
          callback(null)
        )
      ,
      (callback) ->
        pokemon.getPokemonRandom((err, pokemon) ->
          msg.send "#{pokemon.name}！君にきめた！"
          setTimeout(() ->
            callback(null, pokemon.resource_uri)
          , 1000)
        )
      ,
      # 選んだポケモンを戦わせる
      (uri, callback) ->
        pokemon.getPokemonInfo(uri, (err, info) ->
          body = "
HP: #{info.hp}, 攻撃力: #{info.attack}\n
防御力: #{info.defense}, 素早さ: #{info.speed}"
          msg.send body
          setTimeout(() ->
            callback(null, info)
          , 1000)
        )
      ,
      (info, callback) ->
        pokemon.doAttack(info, (err, result) ->
          if result.hp < 0
            msg.send "やった！でかいぷ君を倒したぞ！"
            pokemon.delDekaIPU()
          else
            msg.send "でかいぷ君にダメージを与えた！残りHPは #{result.hp} だぞ！"
        )
    ]

