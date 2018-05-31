module.exports = {
    BetterAPI: function () {
        return {
            check: function (res, req, settings) {

            },
            defaultCallback: {
                net: {
                    fail: function () {

                    }
                }
            },
            loading: function () {

            },
            input: function (req) {
                return req
            },
            output: function (res) {
                return res
            }
        }
    },
    create: function () {
        return {
            settings: {},
            check:{},
            loading: function () {

            },
            input: function (req) {
                return req
            },
            output: function (res, req) {
                return res
            }
        }
    },
    request: {
        callback: function () {
            return {
                loading: function () {

                },
                before: function () {

                },
                after: function () {

                },
                net: {
                    done: function () {

                    }
                }
            }
        }
    }
}
