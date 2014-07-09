// Description: IGR時刻表

var client = require('cheerio-httpcli');
var request = require('request');

var IGR = function(){
  this.url ={
    takizawa: 'http://www.igr.jp/wp/timetable/takizawa',
    morioka: 'http://www.igr.jp/wp/timetable/morioka'
  };
};

IGR.prototype.get =  function(ekimei,way, callback) {
  var self = this;
  var url = '';
  if(ekimei === 'takizawa'){
    url = self.url.takizawa;
  }else if(ekimei === 'morioka'){
    url = self.url.morioka;
  }

  // スクレイピング開始
  client.fetch(url, {}, function (err, $, res){
    if(err){
      console.log('Connect error');
      return;
    }
    $('a[name="'+way+'"]').parent().next().each(function(){
      callback($(this).text());
    });
  });
};

module.exports = new IGR();