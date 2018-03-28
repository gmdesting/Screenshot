//依赖模块
var fs = require('fs');
var request = require("request");
var cheerio = require("cheerio");
var mkdirp = require('mkdirp');
var async = require('async');
var eventproxy = require('eventproxy');
// var http = require('http');
// var querystring =require('querystring');

// 本地存储目录
var dir = '../images';
// var referer = 'https://manhua.dmzj.com/migongfan/51601.shtml'

// 创建目录
mkdirp(dir, function (err) {
    if (err) {
        console.log(err);
    }
});

// 图片链接地址
var links = [];
var downloadImg = (function () {
    var i = 0;
    // 下载方法
    var download = function (url, dir, filename, cb, i) {
        var options = {
            url: url,
            headers: {
                referer: 'https://manhua.dmzj.com/migongfan/51601.shtml'
            }
        }
        request.head(options, function (err, res, body) {
            request(options).pipe(
                fs.createWriteStream(dir + "/" + filename)
            );
            console.log('第' + i + '张图片，下载完成')
            cb && cb()
        });
    };
    var load = function (url, cbload) {
        var options = {
            url: url,
            headers: {
                referer: url
            }
        }
        console.log('开始下载图……')
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // console.log(body)
                var $ = cheerio.load(body);
                var evalstring = eval($('head')[0].children[9].children[0].data.substring(70, 924))
                links = eval(pages)
                // console.log(eval(pages))
                // console.log(links)
                // links = ['m/%E8%BF%B7%E5%AE%AB%E9%A5%AD/00/01%20%E5%89%AF%E6%9C%AC.jpg',
                //     'm/%E8%BF%B7%E5%AE%AB%E9%A5%AD/00/02%20%E5%89%AF%E6%9C%AC.jpg',
                //     'm/%E8%BF%B7%E5%AE%AB%E9%A5%AD/00/03%20%E5%89%AF%E6%9C%AC.jpg',
                //     'm/%E8%BF%B7%E5%AE%AB%E9%A5%AD/00/04%20%E5%89%AF%E6%9C%AC.jpg',
                //     'm/%E8%BF%B7%E5%AE%AB%E9%A5%AD/00/05%20%E5%89%AF%E6%9C%AC.jpg',
                //     'm/%E8%BF%B7%E5%AE%AB%E9%A5%AD/00/06%20%E5%89%AF%E6%9C%AC.jpg',
                //     'm/%E8%BF%B7%E5%AE%AB%E9%A5%AD/00/07%20%E5%89%AF%E6%9C%AC.jpg',
                //     'm/%E8%BF%B7%E5%AE%AB%E9%A5%AD/00/08%20%E5%89%AF%E6%9C%AC.jpg',
                // ]
                // $('#center_box img').each(function () {
                //     var src = $(this).attr('src');
                //     links.push(src);
                // });
                // links.push('m/%E8%BF%B7%E5%AE%AB%E9%A5%AD/00/09%20%E5%89%AF%E6%9C%AC.jpg')
                // console.log(body)
                // // 每次只执行一个异步操作
                async.mapSeries(links, function (item, callback) {
                    i++
                    var hostpic = 'https://images.dmzj.com/' + item;
                    download(hostpic, dir, i + item.substr(-4, 4), () => {
                        callback()
                    }, i);
                }, function (err, results) {
                    cbload && cbload(err)
                });

            }
        });
    }
    return {
        load: load,
        download: download
    }
}())

// downloadImg.download('https://images.dmzj.com/m/%E8%BF%B7%E5%AE%AB%E9%A5%AD/%E7%AC%AC01%E8%AF%9D/0002.jpg',dir,'dddd.jpg')

var list = [
    'https://manhua.dmzj.com/migongfan/51601.shtml#@page=2'
];
async.mapSeries(list, (item,cb) => {
    console.log(item)
    downloadImg.load(item, err => {
        cb()
    })
})


// var page = eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('l h=h=\'["m\\/%5%6%7%0%9%3%1%2%8\\/c\\/k%g%0%f%d%a%e%b.4","m\\/%5%6%7%0%9%3%1%2%8\\/c\\/j%g%0%f%d%a%e%b.4","m\\/%5%6%7%0%9%3%1%2%8\\/c\\/i%g%0%f%d%a%e%b.4","m\\/%5%6%7%0%9%3%1%2%8\\/c\\/n%g%0%f%d%a%e%b.4","m\\/%5%6%7%0%9%3%1%2%8\\/c\\/q%g%0%f%d%a%e%b.4","m\\/%5%6%7%0%9%3%1%2%8\\/c\\/s%g%0%f%d%a%e%b.4","m\\/%5%6%7%0%9%3%1%2%8\\/c\\/r%g%0%f%d%a%e%b.4","m\\/%5%6%7%0%9%3%1%2%8\\/c\\/o%g%0%f%d%a%e%b.4","m\\/%5%6%7%0%9%3%1%2%8\\/c\\/p%g%0%f%d%a%e%b.4"]\';',29,29,'E5|E9|A5|AB|jpg|E8|BF|B7|AD|AE|E6|AC|00|AF|9C|89|20|pages|03|02|01|var||04|08|09|05|07|06'.split('|'),0,{}))

// console.log(eval(pages))