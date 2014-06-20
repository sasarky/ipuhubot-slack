# Description:
#   ipukun の Cronjob 機能
#

cronJob = require('cron').CronJob
meigen = require('../src/class/ipuhubot-meigen')

module.exports = (robot) ->
    send = (room, msg) ->
        robot.messageRoom(room, msg)

# *(sec) *(min) *(hour) *(day) *(month) *(day of the week)

# {{{ Daily
    new cronJob('0 0 0 * * *', () ->
        send "#general", "夜更かししちゃだめだぞ"
    ).start()
# }}}

# {{{ WeekDay
    new cronJob('0 0 9 * * 1,2,3,4,5', () ->
        send "#general", "今日も一日がんばりましょー！"
        meigen.get('', (body) ->
            if body == 'error'
                send "#general", "No meigen No Life"
            else
                send "#general", "#{body.meigen} by #{body.author}\n#{body.image}"
        )
    ).start()

    new cronJob('0 0 12 * * 1,2,3,4,5', () ->
        send "#general", "午後も張り切っていこー！"
    ).start()

    new cronJob('0 0 18 * * 1,2,3,4,5', () ->
        send "#general", "今日も一日お疲れ様！"
    ).start()
# }}}
