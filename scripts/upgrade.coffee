# Description:
#   Ipukun の Deploy 周りの機能
#
# Commands:
#   hubot upgrade prepare - show diff master..develop
#   hubot upgrade execute - merge develop, build (check) @Circle CI and deploy Heroku

async = require('async')
child_process = require 'child_process'

module.exports = (robot) ->
    github = require('githubot')(robot)
    unless (url_api_base = process.env.HUBOT_GITHUB_API)?
        url_api_base = "https://api.github.com"

    robot.respond /UPGRADE\sPREPARE$/i, (msg) ->
        github.get "#{url_api_base}/repos/sasarky/ipuhubot/compare/master...develop", (info) ->
            if (info.commits.length == 0)
                msg.send "進化素材が足りないよ"
            else
                cnt = 1
                for commit in info.commits 
                    if /^Merge pull request/.exec(commit.commit.message)?
                        continue
                    msg.send "[#{cnt}] #{commit.commit.message} (#{commit.commit.committer.name}): #{commit.html_url}"
                    cnt++
                msg.send "この進化素材で進化しちゃうよ？ ( https://github.com/sasarky/ipuhubot/compare/master...develop )"


    robot.respond /UPGRADE\sEXECUTE$/i, (msg) ->
        async.waterfall [
            (callback) ->
                msg.send "ごごごごごごご"
                callback(null)
            ,
            (callback) ->
                github.branches("sasarky/ipuhubot").merge "develop", (branches) ->
                    msg.send("進化の準備が整いました")
                    callback(null)
            ,
            (callback) ->
                child_process.exec 'git pull', (error, stdout, stderr) ->
                    if error
                        msg.send "失敗しちゃった。。。"
                    else
                        msg.send "ぶおおおおおおおん！！！！"
                        msg.send stdout
                        msg.send "バージョンアップ適合中です"
                    callback(null)
            ,
            (callback) ->
                msg.send "進化しました！"
                callback(null)
        ], (err) ->
            msg.send "owari"
          #process.exit()
