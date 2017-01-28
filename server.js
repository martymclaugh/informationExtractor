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
  genderData = newData.filter(function(n){
    let firstN = n.split(' ')[0]
    return n !== '' && n !== 'Votes' && n !== 'Average' && firstN !== 'IMDb' && firstN !== 'Top' && firstN !== 'US' && firstN !== 'Non-US'
  });
  totalData = newData.filter(function(n){
    return n !== '' && n !== 'Votes' && n !== 'Average'
  });
  var output = []
  totalData.splice(2, totalData.length - 7)

  genderData.forEach(function(line){
    let rating, amount, title;
    var arr = line.split(' ');
    var len = arr.length;
    rating = parseFloat(arr.pop());
    amount = parseInt(arr.pop());
    title = arr.join(' ')
    output.push({title, rating, amount})
  })
  newOutput = [
    {
      name: 'Total',
      males: output[0].rating,
      females: output[1].rating,
      average: parseFloat(((output[0].rating + output[1].rating) / 2).toFixed(2)),
      amount: output[0].amount + output[1].amount
    }
  ]
  output = output.slice(2, output.length)
  console.log(output)
  for (var i = 0; i < output.length - 2; i +=3 ){
    let obj = {
      name: output[i].title,
      males: output[i+1].rating,
      females: output[i+2].rating,
      average: parseFloat(((output[i+1].rating + output[i+2].rating) / 2).toFixed(2)),
      amount: output[i].amount
    }
    newOutput.push(obj)
  }
  console.log(newOutput)
  return newOutput
}

app.listen(process.env.PORT || '8081');
console.log('Scraping on port 8081');

module.exports = app
