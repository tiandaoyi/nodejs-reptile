const fs = require('fs');
const request = require('request');
const xhtml = require("./wap-xhtml");
let finnalObject = []
const xlsx = require('xlsx')
const  Thread = { 
    Sleep : function (d) {  
    return new Promise((a, r) => { 
    setTimeout(() => { 
      a() 
    }, d) 
  }) }
}
async function Main(keyword,MaxPage, time) {
        console.log("正在查询关键字: %s ",keyword);
        var sPage = 1;
        // var sMaxPage = 3; 
        // var MaxPage = 3;
        // var k = 1;
        while (sPage >= 1 && sPage <= MaxPage)
        {
            // k++;
            var Url = `https://m.weibo.cn/api/container/getIndex?containerid=100103type%3D1%26q%3D${encodeURIComponent(keyword)}&page_type=searchall&page=${sPage}`
            // var Url = `http://s.weibo.com/weibo?q=${encodeURIComponent(keyword)}&wvr=6&b=1&Refer=SWeibo_box&page=${sPage}&pageid`
            // var Url = "http://s.weibo.com/weibo/"+encodeURIComponent(keyword)+"?topnav=1&wvr=6&b=1&page="+sPage;
            console.log(Url);
            let html = await fetchHtml(Url);

            (sPage == 1) ? 
            console.log("正在解析第1页数据") : console.log("正在解析第"+sPage+"/"+MaxPage+"页")
            Worker(html)
            sPage++;
            await Thread.Sleep(time);
        }
        await Thread.Sleep(2000);
        console.log('我要开始输出拉')
        outPutExcel()
}
function outPutExcel() {
    // let json = [ 
    // {"标题":'name'},
    // {"内容":'content'},
    // {"时间":'time'},
    // {"转发数":'transmit'},
    // {"评论数":'comment'},
    // {"点赞数":'starts'}]
    var arrayData = [["标题","内容","时间","转发数","评论数","点赞数"]]
    finnalObject.forEach(item => {
        arrayData.push([item.name,item.content, item.time,item.transmit,item.comment,item.starts]) 
    })
// 将数据转成workSheet
        let arrayWorkSheet = xlsx.utils.aoa_to_sheet(arrayData);
        // let jsonWorkSheet = xlsx.utils.json_to_sheet(jsonData);

        // 构造workBook
        let workBook = {
            SheetNames: ['arrayWorkSheet'],
            Sheets: {
                'arrayWorkSheet': arrayWorkSheet
            },
        };
        let worksheet = workBook.Sheets['arrayWorkSheet'];
　　　　 // 尺寸
        // worksheet['!rows'] = [{
        //     hpx: 30
        // }];
        worksheet['!cols'] = [{
            wpx: 100}, {
            wpx: 300
        }, {
            wpx: 80
        }, {
            wpx: 80
        }, {
            wpx: 80
        }, {
            wpx: 80
        }];
        // 将workBook写入文件
        // xlsx.writeFile(workBook, path.resolve(__dirname, "../public/aa.xlsx"));
        xlsx.writeFile(workBook, `./excel/${fileName}.xlsx`);
        return arrayWorkSheet
}

function Worker(text){
  finnalObject = finnalObject.concat(xhtml.firstblood(text));
}

function fetchHtml(url) {
    let cookies = fs.readFileSync('./cookies.txt');
    let headers = {
        // "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36",
        // 'Accept-Language': 'en-US,en;q=0.5',
        // 'WeiboData-Type': 'application/x-www-form-urlencoded',
        // 'Connection': 'Keep-Alive',
        // 'cookie': cookies.toString()
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36",
        'Accept-Language': 'en-US,en;q=0.5',
        'WeiboData-Type': 'application/x-www-form-urlencoded',
        'Connection': 'Keep-Alive',
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
                outPutExcel();
            }
        })
    })
}

let argvs = process.argv;
let keyword = argvs[2];
let maxPage = argvs[3];
let time = argvs[4];
let fileName = argvs[5] || xhtml.formatDate();
Main(keyword, maxPage || 1, time ? time * 1000 :3000);

// hooyes 2018
