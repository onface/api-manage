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
    return function request(data, callback) {
        callback = extend(true, {}, defaultSettings.request.callback(), callback)
        callback.$before()
        var sendData = data
        var fetchSettins = extend(true, {}, self.settings.defaultSettings, createSettings.settings)
        var userCallbackDone = callback.$net.done
        callback.$net.done = function proxyDone(res) {

            res = self.settings.output(res)
            res = createSettings.output(res)
            userCallbackDone.apply(null, arguments)
            var responseType = extend(true, {}, self.settings.defaultResponseType, callback)
            Object.keys(responseType).forEach(function (key) {
                if (key[0] === '$') {
                    delete responseType[key]
                }
            })
            var typeKey = self.settings.judgeResponseType.apply(null, arguments)
            if (typeof responseType[typeKey] === 'function') {
                responseType[typeKey].apply(null, arguments)
            }
            else {
                console.warn(`node_modules/better-api: request(settings, callback); callback["${typeKey}"] must be a function`)
            }

        }
        sendData = self.settings.input(sendData)
        sendData = createSettings.input(sendData)
        self.settings.fetch(sendData, fetchSettins, callback)
    }
}
module.exports = Api
