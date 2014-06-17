# Description:
#   Tumblr

request = require 'request'
printf = require 'printf'

class Tumblr
  # propeties
  api: 'http://api.tumblr.com/v2'

  constructor: () ->
    @token = process.env.HUBOT_TUMBLR_TOKEN

  get: (point, callback) ->
    url = this._getUrl(point)

    request.get(url, (error, response, body) ->
      callback(error, body)
    )

  _getUrl: (point) ->
    return printf '%s%s?api_key=%s', @api, point, @token

module.exports = new Tumblr
