const qiniu = require('qiniu')
const glob = require('glob')
const iPackage = require('../package.json')
if (!process.env.QINIU_AK || !process.env.QINIU_SK) {
    var qniuUserErrorMsg = 'Make sure the QINIU_AK and QINIU_SK environment variables are set.'
    console.error('---------------')
    console.error(qniuUserErrorMsg)
    console.error('---------------')
    throw new Error(qniuUserErrorMsg)
 }
const mac = new qiniu.auth.digest.Mac(process.env.QINIU_AK, process.env.QINIU_SK);
const cdnManager = new qiniu.cdn.CdnManager(mac)

var defaultDomain = 'https://onface.live'
var defaultPublichPath = defaultDomain + '/' + iPackage.$repository


var refreshFiles = glob.sync('output/**/**.**').map(function (path) {
    return path.replace(/^output\//g,'')
}).filter(function (path) {
    if (/^doc\/theme/.test(path)) {
        return false
    }
    return !/\d+\.\d+\.\d+/.test(path)
}).map(function (path) {
    return defaultPublichPath + path
})
console.log('refresh', refreshFiles)
cdnManager.refreshUrls(refreshFiles, function (err, respBody, respInfo) {
    if (err) {
       throw err;
   }
   console.log('statusCode: ' + respInfo.statusCode);
   if (respInfo.statusCode == 200) {
       var jsonBody = JSON.parse(respBody);
       console.log(
           JSON.stringify(jsonBody, null, 4)
       )
   }
})
