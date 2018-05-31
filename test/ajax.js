module.exports = function (settings, callback) {
    window.ONFACE_BETTER_API_TEST_AJAX = {}
    ONFACE_BETTER_API_TEST_AJAX[settings.url] = settings
    setTimeout(function () {
        switch(settings.url) {
            case '/login-fail':
                callback.fail('失败原因')
            break
            case '/login-error':
                callback.done({
                    status: 'error'
                })
            break
            case '/login-error-output':
                callback.done({
                    status: '0'
                })
            break
            case '/login-success':
                callback.done({
                    status: 'success'
                })
            break
            default:
                callback.done({
                    status: 'success'
                })
        }
        callback.always()
    }, 10)
}
