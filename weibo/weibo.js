const fs = require('fs');
const request = require('request');
const xhtml = require("./xhtml");
let finnalObject = []
const  Thread = { 
    Sleep : function (d) {  
    return new Promise((a, r) => { 
    setTimeout(() => { 
      a() 
    }, d) 
  }) }
}
async function Main(keyword) {
        console.log("正在查询关键字: %s ",keyword);
        var sPage = 1;
        var sMaxPage = 5; 
        var MaxPage = 5;
        var k = 1;
        while (sPage >= 1 && sPage < MaxPage && k <= sMaxPage)
        {
            k++;
            var Url = `http://s.weibo.com/weibo?q=${encodeURIComponent(keyword)}&wvr=6&b=1&Refer=SWeibo_box&page=${sPage}&pageid`
            // var Url = "http://s.weibo.com/weibo/"+encodeURIComponent(keyword)+"?topnav=1&wvr=6&b=1&page="+sPage;
            console.log(Url);
            let html = await fetchHtml(Url);

            (sPage == 1) ? 
            console.log("正在解析第1页数据") : console.log("正在解析第"+sPage+"/"+MaxPage+"页")
            MaxPage = Worker(html)
            MaxPage = 5
            sPage++;
            await Thread.Sleep(2000);
        }
        await Thread.Sleep(1000);
        console.log('我要开始输出拉')
        console.log(finnalObject)
}

function Worker(text){
  finnalObject = finnalObject.concat(xhtml.firstblood(text));
	return xhtml.pagenum(text);
}

function fetchHtml(url) {
    let cookies = fs.readFileSync('./cookies.txt');
    let headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36",
        'Accept-Language': 'en-US,en;q=0.5',
        'WeiboData-Type': 'application/x-www-form-urlencoded',
        'Connection': 'Keep-Alive',
        'cookie': cookies.toString()
    };
    let options = {
        method: 'GET',
        url: url, 
        headers: headers,
        gzip: true
    }
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                response.setEncoding('utf-8');
                resolve(response.body);
            } else {
                console.log('error');
            }
        })
    })
}

let argvs = process.argv;
console.log('99', argvs)
let keyword = argvs[2];
Main(keyword);

// hooyes 2018