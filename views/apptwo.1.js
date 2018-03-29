//依赖模块
var fs = require('fs');
var request = require("request");
var cheerio = require("cheerio");
var mkdirp = require('mkdirp');
var async = require('async');
var eventproxy = require('eventproxy');

// 本地存储目录
var dir = '../images';

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
        request.head(url, function (err, res, body) {
            request(url).pipe(
                fs.createWriteStream(dir + "/" + filename)
            );
            console.log('第' + i +'张图片，下载完成')
            cb && cb()
        });
    };
    var load = function (url, cbload) {
        console.log('开始下载图……')
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(body);
                links = []
                // $('.clearfix').each(function () {
                //     var src = $(this).attr('src');
                //     links.push(src);
                // });
                console.log($('.bds_more').text())
                // // 每次只执行一个异步操作
                // async.mapSeries(links, function (item, callback) {
                //     i++
                //     download(item, dir, i + item.substr(-4, 4), () => {
                //         callback()
                //     }, i);
                // }, function (err, results) {
                //     // console.log()
                //     cbload && cbload(err)
                // });

            }
        });
    }
    return {
        load: load
    }
}())

var urlImg = [
    'https://manhua.dmzj.com/migongfan/51601.shtml#@page=2'
]

async.mapSeries(urlImg, (item,cb) => {
    downloadImg.load(item, err => {
        cb()
    })
})


// var manhuatitle = $(this).attr('title').match(/-(\S*)/)[1]
// manhuatitlelist.push(manhuatitle)