const getNews = require('./getNews');
const express = require('express');
const app = express();
let server = app.listen(3000, function() {
  let host = server.address().address;
  let port = server.address().port;
  console.log('Your App is running at', host, port);
});

/**
 * 百度新闻网的新闻
 */
app.get('/news', async(req, res, next) => {
  res.send(getNews.hotNewsHtml);
});

/**
 * 80s.tv中的电影 @TODO
 */