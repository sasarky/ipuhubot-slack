# Description:
#   Pokemon

request = require 'request'
printf = require 'printf'
_ = require 'underscore'

class Pokemon
  # propeties

  constructor: () ->
    @api = 'http://pokeapi.co'

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
