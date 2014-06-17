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

    robot.respond /ISSUE\sLIST$/i, (msg) ->
        github.get "#{url_api_base}/repos/sasarky/ipuhubot/issues", (issues) ->
          cnt = 1
          for issue in issues
            msg.send printf "[%d] %s ( %s ) By %s", cnt, issue['title'], issue['html_url'], issue['user']['login']
            cnt++

    robot.respond /ADD ISSUE (.*) (.*)$/i, (msg) ->
        # 行頭および行末の ' もしくは " を削除
        title = msg.match[1].replace(/^[\'\"]|[\'\"]$/g, '')
        body = msg.match[2].replace(/^[\'\"]|[\'\"]$/g, '')
        github.post "#{url_api_base}/repos/sasarky/ipuhubot/issues", {title: title, body: body}, (issue) ->
            console.log issue
            msg.send "ありがとう！issue #{issue.number} 「#{issue.title}」 を発行したよ！ #{issue.html_url}"

    robot.respond /COMMITTER\sLIST$/i, (msg) ->
        committers = []
        github.get "#{url_api_base}/repos/sasarky/ipuhubot/contributors", (info) ->
          for i in info
            msg.send printf "%s: %d", i.login, i.contributions
