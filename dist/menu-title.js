import * as React from 'react';
import styled from 'styled-components';
import { Button } from './button';
import { subtractDays, startOfMonth, endOfMonth, addDays, getMonthNames } from './utils';
import { isArray } from 'util';
const Container = styled.div `
    display: ${(props) => (props.show ? 'flex' : 'none')};
    align-items: center;
    width: 100%;
    padding: 10px 10px 15px;
    justify-content: space-between;
    min-height: 21px;
    box-sizing: border-box;
`;
export class MenuTitle extends React.PureComponent {
    get prevDisabled() {
        const { minDate, date } = this.props;
        if (minDate && date) {
            return subtractDays(startOfMonth(this.date), 1) < minDate;
        }
        return false;
    }
    get nextDisabled() {
        const { maxDate, date } = this.props;
        if (maxDate && date) {
            const lastDate = isArray(date) ? date[date.length - 1] : date;
            return addDays(endOfMonth(lastDate), 1) > maxDate;
        }
        return false;
    }
    get date() {
        const { date, selectedRange } = this.props;
        return (isArray(date) ? date[selectedRange] : date);
    }
    constructor(props) {
        super(props);
        this.monthNames = getMonthNames();
    }
    render() {
        const { mode, onNextMonth, onPrevMonth, onMonth, onReset, onYear } = this.props;
        const show = mode === 'day';
        const date = this.date;
        return (React.createElement(Container, { show: show },
            React.createElement("div", null,
                React.createElement(Button, { className: "react-timebomb-button-month", tabIndex: -1, onClick: onMonth },
                    React.createElement("b", null, this.monthNames[date.getMonth()])),
                React.createElement(Button, { className: "react-timebomb-button-year", tabIndex: -1, onClick: onYear }, date.getFullYear())),
            React.createElement("div", null,
                React.createElement(Button, { className: "react-timebomb-button-month-prev", tabIndex: -1, disabled: this.prevDisabled, onClick: onPrevMonth }, "\u25C0"),
                React.createElement(Button, { className: "react-timebomb-button-month-reset", tabIndex: -1, onClick: onReset }, "\u25CB"),
                React.createElement(Button, { className: "react-timebomb-button-month-next", tabIndex: -1, disabled: this.nextDisabled, onClick: onNextMonth }, "\u25B6"))));
    }
}
//# sourceMappingURL=menu-title.js.map