class Api {
    constructor(settings) {
        this.settings = settings
    }
}
Api.prototype.create = function (settings) {
    const self = this
    return function (data, callback) {
        data.url = settings.url
        self.settings.fetch(
            data,

        )
    }
}
module.exports = Api

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
