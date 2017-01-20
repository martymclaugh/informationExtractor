var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape/:movieId', function(req, res){
  var movieId = req.params.movieId;
  var url = 'http://www.imdb.com/title/'+ movieId + '/ratings';
  // scrape url
  request(url, function(error, response, hmtl){
    if(!error){
      // recieve the response
      // load with cheerio
      var $ = cheerio.load(html);
      var title, release;
      var json = {};
      // traverse to find ratings node
      ratings = $('#tn15content').text()
      title = $('.main').text()
      // reformat the ratings to readable json
    }else {
      console.log(error.message)
    }
  })
  // send json back
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

app.listen('8081');
console.log('Scraping on port 8081');

module.exports = app
