# Description:
#   Pokemon

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
      hp: 1000
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
        hp: JSON.parse(val).hp - pokemon.attack * 10
      }
      client.set('hubot:dekaipu:status', JSON.stringify(dekaipu_status))
      client.set('hubot:dekaipu:last_attacker', user_name)
      callback(err, dekaipu_status)
    )

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

module.exports = new Pokemon
