var BetterAPI = require('better-api')
var message  = require('face-message')
var $ = require('jquery')
// https://onface.github.io/types/
var Types = require('face-types')({isRequired: true})
var {
    string, bool,number, array,
    oneOf, arrayOf, object,
    objectOf, shape
} = Types
var notRequiredTypes = require('face-types')({isRequired: false})

var api = new BetterAPI({
    check: function (res, req, settings) {
        if (settings.url !== 'some_special_url') {
            Types.check(
                {
                    status: oneOf(['pass', 'fail'])
                },
                res,
                'ajax',
                settings.url
            )
        }
    },
    defaultSettings: {
        dataType: 'json'
    },
    loading: function (isLoading, failArg) {
        if (isLoading) {
            message.loadingBar.show(2)
        }
        else {
            switch (failArg[1]) {
                case 'abort':

                    break;
                case undefined:
                    message.loadingBar.hide()
                    break
                default:
                    message.loadingBar.fail()
            }
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
            fail: function (jqXHR, textStatus) {
                switch(textStatus) {
                    case 'timeout':
                        message.error('网络超时')
                    break
                    case 'abort':
                    break
                    default:
                        message.error('网络错误')
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
var apiAccount = api.create({
    settings: {
        url: 'http://118.25.125.213:9823/onface/echo/mock/account',
        type: 'get'
    },
    check: {
        pass: function (res, req, settings) {
            var { string, bool,number, array,
                  oneOf, arrayOf, object,
                  objectOf, shape
                } = require('face-types')({isRequired: true})
            var notRequired = require('face-types')({isRequired: false})
            Types.check(
                {
                    data: shape({
                        test1: string,
                        test2: notRequiredTypes.string,
                        username: string,
                        age: number,
                        domains: arrayOf(string),
                        projects: arrayOf(
                            shape({
                                name: string,
                                url: string
                            })
                        ),
                        currentProject: shape({
                            name: string,
                            url: string
                        })
                    })
                },
                res,
                'ajax',
                settings.url
            )
        }
    }
})

$('#check-account').on('click', function () {
    apiAccount()
})

var apiFail = api.create({
    settings: {
        url: 'http://118.25.125.213:9823/onface/echo/mock/fail',
        type: 'get'
    },
    check: {
        fail: function (res, req, settings) {
            Types.check(
                {
                    msg: string
                },
                res,
                'ajax',
                settings.url
            )
        }
    }
})
$('#check-fail').on('click', function () {
    apiFail()
})
