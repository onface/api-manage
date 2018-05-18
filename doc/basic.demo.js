var BetterAPI = require('better-api')
var $ = require('jquery')
var api = new BetterAPI({
    defaultSettings: {
        dataType: 'json'
    },
    input: function (req) {
        return req
    },
    output: function (res, req) {
        return res
    },
    fetch: function (data, settings, callback) {
        settings.data = data
        $.ajax(settings)
                .done(callback.$net.done)
                .fail(function () {
                    if (typeof callback.$net.fail === 'function') {
                        callback.$net.fail.apply(null, arguments)
                    // var getUser = $.ajax();  getUser.abort()
                    } else if (arguments[1] !== 'abort') {
                        alert('网络错误，请刷新重试')
                    }
                }).always(callback.$after)
    },
    judgeResponseType: function (res) {
        return res.status
    },
    defaultResponseType: {
        error: function (res) {
            alert(res.msg)
        }
    }
})
var apiPass = api.create({
    settings: {
        url: 'http://echo.onface.live/onface/better-api/master/doc/mock/pass',
        type: 'get'
    }
})
var apiFail = api.create({
    settings: {
        url: 'http://echo.onface.live/onface/better-api/master/doc/mock/fail',
        type: 'get'
    }
})
$(function () {
    $('#basic-pass').on('click', function () {
        apiPass(
            // data
            {
                name: 'nimo'
            },
            // callback
            {
                pass: function () {
                    alert('操作成功')
                },
                fail: function (res) {
                    alert(res.msg)
                }
            }
        )
    })
    $('#basic-fail').on('click', function () {
        apiFail(
            // data
            {
                name: 'nimo'
            },
            // callback
            {
                pass: function () {
                    alert('操作成功')
                },
                fail: function (res) {
                    alert(res.msg)
                }
            }
        )
    })
})
// http://echo.onface.live/onface/better-api/master/doc/mock/pass
