# Description:
#   FindJob
#
# Commands:
#   hubot findjob <pref> - findjob

printf = require 'printf'
request = require 'request'

prefList =
  "hokkaido": 1
  "aomori": 2
  "iwate": 3
  "miyagi": 4
  "akita": 5
  "yamagata": 6
  "fukushima": 7
  "ibaraki": 8
  "tochigi": 9
  "gunma": 10
  "saitama": 11
  "chiba": 12
  "tokyo": 13
  "kanagawa": 14
  "yamanashi": 15
  "nagano": 16
  "gifu": 17
  "nigata": 18
  "toyama": 19
  "ishikawa": 20
  "fukui": 21
  "shizuoka": 22
  "aichi": 23
  "mie": 24
  "shiga": 25
  "nara": 26
  "wakayama": 27
  "kyoto": 28
  "osaka": 29
  "hyogo": 30
  "tottori": 31
  "shimane": 32
  "okayama": 33
  "hiroshima": 34
  "yamaguchi": 35
  "tokushima": 36
  "kagawa": 37
  "ehime": 38
  "kochi": 39
  "fukuoka": 40
  "saga": 41
  "nagasaki": 42
  "kumamoto": 43
  "oita": 44
  "miyazaki": 45
  "kagoshima": 46
  "okinawa": 47

getPref = (pref) ->
  return printf '%03d', prefList[pref]

module.exports = (robot) ->
    robot.respond /findjob\s(.*)/i, (msg) ->
        pref = getPref(msg.match[1])
        token = process.env.HUBOT_FINDJOB_TOKEN
        url = "http://www.shigotonavi.co.jp/api/search/?key=#{token}&sjt1=03&swt1=002&spc=#{pref}"
        request.get(url, (error, response, body) ->
            work = msg.random JSON.parse(body)["result"]
            url = decodeURIComponent(work["url"])
            jobtypedetail = decodeURIComponent(work["jobtypedetail"])
            salary_y_min = decodeURIComponent(work["salary_y_min"])
            salary_y_max = decodeURIComponent(work["salary_y_max"])
            message = printf '%s (%s ~ %s)\nURL: %s\n',
                jobtypedetail
                salary_y_min, salary_y_max,
                url

            msg.send(message)
        )
