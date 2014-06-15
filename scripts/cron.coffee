cronJob = require('cron').CronJob
 
module.exports = (robot) ->
    send = (room, msg) ->
        robot.messageRoom(room, msg)

# *(sec) *(min) *(hour) *(day) *(month) *(day of the week)
    new cronJob('0 0 0 * * *', () ->
        send "#general", "夜更かししちゃだめだぞ"
    ).start()

    new cronJob('0 0 9 * * 1,2,3,4,5', () ->
        send "#general", "今日も一日がんばりましょー！"
    ).start()

    new cronJob('0 0 12 * * 1,2,3,4,5', () ->
        send "#general", "午後も張り切っていこー！"
    ).start()

    new cronJob('0 0 18 * * 1,2,3,4,5', () ->
        send "#general", "今日も一日お疲れ様！"
    ).start()
