// Description:
//   dj
//
// Commands:
//   hubot dj
github = require('githubot');
var url = require("url");
var redis = require('redis');
var client;
if (process.env.REDISTOGO_URL) {
  var rtg = url.parse(process.env.REDISTOGO_URL);
  client = redis.createClient(rtg.port, rtg.hostname);
  client.auth(rtg.auth.split(":")[1]);
} else {
  client = redis.createClient();
}

module.exports = function(robot) {
  robot.respond(/DJ\sADD\s(.*)$/i, function (msg) {
    var video_id = msg.match[1];
    client.get('hubot:dj:queue', function(err, val) {
      var queues = {};
      if (val) {
        queues = JSON.parse(val);
      }
      queues[video_id] = { id: video_id }
      client.set('hubot:dj:queue', JSON.stringify(queues));
      msg.send("セトリにいれたよー！\nhttp://ipukun-dj.herokuapp.com/")
    });
  });

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
