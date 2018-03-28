//依赖模块
var fs = require('fs');
var request = require("request");
var cheerio = require("cheerio");
var mkdirp = require('mkdirp');
var async = require('async');
var eventproxy = require('eventproxy');

var downloadImg = (function () {
    var dir = '../images';
    // 图片链接地址
    var links = [];
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

        // 创建目录
        mkdirp(dir, function (err) {
            if (err) {
                console.log(err);
            }
        });
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

var list = [
    'https://manhua.dmzj.com/migongfan/51601.shtml#@page=2'
];

async.mapSeries(list, (item, cb) => {
    downloadImg.load(item, err => {
        cb()
    })
})