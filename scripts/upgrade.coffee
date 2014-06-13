module.exports = (robot) ->
    github = require('githubot')(robot)
    unless (url_api_base = process.env.HUBOT_GITHUB_API)?
        url_api_base = "https://api.github.com"

    robot.respond /UPGRADE$/i, (msg) ->
        # ホントは pull request は関係ないんだけどまずはためしで
        github.get "#{url_api_base}/repos/sasarky/ipuhubot/compare/master...develop", (info) ->
            if (info.commits.length == 0)
                msg.send "進化素材が足りないよ"
            else
                cnt = 1
                for commit in info.commits 
                    msg.send "[#{cnt}] #{commit.commit.message} (#{commit.commit.committer.name}): #{commit.html_url}"
                    cnt++
                msg.send "この進化素材で進化しちゃうよ？ ( #{url_api_base}/repos/sasarky/ipuhubot/compare/master...develop )"
