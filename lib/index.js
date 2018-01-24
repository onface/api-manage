import { Component } from "react"
import extend from "extend"
import util from "util.react"
require('./index.css')
class Button extends Component {
    constructor (props) {
        super(props)
        const self = this
        this.state = {
            shadow: false
        }
        self.shadowTimer = false
    }
    proxyClick = (e) => {
        const self = this
        self.props.onClick(e)
        if (self.state.show) {
            clearTimerout(self.shadowTimer)
        }
        self.setState({
            shadow: true
        })
        self.shadowTimer = setTimeout(function () {
            self.setState({
                shadow: false
            })
        }, 400)
    }
    render() {
        const self = this
        var rootClassName = [
            self.props.prefixClassName,
            util.themes(self.props),
            self.props.prefixClassName,
            self.props.loading? `${self.props.prefixClassName}--loading`:'',
            self.props.loading? `${self.props.prefixClassName}--loading`:'',
            self.props.type? `${self.props.prefixClassName}--${self.props.type}`:'',
            self.props.dashed? `${self.props.prefixClassName}--dashed`:'',
            self.props.ghost? `${self.props.prefixClassName}--ghost`:'',
            self.state.shadow? `${self.props.prefixClassName}--clicked`:'',

        ].join(' ')
        var cloneProps = extend(true, {}, self.props)
        delete cloneProps.prefixClassName
        delete cloneProps.loading
        delete cloneProps.dashed
        delete cloneProps.ghost
        delete cloneProps.disabled
        return (
            <span
                ref="root"
                {...cloneProps}
                onClick={self.proxyClick}
                className={rootClassName}
                disabled={self.props.type === 'disabled'}
            >
            {self.props.children}
            </span>
        )
    }
}
require('./props').default(Button)
export default Button
module.exports= Button
