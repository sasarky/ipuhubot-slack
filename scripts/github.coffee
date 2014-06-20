# Description:
#   Github
#
# Commands:
#   hubot issue list - show issues list
#   hubot add issue <title> <body> - post issue
#   hubot committer list - show committer list

github = require 'githubot'
printf = require 'printf'

module.exports = (robot) ->
    unless (url_api_base = process.env.HUBOT_GITHUB_API)?
        url_api_base = "https://api.github.com"

    robot.respond /ISSUES$/i, (msg) ->
        github.get "#{url_api_base}/repos/sasarky/ipuhubot/issues", (issues) ->
          for issue in issues
            msg.send printf "[#%d] %s ( %s ) By %s", issue['number'], issue['title'], issue['html_url'], issue['user']['login']

    robot.respond /ADD ISSUE (.*) (.*)$/i, (msg) ->
        # 行頭および行末の ' もしくは " を削除
        title = msg.match[1].replace(/^[\'\"]|[\'\"]$/g, '')
        body = msg.match[2].replace(/^[\'\"]|[\'\"]$/g, '')
        github.post "#{url_api_base}/repos/sasarky/ipuhubot/issues", {title: title, body: body}, (issue) ->
            console.log issue
            msg.send "ありがとう！issue #{issue.number} 「#{issue.title}」 を発行したよ！ #{issue.html_url}"

    robot.respond /CONTRIBUTORS$/i, (msg) ->
        committers = []
        github.get "#{url_api_base}/repos/sasarky/ipuhubot/contributors", (info) ->
          for i in info
            msg.send printf "%s: %d", i.login, i.contributions

    robot.respond /OCTOCAT$/i, (msg) ->
        base_url = "https://octodex.github.com"
        github.get "https://octodexapi.herokuapp.com", (info) ->
            msg.send "#{base_url}#{msg.random(info)['image']}"
