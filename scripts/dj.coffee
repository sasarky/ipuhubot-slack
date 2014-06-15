# Description:
#   gist
#
# Commands:
#   hubot gist

module.exports = (robot) ->
  robot.respond /dj show$/i, (msg) ->
    github = require('githubot')(robot)

    github.get "https://api.github.com/gists/c093283b1b5f9d2df377", (info) ->
      content = info.files.sound_list.content
      list = content.split("\n")
      query = msg.random list

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
              msg.send link.href

  robot.respond /dj add (.*)$/i, (msg) ->
    song = msg.match[1]
    github.get "https://api.github.com/gists/c093283b1b5f9d2df377", (info) ->
      content = info.files.sound_list.content + "\n" + song
      param = {discription: "", files: { sound_list: { content : content }}}
      github.patch "https://api.github.com/gists/c093283b1b5f9d2df377", param (gist) ->
        console.log(gist)
