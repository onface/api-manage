import extend from "extend"
import defaultSettings from "./defaultSettings"
class Api {
    constructor(settings) {
        settings = extend(true, {}, defaultSettings.BetterAPI(), settings)
        this.settings = settings
    }
}
Api.prototype.create = function (createSettings) {
    const self = this
    createSettings =  extend(true, {}, defaultSettings.create(), createSettings)
    return function request(data, responseType, callback) {
        callback = extend(true, {}, defaultSettings.request.callback(), callback)
        callback.before()
        var sendData = data
        var fetchSettins = extend(true, {}, self.settings.defaultSettings, createSettings.settings)
        var userCallbackDone = callback.net.done
        var userCallbackFail = callback.net.fail
        let failArg = []
        callback.net.fail = function proxyFail (...arg) {
            var command = {
                defaultAction: function () {
                    self.settings.defaultCallback.net.fail.apply(null, arg)
                }
            }
            failArg = arg
            if (typeof userCallbackFail === 'function') {
                userCallbackFail.apply(command, arg)
            }
            else {
                command.defaultAction()
            }
            self.settings.loading(false, failArg)
            createSettings.loading(false, failArg)
            callback.loading(false, failArg)
        }
        callback.net.done = function proxyDone(res) {

            res = self.settings.output(res, sendData)
            res = createSettings.output(res, sendData)
            userCallbackDone.apply(null, [res])
            Object.keys(responseType).forEach(function (key) {
                if (key[0] === '$') {
                    delete responseType[key]
                }
            })
            var typeKey = self.settings.judgeResponseType.apply(null, [res])
            var defaultResponse = self.settings.defaultResponseType[typeKey]
            var userResponse = responseType[typeKey]
            var command = {
                defaultAction: function () {
                    defaultResponse(res)
                }
            }
            if (typeof defaultResponse === 'undefined' && typeof userResponse === 'undefined') {
                console.warn(`node_modules/better-api: request(settings, callback); callback["${typeKey}"] must be a function`)
            }
            else {
                if (userResponse) {
                    userResponse.apply(command, [res])
                }
                else {
                    command.defaultAction()
                }
            }
            self.settings.loading(false, failArg)
            createSettings.loading(false, failArg)
            callback.loading(false, failArg)
        }
        sendData = self.settings.input(sendData)
        sendData = createSettings.input(sendData)
        self.settings.loading(true, failArg)
        createSettings.loading(true, failArg)
        callback.loading(true, failArg)
        return self.settings.fetch(sendData, fetchSettins, callback)
    }
}
module.exports = Api
