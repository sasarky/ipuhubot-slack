// Description:
//   dj
//
// Commands:
//   hubot dj
github = require('githubot');

module.exports = function(robot) {
  robot.respond(/DJ\sSHOW$/i, function (msg) {

    github.get("https://api.github.com/gists/c093283b1b5f9d2df377", function (info) {
      content = info.files.sound_list.content;
      list = content.split("\n");
      query = msg.random(list);

      robot.http("http://gdata.youtube.com/feeds/api/videos")
        .query({
          orderBy: "relevance",
          'max-results': 15,
          alt: 'json',
          q: query
        })
        .get()(function(err, res, body) {
          videos = JSON.parse(body);
          videos = videos.feed.entry;

          video  = msg.random(videos);
          video.link.forEach(function(link) {
            if (link.rel == "alternate" && link.type == "text/html") {
              msg.send(link.href);
            }
          });
        });
    });
  });
}
