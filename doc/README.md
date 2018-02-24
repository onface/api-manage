# API

```js
var api = new BetterAPI({
    defaultSettings: {
        dataType: 'json'
    },
    input: function (req) {
        return req
    },
    output: function (res) {
        return res
    },
    fetch: function (settings, callback) {
        $.ajax(settings)
            .done(callback.$net.done)
            .fail(function(){
                if (typeof callback.$net.fail === 'function') {
                    callback.$net.fail.apply( ,arguments)
                }
                else {
                    if (arguments[1] !== 'abort') {
                        alert('网络错误，请刷新重试')
                    }
                }
            })
            .always(callback.$after)
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

var apiLogin = api.create({
    settings: {
        url: '/login',
        type: 'post'
        // dataType: 'json' // 在 defaultSettings 已经定义，无需配置
    },
    input: function (req) {
        return req
    },
    output: function (res) {
        return res
    }
})
apiLogin({
    user: 'nimo',
    passwrod: '1234'
}, {
    // 请求发送前执行，适合修改 loading 状态
    $before: function () {

    },
    // responseType: success
    success: function (res) {

    },
    /*
    // responseType: error
    error: function (res) {

    },
    */
    // 请求发送完成后执行，无论是否成功，适合修改 loading 状态
    $after: function () {

    },
    // 一般情况下用不到 $net
    /*
    $net: {
        done: function () {

        },
        fail: function () {

        }
    }
    */
})
```
