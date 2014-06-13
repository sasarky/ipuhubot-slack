module.exports = (robot) ->
    github = require('githubot')(robot)
    unless (url_api_base = process.env.HUBOT_GITHUB_API)?
        url_api_base = "https://api.github.com"

    robot.respond /UPGRADE$/i, (msg) ->
        # ホントは pull request は関係ないんだけどまずはためしで
        github.get "#{url_api_base}/repos/sasarky/ipuhubot/compare/master...develop", (diff) ->
            console.log(diff)

        github.get "#{url_api_base}/repos/sasarky/ipuhubot/pulls", (pulls) ->
            if pulls.length == 0
                summary = "進化素材がないみたい。。。"
            else
                summary = "進化素材が揃ってる！！！"
            msg.send summary
