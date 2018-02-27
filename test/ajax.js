module.exports = function (settings, callback) {
    window.ONFACE_BETTER_API_TEST_AJAX = {}
    ONFACE_BETTER_API_TEST_AJAX[settings.url] = settings
    setTimeout(function () {
        callback.done({
            status: 'success'
        })
        callback.always()
    }, 10)
}
