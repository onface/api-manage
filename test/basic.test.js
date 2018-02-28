import BetterAPI from "../lib/index"
import { expect } from 'chai';
import ajax from './ajax'

var api = new BetterAPI({
    defaultSettings: {
        dataType: 'json'
    },
    input: function (req) {
        req.$testInputCommon = true
        return req
    },
    output: function (res) {
        res.$testOutputCommon = true
        return res
    },
    fetch: function (data, settings, callback) {
        settings.data = data
        ajax(settings, {
            done:callback.$net.done,
            // TODO:// 待测试 fail
            fail: function () {
                if (typeof callback.$net.fail === 'function') {
                    callback.$net.fail.apply(null, arguments)
                }
                else {
                    if (arguments[1] !== 'abort') {
                        window.errorLog = window.errorLog || []
                        window.errorLog.push('网络错误，请刷新重试')
                    }
                }
            },
            always: callback.$after
        })
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
                // 请求发送前执行，适合修改 loading 状态
                $before: function () {
                    busy = true
                },
                $after: function () {
                    busy = false
                },
                // responseType: success
                success: function (res) {
                    expect(JSON.stringify(ONFACE_BETTER_API_TEST_AJAX['/login']))
                    .to.equal(JSON.stringify(
                        {
                            "dataType":"json",
                            "url":"/login",
                            "type":"post",
                            "data":{
                                "user":"nimo",
                                "passwrod":"1234",
                                "$testInputCommon":true,
                                '$testInputLogin': true
                            },
                        }
                    ))
                    expect(JSON.stringify(res)).to.equal(JSON.stringify({
                        status: 'success',
                        $testOutputCommon: true,
                        $testOutputLogin: true
                    }))
                    setTimeout(function () {
                        expect(busy).to.equal(false)
                        done()
                    }, 12)
                },
                /*
                // TODO:// 待测试 error
                // responseType: error
                error: function (res) {

                },
                */
                $net: {
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
                $net: {
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
                $after: function () {
                    expect(JSON.stringify(window.errorLog)).to.equal(JSON.stringify([ '网络错误，请刷新重试' ]))
                    done()
                },
                success: function (res) {
                    expect('success不应该被调用').to.equal()
                },
                $net: {
                    done: function (res) {
                        expect('$net.done不应该被调用').to.equal()
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
})
