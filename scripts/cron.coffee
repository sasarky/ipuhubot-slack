cronJob = require('cron').CronJob
 
module.exports = (robot) ->
    send = (room, msg) ->
        console.log(room)
        (new robot.Response(robot, {user : {id : -1, name : room}, text : "none", done : false}, [])).send msg

# *(sec) *(min) *(hour) *(day) *(month) *(day of the week)
    new cronJob('* * * * * *', () ->
        send 'general', "日付も変わったし寝ようね"
    ).start()
