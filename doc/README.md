# better-api


````code
{
    title: '基础使用',
    desc: '',
    html: '<button id="basic-pass" >pass</button> <button id="basic-fail" >fail</button>',
    js: './basic.demo.js',
    source: './basic.demo.js',
    open: true
}
````



```js
var request = api.create({
    settings: {
        url: '/login',
        type: 'post'
        // dataType: 'json' // 在 defaultSettings 已经定义，无需配置
    },
    input: function (req) {
        req.$testInputLogin = true
        return req
    },
    output: function (res) {
        res.$testOutputLogin = true
        return res
    }
})
request(
        {
            user: 'nimo',
            passwrod: '1234'
        },
        {
            // 请求发送前执行，适合修改 loading 状态
            $before: function () {

            },
            $after: function () {

            },
            // responseType: success
            success: function (res) {

            },
            /*
            // responseType: error
            error: function (res) {

            },
            */
            $net: {
                done: function (res) {

                },
                fail: function () {

                }
            }
        }
)
```
