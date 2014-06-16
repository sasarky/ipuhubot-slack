# Description:
#   ipu-kun
#
# Commands:
#   hubot findjob <pref> - findjob

printf = require 'printf'
request = require 'request'
_ = require 'underscore'

module.exports = (robot) ->
    robot.respond /findjob\s(.*)/i, (msg) ->
        pref = msg.match[1]
        token = process.env.HUBOT_FINDJOB_TOKEN
        url = "http://www.shigotonavi.co.jp/api/search/?key=#{token}&sjt1=03&swt1=002&spc1=003"
        request.get(url, (error, response, body) ->
            work = msg.random JSON.parse(body)["result"]
            companyname = decodeURIComponent(work["companyname"])
            url = decodeURIComponent(work["url"])
            jobtypedetail = decodeURIComponent(work["jobtypedetail"])
            salary_y_min = decodeURIComponent(work["salary_y_min"])
            salary_y_max = decodeURIComponent(work["salary_y_max"])
            message = printf '%s (%s)\nsalary: %s ~ %s\nURL: %s\n',
                jobtypedetail, companyname,
                salary_y_min, salary_y_max,
                url
            msg.send(message)
        )
