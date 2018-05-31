var BetterAPI = require('better-api')
var message  = require('face-message')
var $ = require('jquery')

var api = new BetterAPI({
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
var PropTypes = require('prop-types')
var apiAccount = api.create({
    settings: {
        url: 'http://118.25.125.213:9823/onface/echo/mock/pass',
        type: 'get'
    },
    check: {
        pass: function (res, settings) {
            var { string, bool,number, array,
                  oneOf, arrayOf, object,
                  objectOf, shape
                } = require('./face-prop-types')({isRequired: true})
            var notRequired = require('./face-prop-types')({isRequired: false})
            PropTypes.checkPropTypes(
                {
                    data: shape({
                        tip: notRequired.string,
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
        fail: function (res, settings) {
            var { string, bool,number, array,
                  oneOf, arrayOf, object,
                  objectOf, shape
                } = require('./face-prop-types')({isRequired: true})
            var notRequiredProp = require('./face-prop-types')({isRequired: false})
            PropTypes.checkPropTypes(
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
