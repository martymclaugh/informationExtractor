var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape/:movieId', function(req, res){
  console.log(req.params.movieId);
})

app.listen('8081');
console.log('Scraping on port 8081');

module.exports = app
