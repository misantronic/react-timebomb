import * as React from 'react';
import styled from 'styled-components';
import { isArray } from '../utils';
import { NumberInput } from '../number-input';
const Container = styled.div `
    padding: 10px;
    display: flex;
    align-items: center;
    margin: 0 auto;
    width: 150px;
`;
const Divider = styled.span `
    margin: 0 5px;
    font-weight: bold;
`;
export class MenuTime extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onChangeMins = this.onChangeMins.bind(this);
        this.onChangeHours = this.onChangeHours.bind(this);
    }
    render() {
        const { date, timeStep, onChange } = this.props;
        if (isArray(date) || !date) {
            return null;
        }
        return (React.createElement(Container, { className: "react-timebomb-time" },
            React.createElement(NumberInput, { date: date, step: 1, mode: "hour", onChange: onChange }),
            React.createElement(Divider, { className: "divider" }, ":"),
            React.createElement(NumberInput, { date: date, step: timeStep, mode: "minute", onChange: onChange })));
    }
    onChangeMins(e) {
        const { date } = this.props;
        const { value } = e.currentTarget;
        console.log({ value });
        if (date && !isArray(date)) {
            const newDate = new Date(date);
            newDate.setMinutes(parseInt(value || '0', 10));
            this.props.onChange(newDate);
        }
    }
    onChangeHours(e) {
        const { date } = this.props;
        const { value } = e.currentTarget;
        if (date && !isArray(date)) {
            const newDate = new Date(date);
            newDate.setHours(parseInt(value || '0', 10));
            this.props.onChange(newDate);
        }
    }
}
//# sourceMappingURL=time.js.map