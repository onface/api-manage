var PropTypes = require('prop-types')
var createPropType = function (settings = {}) {
    if (settings.isRequired) {
        var FacePropTypes = {}
        Object.keys(PropTypes).forEach(function (key) {
            switch(key) {
                case 'array':
                case 'bool':
                case 'number':
                case 'object':
                case 'string':
                case 'symbol':
                case 'any':
                case 'element':
                case 'node':
                    if (settings.isRequired) {
                        return FacePropTypes[key] = PropTypes[key].isRequired
                    }
                    else {
                        FacePropTypes[key] = PropTypes[key]
                    }
                break
                case 'arrayOf':
                case 'instanceOf':
                case 'objectOf':
                case 'oneOf':
                case 'oneOfType':
                case 'shape':
                    if (settings.isRequired) {
                        // example: arrayOf(string)
                        FacePropTypes[key] = function (...arg) {
                            return PropTypes[key].apply(PropTypes, arg).isRequired
                        }
                    }
                    else {
                        FacePropTypes[key] = PropTypes[key]
                    }
                break
                default:
                // exact
                // checkPropTypes
                // PropTypes
                FacePropTypes[key] = PropTypes[key]
            }
        })
        return FacePropTypes
    }
    else {
        return PropTypes
    }
}
module.exports = createPropType
