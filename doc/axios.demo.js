var BetterAPI = require('better-api')
var axios = require('axios')
var message = require('face-message')
var CancelToken = axios.CancelToken

var api = new BetterAPI({
    defaultSettings: {
        dataType: 'json'
    },
    loading: function (isLoading, failArg) {
        // console.log(failArg)
        // if (isLoading) {
        //     message.loadingBar.show(2)
        // }
        // // failArg = [jqXHR, textStatus, errorThrown]
        // else if (failArg[1] !== 'abort') {
        //     message.loadingBar.fail()
        // }
        // // else if (failArg[1] === 'abort') {
        // //     message.loadingBar.hide()
        // // }
        // else {
        //     message.loadingBar.hide()
        // }
    },
    input: function (req) {
        return req
    },
    output: function (res, req) {
        return res
    },
    fetch: function (data, settings, callback) {
        settings.data = data
        settings.method = settings.type.toUpperCase()
        if (settings.method === 'GET') {
            // settings.url = `${settings.url}?${qs.stringify(settings.data)}`
            settings.params = data
            delete settings.data
        }
        let axiosCencel
        settings.cancelToken = new CancelToken((cancel) => {
            axiosCencel = cancel
        })

        axios(settings)
        .then(function(res){
            callback.net.done(res.data)
            callback.after()
        })
        .catch(function(error){
            callback.after()
            if (error.response || error.request || error.message === 'abort') {
                callback.net.fail(error)
            }
            else {
                throw error
            }
        })
        return {
            abort: () => {
                if (typeof axiosCencel === 'function') {
                    axiosCencel('abort')
                }
            }
        }

    },
    defaultCallback: {
        net: {
            fail: function (error) {
                if (/timeout/.test(error.message)) {
                     message.error('网络超时')
                }
                else if (/abort/.test(error.message)) {
                    // cancel request
                }
                else {
                    message.error('网络错误' + error.message)
                }
            }
        }
    },
    judgeResponseType: function (res) {
        return res.status
    },
    defaultResponseType: {
        pass: function () {
            message.success('操作成功')
        },
        fail: function (res) {
            message.error('fail:' + res.msg)
        },
        error: function (res) {
            message.error('error:' + res.msg)
        }
    }
})

var apiTimeout = api.create({
    settings: {
        url: 'http://118.25.125.213:9823/onface/echo/mock/pass?$delay=1000',
        type: 'get',
        timeout: 400
    }
})

$('#axios-timeout').on('click', function () {
    apiTimeout()
})

var apiNotfound = api.create({
    settings: {
        url: '/errorUrl',
        type: 'get',
        timeout: 400
    }
})

$('#axios-404').on('click', function () {
    apiNotfound()
})


var apiAbort = api.create({
    settings: {
        url: 'http://118.25.125.213:9823/onface/echo/mock/pass?$delay=1000',
        type: 'get'
    }
})


$('#axios-abort').on('click', function () {
    var reqeust = apiAbort(
        {},
        {},
        {
            loading: function (isLoading, failArg) {
                if (isLoading) {
                    message.loadingBar.show()
                }
                else {
                    message.loadingBar.hide()
                }
            }
        }
    )
    reqeust.abort()

})
