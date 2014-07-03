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
  new cronJob('0 0 10 * * *', () ->
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
        pokemon.buildDekaIPU((hp) ->
          setTimeout(() ->
            robot.messageRoom("#ipuhubot", "ずずずずずずず\nでかいぷが現れた！！HP: #{hp}\n http://www.nintendo.co.jp/3ds/balj/img/top/main_kirby.png")
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
          else if attacker == 'false'
            # 初回 50 point ボーナス
            bonus = 50
            msg.send "初回攻撃ボーナス #{bonus} ポイントだ！"
            pokemon.addBonusPoint(msg.message.user.name, bonus)
          callback(null)
        )
      ,
      (callback) ->
        pokemon.getPokemonRandom((err, pokemon_info) ->
          msg.send "#{pokemon_info.name}！君にきめた！"
          setTimeout(() ->
            pokemon.getPokemonImg(pokemon_info.name, (err, img) ->
              msg.send img
            )
            callback(null, pokemon_info.resource_uri)
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
        pokemon.doAttack(msg.message.user.name, info, (err, hp) ->
          if hp < 0
            bonus = 100
            msg.send "やった！でかいぷ君を倒したぞ！ボーナスで #{bonus} ポイントだ！"
            pokemon.delDekaIPU()
            # 討伐ポイント 100
            pokemon.addBonusPoint(msg.message.user.name, bonus)
          else
            msg.send "でかいぷ君にダメージを与えた！残りHPは #{hp} だぞ！"
        )
    ]

