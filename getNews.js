const superagent = require('superagent');
const cheerio = require('cheerio');

// 热点新闻
let hotNews = [];
// 本地新闻
let localNews = [];

superagent.get('http://news.baidu.com').end((err, res) => {
  if (err) {
    console.log(`页面抓取失败了- ${err}`);
  } else {
    hotNews = getHotNews(res);
    localNews = getlocalNews(res);

    let currentHotNewsHtml = '';
    let currentLocalNewsHtml = '';

    if (hotNews.length) {
      for (let i in hotNews) {
        currentHotNewsHtml += `<li><a href='${hotNews[i].href}' target='_blank'>${hotNews[i].title}</a></li>`;
      }
    }
    if (localNews.length) {
      for (let i in localNews) {
        currentLocalNewsHtml += `<li><a href='${localNews[i].href}' target='_blank'>${localNews[i].title}</a></li>`;
      }
    }

    exports.hotNewsHtml = `<h1>热点新闻</h1><ul>${currentHotNewsHtml}</ul><h1>热搜新闻词</h1><ul>${currentLocalNewsHtml}</ul>`;
  }}
);


/**
 * 获取热点新闻
 */
getHotNews = (res) => {
  let currentHotNews = [];
  // 使用cheerio模块的cherrio.load方法 类似jQuery的$(selector)
  if (res.text) {
    let $ = cheerio.load(res.text);
    $('div#pane-news ul li a').each((idx, ele) => {
      // cherrio中$('selector').each 是用来遍历所有匹配到的DOM元素
      // 参数idx是当前遍历的元素的索引，ele就是当前遍历的DOM元素
      let news = {
        title: $(ele).text(), // 获取新闻标题
        href: $(ele).attr('href'), // 获取新闻网页链接
      }
      currentHotNews.push(news);
    });
  }
  return currentHotNews;
}

/**
 * 获取本地新闻(现在改成热搜新闻词)
 */
getlocalNews = (res) => {
  let currentLocalNews = [];
  // 使用cheerio模块的cherrio.load方法 类似jQuery的$(selector)
  if (res.text) {
    let $ = cheerio.load(res.text);
    
    $('div#news-hotwords ul li a').each((idx, ele) => {
      // cherrio中$('selector').each 是用来遍历所有匹配到的DOM元素
      // 参数idx是当前遍历的元素的索引，ele就是当前遍历的DOM元素
      let news = {
        title: $(ele).text(), // 获取新闻标题
        href: $(ele).attr('href'), // 获取新闻网页链接
      }
      currentLocalNews.push(news);
    });
  }
  return currentLocalNews;
}