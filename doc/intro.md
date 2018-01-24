# 指引

> 使用一个组件或模块之前，应当知道它能解决的问题是什么，不能解决的问题是什么。使用的最佳实践是什么？

> 建议读者看完这篇指引后，根据自己业务情况决定要不要使用 `api-manage` 。活动页面的零时网站和数据接口良好的项目不一定需要 `api-manage`。

## 为什么要封装

1. 过滤服务器端数据
2. 统一管理和语义化接口

### 过滤服务器端数据

```js
// GET /user
[
    {
        type: 0, // 未激活
        name: 'nimo'

    },
    {
        type: 1, // 已激活
        name: 'tim'
    },
    {
        type: 2, // 禁用
        name: 'wisdom'
    }
]
```

如果直接使用此数据，前端逻辑代码会变得很糟糕。

```js
if (user.type === 2) {
    alert('用户被禁用')
}
```


### 统一管理和语义化接口

有时候会遇到多个页面请求同一个接口的情况

```js
// 下面这段代码需要出现在 newsAdd.js 和 somePage.js 文件中
$.ajax({
    type: 'post',
    url: '/news',
    dataType: 'json'
}).done(function (res) {
    /** res 数据格式
        {
            status: 'pass',
            newsid: 'egvw423h35hy35hqgwfwsfw2'
        }
        {
            status: 'fail',
            code: 'sensitiveWords'
        }
     */
     var failDict = {
         'sensitiveWords': '包含敏感词',
         'limit': '每分钟只能发布一条新闻'
     }
     if (res.status === 'pass') {

         /* newsAdd.js 只需要弹窗 */
         alert('添加新闻成功')

         /* somePage.js 需要跳转到新闻页 */
         // location.href = '/news?id=' + newsid

     }
     else {
         let failMessage = failDict[res.code]
         if(typeof failMessage === 'undefined') {
             alert('添加失败，请联系管理员！错误代码：' + res.code)
         }
         else {
             alert(failMessage)
         }
     }
})
```

两个文件同时存在一样的代码，会难以维护。但是两个文件对于 `res.status === 'pass'` 情况下的处理方式又不同


## 如何使用

### 数据过滤


我们期望后端返回的数据是

```js
[
    {
        name: 'nimo',
        // 连注释都不用写了
        type: 'inactive'
    },
    {
        name: 'tim',
        type: 'active'
    },
    {
        name: 'wisdom',
        type: 'disable'
    }
]
```


### 统一管理和语义化接口

封装后可以非常优雅的调用接口

```js
// newsAdd.js
var apiNews = require('./m/api/news')
var sendData = {
    title: 'abc',
    content: 'xxxxoxoxoxoxox'
}
apiNews.post(
    sendData,
    {
        pass: function () {
            alert('添加新闻成功')
        },
        fail: function (failMessage, code) {
            alert(failMessage)
        }
    }
)
```

```js
// somePage.js
var apiNews = require('./m/api/news')

var sendData = {
    title: 'abc',
    content: 'xxxxoxoxoxoxox'
}
apiNews.post(
    sendData,
    {
        pass: function (newsid) {
            alert('添加新闻成功，跳转至新闻页')
            location.href = '/news?id=' + newsid
        },
        fail: function (failMessage, code) {
            alert(failMessage)
        }
    }
)
```

## 封装的分层

封装接口分为以下四个层面

1. **底层**: XHR - ES6 fetch - wx.request
2. **语法封装**：jQuery.ajax
3. **项目通用业务逻辑封装**：proxy （网络错误 alert 弹窗，或者将错误发送到服务器端,服务器超过规定时间未响应，则弹出错误）
4. **具体接口语义化封装**： apiLogin(data, settings) settings.pass settings.error  settings.inactive

`api-manage` 负责 3/4 的封装。底层一般由客户端环境（浏览器）提供。语法封装根据底层决定选择哪个库，或者根据业务情况自行编写。


## 字典辅助

有时候后端返回的 `type` 不是英文单词，而是自然数 `1` `2` `3` `4`。这种情况可以使用 `code-dict`

```js
var dict = require('code-dict')
dict.addCode('sms', {
    'login': 1,
    'register': 2
})
dict.get('sms', 'login') // 1
dict.get('sms', '1') // login
// 因为数据有时候返回的是 1 有时返回的是 "1" 。前端对接口返回的严谨性不可控，所以允许 1 == "1"
dict.get('sms', 1) // login
```
