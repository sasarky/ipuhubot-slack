# Description:
#   ipukun の Cronjob 機能
#

cronJob = require('cron').CronJob

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
        robot.http("http://meigen.o-bit.biz/api")
            .get() (err, res, body) ->
                meigen = JSON.parse(body)
                unless meigen?
                    msg.send "No meigen No Life"
                    return
                send "#general", "[今日の名言] #{meigen.meigen} by #{meigen.author}\n#{meigen.image}"
    ).start()

    new cronJob('0 0 12 * * 1,2,3,4,5', () ->
        send "#general", "午後も張り切っていこー！"
    ).start()

    new cronJob('0 0 18 * * 1,2,3,4,5', () ->
        send "#general", "今日も一日お疲れ様！"
    ).start()
# }}}
