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
class NumberInput extends React.PureComponent {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.state = {};
        this.onChange = this.onChange.bind(this);
        this.onFocusIn = this.onFocusIn.bind(this);
        this.onFocusOut = this.onFocusOut.bind(this);
        this.onStepUp = this.onStepUp.bind(this);
        this.onStepDown = this.onStepDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }
    get renderedValue() {
        if (this.state.focused) {
            return this.state.value;
        }
        else {
            return isFinite(this.state.value)
                ? utils_1.formatNumberRaw(this.state.value)
                : '';
        }
    }
    componentDidMount() {
        const { date } = this.props;
        if (date) {
            this.setStateValue();
        }
    }
    componentDidUpdate(prevProps, prevState) {
        const { date, mode, onChange } = this.props;
        const { value, focused } = this.state;
        if (date && prevProps.date.getTime() !== date.getTime()) {
            this.setStateValue();
        }
        if (prevState.value !== value && value !== '' && focused) {
            const newDate = this.setDateValue(value);
            onChange(newDate, mode);
        }
    }
    render() {
        const { step, mode } = this.props;
        return (React.createElement(InputContainer, { className: `react-timebomb-number-input ${mode}`, onMouseEnter: this.onFocusIn, onMouseLeave: this.onFocusOut },
            React.createElement(Input, { "data-react-timebomb-selectable": true, type: "number", ref: this.ref, step: step, value: this.renderedValue, onChange: this.onChange, onFocus: this.onFocusIn, onBlur: this.onFocusOut, onKeyUp: this.onKeyUp }),
            React.createElement(Steps, null,
                React.createElement(Step, { "data-react-timebomb-selectable": true, tabIndex: -1, onClick: this.onStepUp }, "\u25B2"),
                React.createElement(Step, { "data-react-timebomb-selectable": true, tabIndex: -1, onClick: this.onStepDown }, "\u25BC"))));
    }
    setStateValue(value = this.props.date) {
        this.setState({ value: this.getDateValue(value) });
    }
    setDateValue(value) {
        const newDate = new Date(this.props.date);
        const newValue = parseInt(value || '0', 10);
        switch (this.props.mode) {
            case 'hour':
                newDate.setHours(newValue);
                break;
            case 'minute':
                newDate.setMinutes(newValue);
                break;
        }
        return newDate;
    }
    getDateValue(date) {
        switch (this.props.mode) {
            case 'hour':
                return date.getHours();
            case 'minute':
                return date.getMinutes();
        }
        return 0;
    }
    onFocusIn() {
        this.setState({ focused: true });
    }
    onFocusOut() {
        if (document.querySelector(':focus') !== this.ref.current) {
            this.setState({ focused: false });
        }
    }
    onChange(e) {
        const { date } = this.props;
        const { value } = e.currentTarget;
        if (value.length > 2) {
            e.preventDefault();
            return;
        }
        if (value === '') {
            this.setState({ value });
        }
        else if (date) {
            const newDate = this.setDateValue(value);
            this.setStateValue(newDate);
        }
    }
    onStepUp() {
        const { date, step } = this.props;
        const { value } = this.state;
        if (date && value !== undefined) {
            const newDate = this.setDateValue(value + step);
            this.setStateValue(newDate);
        }
    }
    onStepDown() {
        const { date, step } = this.props;
        const { value } = this.state;
        if (date && value !== undefined) {
            const newDate = this.setDateValue(value - step);
            this.setStateValue(newDate);
        }
    }
    onKeyUp(e) {
        switch (e.keyCode) {
            case utils_1.keys.ENTER:
                this.props.onSubmit(this.props.date, this.props.mode);
                break;
            case utils_1.keys.ESC:
                this.props.onCancel(undefined, this.props.mode);
                break;
        }
    }
}
NumberInput.defaultProps = {
    step: 1
};
exports.NumberInput = NumberInput;
//# sourceMappingURL=number-input.js.map