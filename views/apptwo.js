//依赖模块
var fs = require('fs');
var request = require("request");
var cheerio = require("cheerio");
var mkdirp = require('mkdirp');
var async = require('async');
var eventproxy = require('eventproxy');

// 目标网址
// var url = 'http://desk.zol.com.cn/meinv/1920x1080/2.html';

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
                // $('.photo-list-padding a img').each(function() {
                //     var src = $(this).attr('src');
                //     src = src.replace(/t_s208x130c5/, 't_s960x600c5');
                //     links.push(src);
                // });
                links = []
                // console.log(body)
                $('div img').each(function () {
                    var src = $(this).attr('src');
                    // src = src.replace(/t_s208x130c5/, 't_s960x600c5');
                    links.push(src);
                });
                console.log(links)
                // console.log(links)
                // 每次只执行一个异步操作
                async.mapSeries(links, function (item, callback) {
                    i++
                    download(item, dir, i + item.substr(-4, 4), () => {
                        callback()
                    }, i);
                }, function (err, results) {
                    // console.log()
                    cbload && cbload(err)
                });

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


// 发送请求

// for (var i = 0; i < 5; i++) {
//     //console.log(i); 
//     (function (i) {
//         url = 'http://www.boqii.com/tag/23634/'
//         request(url, function (error, response, body) {
//             if (!error && response.statusCode == 200) {
//                 var $ = cheerio.load(body);
//                 // $('.photo-list-padding a img').each(function() {
//                 //     var src = $(this).attr('src');
//                 //     src = src.replace(/t_s208x130c5/, 't_s960x600c5');
//                 //     links.push(src);
//                 // });
//                 $('.art_list a img').each(function () {
//                     var src = $(this).attr('src');
//                     // src = src.replace(/t_s208x130c5/, 't_s960x600c5');
//                     links.push(src);
//                 });
//                 // 每次只执行一个异步操作
//                 async.mapSeries(links, function (item, callback) {
//                     console.log(item)
//                     download(item, dir, i + item.substr(-4, 4));
//                     callback(null, item);
//                 }, function (err, results) {

//                 });
//             }
//         });

//     })(i)
// }