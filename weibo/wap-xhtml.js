"use strict";
const cheerio = require('cheerio')
class xhtml{
   constructor(x){
     this.x= x;
   };
    static clear(str) {
            str = str.replace(/<\/?[^>]*>/g,''); //HTML tag
            str = str.replace(/[ | ]*\n/g,'\n'); //行尾空白
            str = str.replace(/\n[\s| | ]*\r/g,'\n'); //空行
            str=str.replace(/&nbsp;/ig,'');
            return str;
    }
    static unescape(text){
    	var r = /\\u([\d\w]{4})/gi;
		text = text.replace(r, function (match, grp) {
		    return String.fromCharCode(parseInt(grp, 16)); } );
		text = unescape(text);
		return text;
    }
    static firstblood(data){
        const result = [];
        data = JSON.parse(data)
        console.log(`当前页${data.data.cards.length}条内容`)
        const cards = data.data.cards;
        cards.forEach((item) => {
          if (item.mblog) {
            result.push({
              name: item.mblog.user.screen_name,
              content: item.mblog.text,
              time: item.mblog.created_at,
              // time: this.formatDate(+(item.mblog.analysis_extra.slice(-11,-1)+'000')),
              transmit: item.mblog.reposts_count,
              comment: item.mblog.comments_count,
              starts: item.mblog.attitudes_count
            })
          }
        })
        return result;
    }
    static formatDate(subjectDate) {
      var date = subjectDate ? new Date(subjectDate) : new Date();
      var YY = date.getFullYear() + '-';
      var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
      var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      const result = YY + MM + DD + ' ' +hh + mm + ss
      return subjectDate ? result : result.replace(/ /g, '').replace(/-/g, '').replace(/:/g, '');
    }
    static comment_txt (text)
        {
            var r = "";

            var start = text.indexOf('<p class="comment_txt"');
            if(start>-1){
            var end = text.indexOf("</p>", start);
            r = text.substr(start, end - start + 4);
            //r = Regex.Replace(r, @"<(.[^>]*)>", "", RegexOptions.IgnoreCase);
            r = xhtml.clear(r);
        	}
            return r;
        }
    static verify(text)
        {
            var r = "";

            var start = text.indexOf("com/verify");
            if (start > 0)
            {
                var end = text.indexOf("alt=", start);
                r = text.substr(start + 20, end - start - 22);
                //r = Regex.Replace(r, @"<(.[^>]*)>", "", RegexOptions.IgnoreCase);
                r= xhtml.clear(r);
            }
            return r;
        }
    static pagenum(text)
        {
        //     var r = 1;

        //     var start = text.indexOf("第1页");
        //     if (start > 0)
        //     {
        //         var end = text.indexOf("</ul></div>", start);
        //         var st = text.substr(start + 12, end - start - 12);
        //         if (st!="")
        //         {
        //             start = st.lastIndexOf("第");
        //             end = st.lastIndexOf("页");

        //             var pagenum = st.substr(start + 1, end - start - 1);

        //             //r = Convert.ToInt32(pagenum);
        //             r = pagenum;
        //         }
        //     }
          const $ = cheerio.load(text)
          $('li', '.s-scroll').length
          return $('li', '.s-scroll').length || 1;
        }

    static nick(text)
        {
            var r = {Name:"",Url:""};

            var start = text.indexOf("nick-name=");
            var end = text.indexOf("target", start);

            var st = text.substr(start + 10, end - start - 11);

           //string[] s = new string[1]{"href="};


           //var obj = st.Split(s, StringSplitOptions.None);
           var obj = st.split("href=")
           if(obj.length>1){
            r.Name = obj[0].replace(/"/g,'');
            r.Url = obj[1].replace(/"/g, '');
        }
           
            return r;
        }
    static feed_from(text)
        {
            var r = {Url:"",Date:"",From:""}

            var start = text.indexOf('<div class="feed_from W_textb">');
            var end = text.indexOf("</div>", start);

            var st = text.substr(start, end - start + 6);

            start = st.indexOf("<a href=");
            end = st.indexOf("target=", start);

            r.Url = st.substr(start + 9, end - start - 11);

            start = st.indexOf("title=");
            end = st.indexOf("date=", start);

            r.Date = st.substr(start + 7, end - start - 9);

            start = st.indexOf("来自");
            if (start > 0)
            {
                end = st.indexOf("</a>", start);
                r.From = st.substr(start + 3, end - start + 1);
                //r.From = Regex.replace(r.From, @"<(.[^>]*)>", "", RegexOptions.IgnoreCase);
                r.From= xhtml.clear(r.From);
            }
            else
            {
                r.From = "";
            }

            return r;
        }

    static feed_action(text)
        {
            var r = {R:0,C:0,Like:0};

            var start = text.indexOf("<div class=\"feed_action clearfix\">");
            var end = text.indexOf("</div>", start);

            var st = text.substr(start, end - start + 6);

            start = st.indexOf("转发<em>");
            end = st.indexOf("</em>", start);

            r.R = st.substr(start + 6, end - start - 6);

            if (r.R=="")
            {
                r.R = "0";
            }

            start = st.indexOf("评论");
            end = st.indexOf("</span>", start);

            r.C = st.substr(start + 2, end - start - 2);
            //r.C = Regex.Replace(r.C, @"<(.[^>]*)>", "", RegexOptions.IgnoreCase);
            r.C = xhtml.clear(r.C);

            if (r.C=="")
            {
                r.C = "0";
            }

            start = st.indexOf("<em>",end);
            end = st.indexOf("</em>", start);

            r.Like = st.substr(start + 4, end - start -4);

            if (r.Like=="")
            {
                r.Like = "0";
            }

            //r.From = Regex.Replace(r.From, @"<(.[^>]*)>", "", RegexOptions.IgnoreCase);
            //r.From = xhtml.clear(r.From);

            return r;
        }

}
module.exports = xhtml;
//exports.xhtml = xhtml;

// hooyes 2018
