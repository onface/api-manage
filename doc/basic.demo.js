var BetterAPI = require('better-api')
var $ = require('jquery')
var message = require('face-message')
var api = new BetterAPI({
    defaultSettings: {
        dataType: 'json'
    },
    loading: function (isLoading, failArg) {
        if (isLoading) {
            message.loadingBar.show(2)
        }
        else if (failArg[2] !== 'abort') {
            message.loadingBar.fail()
        }
        else {
            message.loadingBar.hide()
        }
    },
    input: function (req) {
        return req
    },
    output: function (res, req) {
        return res
    },
    fetch: function (data, settings, callback) {
        settings.data = data
        return $.ajax(settings)
                .done(callback.net.done)
                .fail(callback.net.fail)
                .always(callback.after)
    },
    defaultCallback: {
        net: {
            fail: function () {
                message.error('网络错误')
            }
        }
    },
    judgeResponseType: function (res) {
        return res.status
    },
    defaultResponseType: {
        fail: function (res) {
            message.error('fail:' + res.msg)
        },
        error: function (res) {
            message.error('error:' + res.msg)
        }
    }
})
var apiPass = api.create({
    settings: {
        url: 'http://118.25.125.213:9823/onface/better-api/master/doc/mock/pass',
        type: 'get'
    }
})
var apiFail = api.create({
    settings: {
        url: 'http://118.25.125.213:9823/onface/better-api/master/doc/mock/fail',
        type: 'get'
    }
})
var apiNetFail = api.create({
    settings: {
        url: '/404',
        type: 'get'
    }
})
var apiDelay = api.create({
    settings: {
        url: 'http://118.25.125.213:9823/onface/better-api/master/doc/mock/pass?$delay=1000',
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
                    message.success('操作成功')
                },
                fail: function (res) {
                    message.error(res.msg)
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
                    message.error(res.msg)
                }
            }
        )
    })
    $('#basic-fail-detailAction').on('click', function () {
        apiFail(
            // data
            {
                name: 'nimo'
            },
            // callback
            {
                pass: function () {
                    message.success('操作成功')
                },
                fail: function (res) {
                    this.defaultAction()
                    message.error('More message (fail)')
                }
            }
        )
    })
    $('#basic-net-fail').on('click', function () {
        apiNetFail()
    })
    $('#basic-net-fail-custom').on('click', function () {
        apiNetFail({}, {}, {
            net: {
                fail: function () {
                    message.error('（自定义）网络错误')
                }
            }
        })
    })
    $('#basic-net-fail-defaultAction').on('click', function () {
        apiNetFail({}, {}, {
            net: {
                fail: function () {
                    this.defaultAction()
                    message.error('More message ($net.fail)')
                }
            }
        })
    })
    $("#basic-abort").on('click', function () {
        var api = apiDelay({}, {}, {
            net: {
                fail: function () {
                    console.log(arguments)
                }
            }
        })
        api.abort()
    })
})
// http://echo.onface.live/onface/better-api/master/doc/mock/pass
