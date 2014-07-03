# Description:
#   Pokemon

async = require 'async'
request = require 'request'
printf = require 'printf'
_ = require 'underscore'
client = require('redis').createClient()

# ほんとはでかいぷはクラス分けるべきなんだろうけどあとで
class Pokemon
  constructor: () ->
    @api = 'http://pokeapi.co'

  # でかいぷがいるか
  appearedDekaIPU: (callback) ->
    client.get('hubot:dekaipu:appeared', (err, val) ->
      callback(val)
    )

  # でかいぷだす
  buildDekaIPU: (callback) ->
    dekaipu_status = {
      hp: 500
    }
    client.set('hubot:dekaipu:status', JSON.stringify(dekaipu_status))
    client.set('hubot:dekaipu:appeared', 'true')
    client.set('hubot:dekaipu:last_attacker', 'false')
    callback(dekaipu_status)

  checkLastAttacker: (callback) ->
    client.get('hubot:dekaipu:last_attacker', (err, val) ->
      callback(val)
    )

  # でかいぷ消す
  delDekaIPU: (callback) ->
    client.set('hubot:dekaipu:appeared', 'false')

  doAttack: (user_name, pokemon, callback) ->
    client.get('hubot:dekaipu:status', (err, val) ->
      dekaipu_status = {
        hp: JSON.parse(val).hp - pokemon.attack
      }
      client.set('hubot:dekaipu:status', JSON.stringify(dekaipu_status))
      client.set('hubot:dekaipu:last_attacker', user_name)
      client.get("hubot:dekaipu:damage:#{user_name}", (err, val2) ->
        client.set("hubot:dekaipu:damage:#{user_name}", Number(val2) + pokemon.attack)
      )
      callback(err, dekaipu_status)
    )

  getDamageRank: (callback0) ->
    damage_list = {}
    async.waterfall [
      (callback) ->
        client.keys("hubot:dekaipu:damage:*", (err, keys) ->
          client.mget(keys, (err2, damage) ->
            i = 0
            for key in keys
              damage_list[key] = damage[i++]
          )
          setTimeout(() ->
            callback(null, damage_list)
          , 1000)
        )
    ]
    ,
    (err, damage_list) ->
      console.log damage_list
      callback0(null, damage_list)

  getPokemonInfo: (uri, callback) ->
    url = "http://pokeapi.co/#{uri}"
    request.get(url, (err, res, body) ->
      callback(err, JSON.parse(body))
    )

  getPokemonRandom: (callback) ->
    url = "#{@api}/api/v1/pokedex/"
    request.get(url, (err, res, body) ->
      pokemon = _.sample(JSON.parse(body).objects[0].pokemon)
      callback(err, pokemon)
    )

  getPokemonImg: (name, callback) ->
    img_api = "http://ajax.googleapis.com/ajax/services/search/images?q=#{name}&v=1.0"
    request.get(img_api, (err, res, body) ->
      callback(err, "#{JSON.parse(body).responseData.results[0].unescapedUrl}#.png")
    )


module.exports = new Pokemon
