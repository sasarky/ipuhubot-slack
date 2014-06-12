cronJob = require('cron').CronJob
 
module.exports = (robot) ->
    send = (room, msg) ->
        (new robot.Response(robot, {user : {id : -3000, room : room}, text : "none", done : false}, [])).send msg

# *(sec) *(min) *(hour) *(day) *(month) *(day of the week)
    new cronJob('* * * * * *', () ->
        send '#ipuhubot', "日付も変わったし寝ようね"
    ).start()
