# Description:
#   Github
#
# Commands:
#   hubot issue list - show issues list

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
