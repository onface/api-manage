import extend from "safe-extend"
class BetterAPI {
    constructor(lifecycle) {
        const self = this
        self.lifecycle = lifecycle
    }
}
BetterAPI.prototype.create = function (options) {
    const self = this
    settings = extend(
        true,
        self.createDefaultSettings,
        options.settings
    )
    return function () {

    }
}
