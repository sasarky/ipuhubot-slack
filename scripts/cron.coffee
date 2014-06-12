cronJob = require('cron').CronJob
 
module.exports = (robot) ->
    send = (room, msg) ->
#(new robot.Response(robot, {user : {room : room}, text : "none", done : false}, [])).send msg
        robot.messageRoom(room, msg)

# *(sec) *(min) *(hour) *(day) *(month) *(day of the week)
    new cronJob('0 0 0 * * *', () ->
        send "#ipuhubot", "日付も変わったし寝ようね"
    ).start()
