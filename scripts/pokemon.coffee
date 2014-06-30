# Description:
#   Pokemon
#
# Commands:
#   hubot battle - do battle

pokemon = require '../src/class/ipuhubot-pokemon'
async = require 'async'
cronJob = require('cron').CronJob

module.exports = (robot) ->
  # ランダムで出現させる
  new cronJob('0 0 09-23 * * *', () ->
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
          robot.messageRoom("#ipuhubot", "誰か相手してよ。。。")
          return
        else
          setTimeout(() ->
            callback(null)
          , 1000)
      ,
      # 出す
      (callback) ->
        pokemon.buildDekaIPU((val) ->
          setTimeout(() ->
            robot.messageRoom("#ipuhubot", "ずずずずずずず\nでかいぷが現れた！！HP: #{val.hp}\n http://www.nintendo.co.jp/3ds/balj/img/top/main_kirby.png")
          , 1000)
        )
    ]
  ).start()

  robot.respond /pokemon\srank/i, (msg) ->
    pokemon.getDamageRank((err, body) ->
      for key of body
        msg.send key.replace(/hubot:dekaipu:damage:/, '') + ": " + body[key]
    )

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
        pokemon.checkLastAttacker((attacker) ->
          if msg.message.user.name == attacker
            msg.send "二回連続攻撃はできないぞ！"
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
        pokemon.doAttack(msg.message.user.name, info, (err, result) ->
          if result.hp < 0
            msg.send "やった！でかいぷ君を倒したぞ！"
            pokemon.delDekaIPU()
          else
            msg.send "でかいぷ君にダメージを与えた！残りHPは #{result.hp} だぞ！"
        )
    ]

