"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueMulti = void 0;
const React = require("react");
const styled_components_1 = require("styled-components");
const button_1 = require("../components/button");
const utils_1 = require("../utils");
const value_1 = require("./value");
const DefaultIcon = () => React.createElement(value_1.Icon, { className: "react-timebomb-icon", icon: "\uD83D\uDCC5" });
const StyledValue = styled_components_1.default(Value) `
    > span:after {
        content: ' – ';
    }

    > span:last-child:after {
        content: '';
    }
`;
const HoverSpan = styled_components_1.default.span `
    opacity: 0.5;
`;
function Value(props) {
    const { value, className } = props;
    const LabelComponent = props.labelComponent;
    const onClickDate = (e) => {
        if (props.selectRange === true) {
            const { currentTarget } = e;
            setTimeout(() => {
                const date = new Date(currentTarget.getAttribute('data-date') || 0);
                const index = parseInt(currentTarget.getAttribute('data-index') || '0', 10);
                props.onValueSelect(date, index);
            }, 0);
        }
        else if (props.onToggle) {
            props.onToggle();
        }
    };
    const content = (() => {
        if (!value) {
            return null;
        }
        if (LabelComponent) {
            return React.createElement(LabelComponent, Object.assign({}, props));
        }
        if (value.length === 1) {
            return React.createElement("span", null, utils_1.dateFormat(value[0], props.format));
        }
        return (React.createElement(React.Fragment, null, value.map((d, i) => {
            const str = utils_1.dateFormat(d, props.format);
            if (utils_1.dateEqual(d, props.hoverDate)) {
                return (React.createElement(HoverSpan, { key: i, onClick: props.onToggle }, str));
            }
            else {
                return (React.createElement("span", { key: i, "data-index": i, "data-date": d.toDateString(), onClick: onClickDate }, str));
            }
        })));
    })();
    return React.createElement("div", { className: className }, content);
}
exports.ValueMulti = React.forwardRef((props, ref) => {
    const { placeholder, value, open, disabled, arrowButtonId, iconComponent, onToggle } = props;
    const ArrowButtonComp = props.arrowButtonComponent || button_1.ArrowButton;
    const ClearComponent = props.clearComponent || value_1.DefaultClearComponent;
    const showPlaceholder = placeholder && !value;
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
                if (open && onToggle) {
                    onToggle();
                }
                break;
        }
    }
    return (React.createElement(value_1.Container, { "data-role": "value", className: "react-slct-value react-timebomb-value", disabled: disabled, ref: ref, onClick: value || disabled ? undefined : onToggle },
        React.createElement(value_1.Flex, null,
            IconComponent && React.createElement(IconComponent, null),
            React.createElement(value_1.Flex, null,
                React.createElement(StyledValue, Object.assign({}, props)),
                showPlaceholder && (React.createElement(value_1.Placeholder, { className: "react-timebomb-placeholder" }, placeholder)))),
        React.createElement(value_1.Flex, null,
            value && (React.createElement(ClearComponent, { disabled: disabled, onClick: onClear })),
            React.createElement(ArrowButtonComp, { id: arrowButtonId, disabled: disabled, open: open, onClick: disabled ? undefined : onToggle }))));
});
//# sourceMappingURL=value-multi.js.map