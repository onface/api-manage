module.exports = {
    BetterAPI: function () {
        return {
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
            loading: function () {

            },
            input: function (req) {
                return req
            },
            output: function (res, req) {
                return res
            },
            check
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
