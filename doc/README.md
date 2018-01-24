# 文档

## 登录

接口文档如下:

```
POST /login
request:
    {
        user: 'nimo',
        password: '12345'
    }
response:
    {
        status: 'ok'
    }
    {
        status: 'error',
        // 错误代码： 分别有 1 用户名错误, 2 密码错误 3 用户被禁用
        code: '1'
    }
```
封装
```js
// api/login.js
var ApiManage = require('api-manage')
var dict = request('code-dict')
dict.addCode('loginFail', {
    'user error': '1',
    'password error': '2',
    'user disabled': '3'
})
var apiManage = new ApiManage({
    fetch: function (settings, callback) {
        return $.ajax(settings)
            .done(callback.done)
            .fail(function(executeAction) {
                if (executeAction) {
                    alert('网络错误')
                }
                callback.fail.apply(,callback.fail)
            })
            .always(callback.always)
    },
    doneJudgeType: function (res) {
        return res.status
    }
})
module.exports = apiManage({
    url: '/login',
    input: function (req) {
        // req = request
        return req
    },
    output: function (res) {
        // res = response
        res.$code = dict('loginFail', res.code)
        /*
         *
         * 如果需要中文消息，可以在此处扩展数据
         *
         * var msgMap = {
         *     'user error': '用户不存在',
         *     'password error': '密码错误',
         *     'user disabled': '用户被禁用'
         * }
         * res.$msg = msgMap[res.$code]
         */
    },
    defaultDoneType: {
        error: function (res) {
            alert('错误', res.$code)
        }
    }
})
```

经过封装，接口调用方式应该是：

```js
var apiLogin = require('./api/login')
apiLogin({
    user: 'nimo',
    password: '12345'
}, {
    ok: function () {
        location.href = '/system'
    },
    error: function (res) {
        alert(res.$code)
    },
    // 请求发送前执行，适合修改 loading 状态
    before: function () {

    },
    after: function () {
        // 无论成功失败都会执行
    },
    // 网络层面的请求结果, 比如 $.ajax().done().fail().always()
    net: {
        settings: {
            timeout: 2000,
        },
        done: function (commonAction) {
            commonAction()
        },
        // 网络失败
        fail: function (commonAction) {
            // commonAction 是一些公用执行方法，比如配置了网络错误出现弹窗
            commonAction()
        },
        ""
        always: function (commonAction) {
            commonAction()
        }
    }
})
apiLogin.isBusy() // return boolean
// 如果 fetch 用的是 jQuery.ajax ，这里的 fetch 就是 jQuery.ajax 返回的 jqXHR
apiLogin.fetch.abort()
```

````code
{
    title: '登录',
    desc: '',
    html: '<div id="basic-demo" ></div>',
    js: './basic.demo.js',
    source: './basic.demo.js',
    open: true
}
````
