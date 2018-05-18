module.exports = {
    BetterAPI: function () {
        return {
            input: function (req) {
                return req
            },
            output: function (res, req) {
                return res
            }
        }
    },
    create: function () {
        return {
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
                $before: function () {

                },
                $after: function () {

                },
                $net: {
                    done: function () {

                    }
                }
            }
        }
    }
}
