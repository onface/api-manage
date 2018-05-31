import BetterAPI from "../lib/index"
import { expect } from 'chai';
import ajax from './ajax'

var checkTempData = []
var api = new BetterAPI({
    check: function (...arg) {
        checkTempData = arg
    },
    defaultSettings: {
        dataType: 'json'
    },
    input: function (req) {
        req.$testInputCommon = true
        return req
    },
    output: function (res, req) {
        res.$testOutputCommon = true
        return res
    },
    fetch: function (data, settings, callback) {
        settings.data = data
        return ajax(settings, {
            done: callback.net.done,
            fail: callback.net.fail,
            always: callback.after
        })
    },
    defaultCallback: {
        net: {
            fail: function (jqXHR, textStatus) {
                switch(textStatus) {
                    case 'timeout':

                    break
                    case 'abort':
                    break
                    default:

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
    },
    defaultCallback: {
        net: {
            fail: function (jqXHR, textStatus) {
                window.errorLog = window.errorLog || []
                window.errorLog.push('网络错误，请刷新重试')
            }
        }
    }
})

describe('basic', () => {
    it('basic function', (done) => {
        var busy = null
        setTimeout(function () {
            expect(busy).to.equal(true)
        }, 1)
        api.create({
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
        })( {
                user: 'nimo',
                passwrod: '1234'
            },
            {
                // responseType: success
                success: function (res) {
                    expect(ONFACE_BETTER_API_TEST_AJAX['/login'])
                    .to.eql(
                        {
                            "dataType":"json",
                            "url":"/login",
                            "type":"post",
                            "data":{
                                "user":"nimo",
                                "passwrod":"1234",
                                "$testInputCommon":true,
                                "$testInputLogin": true
                            },
                        }
                    )
                    expect(res).to.eql({
                        status: 'success',
                        $testOutputCommon: true,
                        $testOutputLogin: true
                    })
                    setTimeout(function () {
                        expect(busy).to.equal(false)
                        done()
                    }, 12)
                },
                /*
                // responseType: error
                error: function (res) {

                },
                */
            },
            {
                // 请求发送前执行，适合修改 loading 状态
                before: function () {
                    busy = true
                },
                after: function () {
                    busy = false
                },
                done: function (res) {
                    expect(JSON.stringify(res)).to.equal(JSON.stringify({
                        status: 'success',
                        $testOutputCommon: true,
                        $testOutputLogin: true
                    }))
                },
                fail: function () {

                }
            }
        )
    });
    it('basic net fail', (done) => {
        api.create({
            settings: {
                url: '/login-fail',
                type: 'post'
            }
        })( {
                user: 'nimo',
                passwrod: '1234'
            },
            {
                success: function (res) {
                    expect('success不应该被调用').to.equal()
                },
            },
            {
                net: {
                    done: function (res) {
                        expect('$net.done不应该被调用').to.equal()
                    },
                    fail: function (msg) {
                        expect(msg).to.equal('失败原因')
                        expect(window.errorLog).to.equal(undefined)
                        done()
                    }
                }
            }
        )
    });
    it('default net fail', (done) => {
        api.create({
            settings: {
                url: '/login-fail',
                type: 'post'
            }
        })( {
                user: 'nimo',
                passwrod: '1234'
            },
            {
                success: function (res) {
                    expect('success不应该被调用').to.equal()
                }
            },
            {
                net: {
                    done: function (res) {
                        expect('$net.done不应该被调用').to.equal()
                    },
                    fail: function () {
                        done()
                    }
                }
            }
        )
    })
    it('response error', (done) => {
        api.create({
            settings: {
                url: '/login-error',
                type: 'post'
            }
        })( {
                user: 'nimo',
                passwrod: '1234'
            },
            {
                error: function (res) {
                    expect(res.status).to.equal('error')
                    done()
                }
            }
        )
    })
    it('response error output', (done) => {
        api.create({
            settings: {
                url: '/login-error-output',
                type: 'post'
            },
            output: function (res) {
                if (res.status === '0') {
                    res.status = 'error'
                }
                return res
            }
        })( {
                user: 'nimo',
                passwrod: '1234'
            },
            {
                error: function (res) {
                    expect(res.status).to.equal('error')
                    done()
                }
            }
        )
    })
    it('check new BetterAPI', (done) => {
        api.create({
            settings: {
                url: '/login-pass',
                type: 'post'
            },
            input: function (req) {
                req.inputDebug = 1
                return req
            },
            output: function (res) {
                res.ouputDebug = 1
                return res
            }
        })({}, {
            success: function (res) {
                expect(checkTempData).to.eql(
                    [
                        {
                            "status": "success"
                        },
                        {
                            "$testInputCommon": true,
                            "inputDebug": 1
                        },
                        {
                            "url": "/login-pass",
                            "type": "post"
                        }
                    ]
                )
                done()
            }
        })


    })
})
