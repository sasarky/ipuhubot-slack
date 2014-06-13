cronJob = require('cron').CronJob
 
module.exports = (robot) ->
    send = (room) ->
        query = '倉木麻衣'
        robot.http("http://gdata.youtube.com/feeds/api/videos")
          .query({
            orderBy: "relevance"
            'max-results': 15
            alt: 'json'
            q: query
          })
          .get() (err, res, body) ->
            videos = JSON.parse(body)
            videos = videos.feed.entry

            unless videos?
              msg.send "No video results for \"#{query}\""
              return

            video  = msg.random videos
            video.link.forEach (link) ->
              if link.rel is "alternate" and link.type is "text/html"
                robot.messageRoom(room, link.href)

# *(sec) *(min) *(hour) *(day) *(month) *(day of the week)
    new cronJob('* * * * * *', () ->
        send "#kurakimai"
    ).start()
