import * as React from 'react';
import styled from 'styled-components';
import { Button } from './button';
import { subtractDays, startOfMonth, endOfMonth, addDays, getMonthNames } from './utils';
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
        if (minDate) {
            return subtractDays(startOfMonth(date), 1) < minDate;
        }
        return false;
    }
    get nextDisabled() {
        const { maxDate, date } = this.props;
        if (maxDate) {
            return addDays(endOfMonth(date), 1) > maxDate;
        }
        return false;
    }
    render() {
        const { date, mode, onNextMonth, onPrevMonth, onMonths, onReset, onYear } = this.props;
        const months = getMonthNames();
        const show = mode === 'month';
        return (React.createElement(Container, { show: show },
            React.createElement("div", null,
                React.createElement(Button, { tabIndex: -1, onClick: onMonths },
                    React.createElement("b", null, months[date.getMonth()])),
                React.createElement(Button, { tabIndex: -1, onClick: onYear }, date.getFullYear())),
            React.createElement("div", null,
                React.createElement(Button, { tabIndex: -1, disabled: this.prevDisabled, onClick: onPrevMonth }, "\u25C0"),
                React.createElement(Button, { tabIndex: -1, onClick: onReset }, "\u25CB"),
                React.createElement(Button, { tabIndex: -1, disabled: this.nextDisabled, onClick: onNextMonth }, "\u25B6"))));
    }
}
//# sourceMappingURL=menu-title.js.map