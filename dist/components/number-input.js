"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const styled_components_1 = require("styled-components");
const utils_1 = require("../utils");
const Steps = styled_components_1.default.div `
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 0;
    top: 0;
    width: 24px;
    height: 100%;
    border-width: 0 1px;
    border-style: solid;
    border-color: #ccc;
    visibility: hidden;
`;
const Step = styled_components_1.default.button `
    margin: 0;
    padding: 0;
    line-height: 1;
    border: none;
    flex: 1;
    font-size: 8px;
    color: #ccc;
    cursor: pointer;
    -webkit-appearance: none;

    &:focus {
        outline: none;
    }

    &:hover {
        background: #eee;
        color: #000;
    }
`;
const InputContainer = styled_components_1.default.div `
    position: relative;
    flex: 1;
    display: flex;

    &:hover {
        ${Steps} {
            visibility: visible;
        }
    }

    &:last-child {
        ${Steps} {
            border-right: none;
        }
    }
`;
const Input = styled_components_1.default.input `
    flex: 1;
    padding: 0 25px 0 6px;
    margin: 0;
    width: 50%;
    min-height: 32px;
    text-align: center;
    border: none;

    // @see https://stackoverflow.com/a/4298216/1138860
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        /* display: none; <- Crashes Chrome on hover */
        -webkit-appearance: none;
        margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
    }

    &:focus {
        outline: none;
    }

    &:focus {
        background: #eee;

        + ${Steps} {
            visibility: visible;
        }
    }
`;
function NumberInput(props) {
    const { date, step, mode, onCancel, onSubmit } = props;
    const ref = React.useRef(null);
    const [focused, setFocused] = React.useState(false);
    const [value, setValue] = React.useState(getDateValue(date));
    React.useEffect(() => {
        setValue(getDateValue(props.date));
    }, [date.getTime()]);
    React.useEffect(() => {
        if (value && focused) {
            const newDate = setDateValue(value);
            props.onChange(newDate, mode);
        }
    }, [value]);
    function setDateValue(value) {
        const newDate = new Date(date);
        const newValue = parseInt(value || '0', 10);
        switch (mode) {
            case 'hour':
                newDate.setHours(newValue);
                break;
            case 'minute':
                newDate.setMinutes(newValue);
                break;
        }
        return newDate;
    }
    function getDateValue(date) {
        switch (mode) {
            case 'hour':
                return date.getHours();
            case 'minute':
                return date.getMinutes();
        }
        return 0;
    }
    function getRenderedValue() {
        if (focused) {
            return value;
        }
        else {
            return isFinite(value) ? utils_1.formatNumberRaw(value) : '';
        }
    }
    function onFocusIn() {
        setFocused(true);
    }
    function onFocusOut() {
        if (document.querySelector(':focus') !== ref.current) {
            setFocused(false);
        }
    }
    function onChange(e) {
        const { value } = e.currentTarget;
        if (value.length > 2) {
            e.preventDefault();
            return;
        }
        if (value === '') {
            setValue(value);
        }
        else if (date) {
            const newDate = setDateValue(value);
            setValue(getDateValue(newDate));
        }
    }
    function onStepUp() {
        if (date) {
            const newDate = (() => {
                switch (mode) {
                    case 'hour':
                        return utils_1.addHours(date, 1);
                    case 'minute':
                        return utils_1.addMinutes(date, step);
                }
                return undefined;
            })();
            if (newDate) {
                props.onChange(newDate, mode);
            }
        }
    }
    function onStepDown() {
        if (date) {
            const newDate = (() => {
                switch (mode) {
                    case 'hour':
                        return utils_1.subtractHours(date, 1);
                    case 'minute':
                        return utils_1.subtractMinutes(date, step);
                }
                return undefined;
            })();
            if (newDate) {
                props.onChange(newDate, mode);
            }
        }
    }
    function onKeyUp(e) {
        switch (e.keyCode) {
            case utils_1.keys.ENTER:
                onSubmit(date, mode);
                break;
            case utils_1.keys.ESC:
                onCancel(undefined, mode);
                break;
        }
    }
    return (React.createElement(InputContainer, { className: `react-timebomb-number-input ${mode}`, onMouseEnter: onFocusIn, onMouseLeave: onFocusOut },
        React.createElement(Input, { "data-react-timebomb-selectable": true, type: "number", ref: ref, step: step, value: getRenderedValue(), onChange: onChange, onFocus: onFocusIn, onBlur: onFocusOut, onKeyUp: onKeyUp }),
        React.createElement(Steps, null,
            React.createElement(Step, { "data-react-timebomb-selectable": true, tabIndex: -1, onClick: onStepUp }, "\u25B2"),
            React.createElement(Step, { "data-react-timebomb-selectable": true, tabIndex: -1, onClick: onStepDown }, "\u25BC"))));
}
exports.NumberInput = NumberInput;
//# sourceMappingURL=number-input.js.map