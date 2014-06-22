request = require "request"

module.exports = (robot) ->
  robot.respond /weather (.*)/i, (msg) -> # 正規表現で名前を取得
    # cityId一覧: http://weather.livedoor.com/forecast/rss/primary_area.xml
    cityIds =
      "tokyo" : "130010",
      "morioka" : "030010",
      "sendai" : "040010"
    cityId = cityIds[msg.match[1]]
    apiUrl = "http://weather.livedoor.com/forecast/webservice/json/v1?city=#{cityId}"

    # URLにアクセスしてデータを取得する
    request apiUrl, (err, response, body) ->
      if err
        msg.send "リクエストエラーががが:#{err}"

      if response.statusCode is 200
        try
          json = JSON.parse body
        catch e
          msg.send "JSONパースエラーががが: #{e}"

        forecast = json.forecasts[json.forecasts.length-2]

        weather = "#{json.location.city}の#{forecast.dateLabel}の天気は#{forecast.telop}です。"
        msg.send weather
      else
        msg.send "はわわわ！その場所知らないですごめんなさい><: #{response.statusCode}"