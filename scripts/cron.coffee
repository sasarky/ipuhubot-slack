cronJob = require('cron').CronJob
 
module.exports = (robot) ->
    send = (room, msg) ->
        robot.messageRoom(room, msg)

# *(sec) *(min) *(hour) *(day) *(month) *(day of the week)
    new cronJob('0 46 1 * * *', () ->
        send "#general", "てすとなんだな"
    ).start()

    new cronJob('0 0 9 * * *', () ->
        send "#general", "今日も一日がんばりましょー！"
    ).start()

    new cronJob('0 0 12 * * *', () ->
        send "#general", "午後も張り切っていこー！"
    ).start()

    new cronJob('0 0 18 * * *', () ->
        send "#general", "今日も一日お疲れ様！"
    ).start()
