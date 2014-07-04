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

module.exports = function(robot) {
  url_api_base = "https://api.github.com";

  robot.respond(/UPGRADE\sPREPARE$/i, function(msg) {
    url = printf("%s/repos/sasarky/ipuhubot/compare/master...develop", url_api_base);
    github.get(url, function(info) {
      if (info.commits.length == 0) {
        msg.send("進化素材が足りないよ");
      } else {
        cnt = 1;
        for (commit in info.commits) {
          if (/^Merge pull request/.exec(commit.commit.message)) {
            continue;
          }
          msg.send(printf("[%s] %s (%s): %s", cnt++, commit.commit.message, commit.commit.committer.name, commit.html_url));
        }
        msg.send("この進化素材で進化しちゃうよ？ ( https://github.com/sasarky/ipuhubot/compare/master...develop )");
      }
    });
  });

  robot.respond(/UPGRADE\sTEST$/i, function (msg) {
    child_process.exec('cd ../ipuhubot_test; git pull; mocha -R spec test/test.js', function(error, stdout, stderr) {
      msg.send(stdout);
    });
  });

  robot.respond(/UPGRADE\sEXECUTE$/i, function(msg) {
    async.waterfall([
      function(callback) {
        msg.send("ごごごごごごご");
        setTimeout(function() {
          github.branches("sasarky/ipuhubot").merge("develop", function(branches) {
            msg.send("進化の準備が整いました");
            setTimeout(function() {
              callback(null);
            }, 1000);
          });
        }, 1000);
      },
      function(callback) {
        child_process.exec('git pull', function(error, stdout, stderr) {
          if (error) {
            msg.send("失敗しちゃった。。。");
            return;
          } else {
            msg.send("ぶおおおおおおおん！！！！");
            msg.send(stdout);

            setTimeout(function() {
              callback(null);
            }, 1000);
          }
        });
      },
      function(callback) {
        msg.send("適合中です");
        setTimeout(function() {
          msg.send("進化しました！");
          setTimeout(function() {
            process.exit();
          }, 10000);
        }, 1000);
      }
    ]);
  });
}
