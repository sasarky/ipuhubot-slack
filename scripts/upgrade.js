// Description:
//   Ipukun の Deploy 周りの機能
//
// Commands:
//   hubot upgrade prepare - show diff master..develop
//   hubot upgrade execute - merge develop, deploy

async = require('async')
child_process = require('child_process');
github = require('githubot');
printf = require('printf');
request = require('request');

module.exports = function(robot) {
  url_api_base = "https://api.github.com";

  robot.respond(/UPGRADE\sPREPARE$/i, function(msg) {
    url = printf("%s/repos/sasarky/ipuhubot-slack/compare/master...develop", url_api_base);
    github.get(url, function(info) {
      if (info.commits.length == 0) {
        msg.send("進化素材が足りないよ");
      } else {
        info.commits.forEach(function(commit, num) {
          if (!/^Merge pull request/.exec(commit.commit.message)) {
            msg.send(printf("[%s] %s (%s): %s", num+1, commit.commit.message, commit.commit.committer.name, commit.html_url));
          }
        });
        msg.send("この進化素材で進化しちゃうよ？ ( https://github.com/sasarky/ipuhubot-slack/compare/master...develop )");
      }
    });
  });

  robot.respond(/UPGRADE\sEXECUTE$/i, function(msg) {
    msg.send("デプロイしますよー！！！");
    var url = printf("http://%s@jenkins.sasarky.net/job/ipuhubot/build?delay=0sec", process.env.HUBOT_JENKINS_TOKEN);
    request.post(url, function(err, res, body) {
      if (err == null) {
        msg.send("デプロイ完了しました！褒めて褒めて！");
      }
    });
  });
}
