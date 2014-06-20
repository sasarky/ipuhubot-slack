# Description:
#   Meigen

request = require 'request'

class Meigen
  constructor: () ->
    @api = 'http://meigen.o-bit.biz/api'

  get: (arg, callback) ->
    request.get(@api, (error, response, body) ->
      meigen = JSON.parse(body)
      if meigen
        callback(meigen)
      else
        callback('error')
    )

module.exports = new Meigen
