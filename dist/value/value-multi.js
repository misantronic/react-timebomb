"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const value_1 = require("./value");
const utils_1 = require("../utils");
const button_1 = require("../components/button");
const DefaultIcon = () => React.createElement(value_1.Icon, { className: "react-timebomb-icon", icon: "\uD83D\uDCC5" });
class ValueMulti extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onClear = this.onClear.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }
    componentDidMount() {
        document.body.addEventListener('keyup', this.onKeyUp);
    }
    componentWillUnmount() {
        document.body.removeEventListener('keyup', this.onKeyUp);
    }
    render() {
        const { placeholder, value, open, disabled, arrowButtonId, iconComponent, onToggle } = this.props;
        const ArrowButtonComp = this.props.arrowButtonComponent || button_1.ArrowButton;
        const showPlaceholder = placeholder && !open;
        const IconComponent = iconComponent !== undefined ? iconComponent : DefaultIcon;
        return (React.createElement(value_1.Container, { "data-role": "value", className: "react-slct-value react-timebomb-value", disabled: disabled, onClick: disabled ? undefined : onToggle },
            React.createElement(value_1.Flex, null,
                IconComponent && React.createElement(IconComponent, null),
                React.createElement(value_1.Flex, null,
                    this.renderValue(),
                    showPlaceholder && (React.createElement(value_1.Placeholder, { className: "react-timebomb-placeholder" }, placeholder)))),
            React.createElement(value_1.Flex, null,
                value && (React.createElement(value_1.ClearButton, { className: "react-timebomb-clearer", disabled: disabled, tabIndex: -1, onClick: this.onClear }, "\u00D7")),
                React.createElement(ArrowButtonComp, { id: arrowButtonId, disabled: disabled, open: open }))));
    }
    renderValue() {
        const { value } = this.props;
        if (!value) {
            return null;
        }
        return value.map(d => utils_1.dateFormat(d, 'DD.MM.YYYY')).join(' – ');
    }
    onClear(e) {
        e.stopPropagation();
        this.props.onClear();
    }
    onKeyUp(e) {
        const { open, onToggle } = this.props;
        switch (e.keyCode) {
            case utils_1.keys.ESC:
                if (open) {
                    onToggle();
                }
                break;
        }
    }
}
exports.ValueMulti = ValueMulti;
//# sourceMappingURL=value-multi.js.map