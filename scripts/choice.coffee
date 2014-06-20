# Description:
#   Choose at random
#
# Commands:
#   hubot <choise> <arg1> <arg2> - Choose from several arguments

_ = require 'underscore'

module.exports = (robot) ->
  robot.respond /choice (.+)/i, (msg) ->
    items = msg.match[1].split(/\s+/)
    num = 1
    if /n=\d*$/.test(items[0])
      num = items[0].replace('n=', '')
      items.shift()
      if num > items.length
        num = 1
    choices = _.sample(items, num)
    msg.send "厳正な抽選の結果、「#{choices}」に決まりました"
