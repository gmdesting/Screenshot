//依赖模块
var fs = require('fs');
var request = require("request");
var cheerio = require("cheerio");
var mkdirp = require('mkdirp');
var async = require('async');
var eventproxy = require('eventproxy');

var host = 'https://manhua.dmzj.com'

var downloadImg = (function () {
    // 图片链接地址
    var links = [];
    var page = 0;
    // 下载方法
    var download = function (url, dir, filename, cb, i) {
        var options={
            url: url,
            headers:{
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
        var i = 0;
        // 本地存储目录
        var dir = '../images/' + manhuaname +'/'+manhuatitlelist[page];

        // 创建目录
        mkdirp(dir, function (err) {
            if (err) {
                console.log(err);
            }
        });
        page++
        var options={
            url: url,
            headers:{
                referer: 'https://manhua.dmzj.com/migongfan/51601.shtml'
            }
        }
        console.log('开始下载图……')
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(body);
                var evalstring = $('head')[0].children[9].children[0].data
                var end = evalstring.search(/   ;/i)
                var sss = eval(evalstring.substring(70,end))
                var arrpic = eval(pages)
                // 每次只执行一个异步操作
                async.mapSeries(arrpic, function (item, callback) {
                    i++
                    var hostpic = 'https://images.dmzj.com/' + item
                        download(hostpic, dir, i + hostpic.substr(-4, 4), () => {
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
        download:download
    }
}())
 
// 选择漫画的首页url
var manhuaurl = 'https://manhua.dmzj.com/migongfan/'
// 漫画名称】
var manhuaname = ''
// 漫画章节list
var chapterlist = []
// 漫画章节title
var manhuatitlelist = []

request(manhuaurl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(body);
        manhuaname = $('.anim_title_text h1').text()
        $(".cartoon_online_border ul li a").each(function(){
            var manhuatitle = $(this).attr('title').match(/-(\S*)/)[1]
            // console.log($(this).attr('title').match(/(\S*)-(\S*)/)[1])
            var chapter = host + $(this).attr('href')
            manhuatitlelist.push(manhuatitle)
            chapterlist.push(chapter);
        })
        async.mapSeries(chapterlist, (item, cb) => {
            downloadImg.load(item, err => {
                cb()
            })
        })
    }
})
// async.mapSeries(urllist, (item,cb) => {
//     downloadImg.load(item, err => {
//         cb()
//     })
// })
