import * as React from 'react';
import styled from 'styled-components';
const InputContainer = styled.div `
    position: relative;
    flex: 1;
    display: flex;
    border: 1px solid #ccc;
`;
const Input = styled.input `
    flex: 1;
    padding: 4px 16px 4px 6px;
    margin: 0;
    width: 50%;
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
`;
const Steps = styled.div `
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 1px;
    top: 1px;
    width: 15px;
    height: calc(100% - 2px);
    border-left: 1px solid #ccc;
`;
const Step = styled.button `
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
export class NumberInput extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.onChange = this.onChange.bind(this);
        this.onStepUp = this.onStepUp.bind(this);
        this.onStepDown = this.onStepDown.bind(this);
    }
    static getDerivedStateFromProps(prevProps) {
        switch (prevProps.mode) {
            case 'hour':
                return { value: prevProps.date.getHours() };
            case 'minute':
                return { value: prevProps.date.getMinutes() };
        }
        return undefined;
    }
    render() {
        const { step, mode } = this.props;
        return (React.createElement(InputContainer, { className: `react-timebomb-number-input ${mode}` },
            React.createElement(Input, { "data-react-timebomb-selectable": true, type: "number", step: step, value: this.state.value, onChange: this.onChange }),
            React.createElement(Steps, null,
                React.createElement(Step, { "data-react-timebomb-selectable": true, tabIndex: -1, onClick: this.onStepUp }, "\u25B2"),
                React.createElement(Step, { "data-react-timebomb-selectable": true, tabIndex: -1, onClick: this.onStepDown }, "\u25BC"))));
    }
    manipulateDate(value) {
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
    onChange(e) {
        const { date } = this.props;
        const { value } = e.currentTarget;
        if (date) {
            const newDate = this.manipulateDate(value);
            this.props.onChange(newDate);
        }
    }
    onStepUp() {
        const { date, step } = this.props;
        const { value } = this.state;
        if (date && value !== undefined) {
            const newDate = this.manipulateDate(value + step);
            this.props.onChange(newDate);
        }
    }
    onStepDown() {
        const { date, step } = this.props;
        const { value } = this.state;
        if (date && value !== undefined) {
            const newDate = this.manipulateDate(value - step);
            this.props.onChange(newDate);
        }
    }
}
NumberInput.defaultProps = {
    step: 1
};
//# sourceMappingURL=number-input.js.map