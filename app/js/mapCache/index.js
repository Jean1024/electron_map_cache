const express = require('express');
const proxy = require('http-proxy-middleware');
const app = express();
const os = require('os')
const TMPDIR = os.tmpdir()
const path = require('path')
const fs = require('fs')
const download = require('download');
const net = require('net')
const url = require('url')
function fsExistsSync(path) {
    try {
        fs.accessSync(path, fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
}
function checkPath(path) {
    let flag = fsExistsSync(path)
    flag || (fs.mkdirSync(path))
}
function dl(v,dist) {
    // 解析路径
    var imgSrc = ''
    switch(dist){
        case 'site':
            imgSrc = `https://api.mapbox.com/styles/v1/mumu12343/cjbye1ptx44f82slcfuvt8xk2/tiles/256/${v.z}/${v.x}/${v.y}?access_token=pk.eyJ1IjoibXVtdTEyMzQzIiwiYSI6ImNqYnllMHNyeDMzZmczM3Iwc3dtZmQzbzQifQ.ODES4bDIuqe-bjL8dx0XWg`
            break;
        case 'gaode':
            imgSrc = `https://wprd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x=${v.x}&y=${v.y}&z=${v.z}`
            break;
        default: 
            imgSrc = ''
    }
    // 保存路径
    let savePath = path.resolve(TMPDIR, `BPA/map/${dist}/`)
    checkPath(`${savePath}/${v.z}`)
    checkPath(`${savePath}/${v.z}/${v.x}/`)
    var imgUrl = `${savePath}/${v.z}/${v.x}/${v.y}.png`
    download(imgSrc).on('error', function (err) {
        console.log(err)
    }).pipe(fs.createWriteStream(imgUrl)).on('finish', () => {
        // console.log('图片下载成功：%s', imgUrl);
    });
}
checkPath(path.resolve(TMPDIR, `BPA`))
checkPath(path.resolve(TMPDIR, `BPA/map`))
checkPath(path.resolve(TMPDIR, `BPA/map/site`))
checkPath(path.resolve(TMPDIR, `BPA/map/gaode`))
app.use(function (req, res, next) {
    res.setHeader('Surrogate-Control', 'no-store')
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    next()
})
app.use('/256/:z/:x/:y', proxy(
    {
        target: 'https://api.mapbox.com/styles/v1/mumu12343/cjbye1ptx44f82slcfuvt8xk2/tiles/',
        changeOrigin: true,
        onProxyRes(proxyRes, req, res) {
            let parm = req.params
            dl(parm,'site')
        }
    }));
app.use('/appmaptile',proxy({
    target: 'https://wprd01.is.autonavi.com/',
    changeOrigin: true,
    onProxyRes(proxyRes, req, res) {
        let parm = url.parse(req.url, true).query;
        dl(parm,'gaode')
    }
}))
app.listen(10003);

