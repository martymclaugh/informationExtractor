var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/scrape/:movieId', function(req, res){
  var movieId = req.params.movieId;
  var url = 'http://www.imdb.com/title/'+ movieId + '/ratings';
  // scrape url
  request(url, function(error, response, html){
    if(!error){
      // recieve the response
      // load with cheerio
      var $ = cheerio.load(html);
      var title, release;
      var json = {};
      // traverse to find ratings node
      ratings = $('#tn15content').text()
      title = $('.main').text()
      // set data to obj to send back
      json.title = title;
      // reformat the ratings to readable json
      json.ratings = parseResponse(ratings)
      // send json back
      res.send(json)
    }else {
      console.log(error.message)
    }
  })
})
function parseResponse(data){
  data = data.split('See user ratings report for:')[1].split('Related Links')[0];
  var newData = [];
  data.split('\n').forEach(function(line){
    newData.push(line.replace(/\s+/g,' ').trim());
  })
  newData = newData.filter(function(n){ return n !== '' && n !== 'Votes' && n !== 'Average'});
  output = []
  newData.forEach(function(line){
    let rating, amount;
    var arr = line.split(' ');
    var len = arr.length;
    rating = arr.pop();
    amount = arr.pop();
    who = arr.join(' ')
    output.push({who, rating, amount})
  })
  return output
}

app.listen(process.env.PORT || '8081');
console.log('Scraping on port 8081');

module.exports = app
