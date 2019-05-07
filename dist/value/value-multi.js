"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const value_1 = require("./value");
const utils_1 = require("../utils");
const button_1 = require("../components/button");
const DefaultIcon = () => React.createElement(value_1.Icon, { className: "react-timebomb-icon", icon: "\uD83D\uDCC5" });
function Value(props) {
    const { value } = props;
    if (!value) {
        return null;
    }
    return React.createElement(React.Fragment, null, value.map(d => utils_1.dateFormat(d, 'DD.MM.YYYY')).join(' – '));
}
function ValueMulti(props) {
    const { placeholder, value, open, disabled, arrowButtonId, iconComponent, onToggle } = props;
    const ArrowButtonComp = props.arrowButtonComponent || button_1.ArrowButton;
    const ClearComponent = props.clearComponent || value_1.DefaultClearComponent;
    const showPlaceholder = placeholder && !open;
    const IconComponent = iconComponent !== undefined ? iconComponent : DefaultIcon;
    React.useEffect(() => {
        document.body.addEventListener('keyup', onKeyUp);
        return () => {
            document.body.removeEventListener('keyup', onKeyUp);
        };
    }, []);
    function onClear(e) {
        e.stopPropagation();
        props.onClear();
    }
    function onKeyUp(e) {
        switch (e.keyCode) {
            case utils_1.keys.ESC:
                if (open) {
                    onToggle();
                }
                break;
        }
    }
    return (React.createElement(value_1.Container, { "data-role": "value", className: "react-slct-value react-timebomb-value", disabled: disabled, onClick: disabled ? undefined : onToggle },
        React.createElement(value_1.Flex, null,
            IconComponent && React.createElement(IconComponent, null),
            React.createElement(value_1.Flex, null,
                React.createElement(Value, Object.assign({}, props)),
                showPlaceholder && (React.createElement(value_1.Placeholder, { className: "react-timebomb-placeholder" }, placeholder)))),
        React.createElement(value_1.Flex, null,
            value && (React.createElement(value_1.ClearButton, { className: "react-timebomb-clearer", disabled: disabled, tabIndex: -1, onClick: onClear },
                React.createElement(ClearComponent, null))),
            React.createElement(ArrowButtonComp, { id: arrowButtonId, disabled: disabled, open: open }))));
}
exports.ValueMulti = ValueMulti;
//# sourceMappingURL=value-multi.js.map