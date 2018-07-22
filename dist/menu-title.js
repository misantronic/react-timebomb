import * as React from 'react';
import styled from 'styled-components';
import { Button } from './button';
import { subtractDays, startOfMonth, endOfMonth, addDays, getMonthNames } from './utils';
const Container = styled.div `
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 15px;
    justify-content: space-between;
    min-height: 21px;
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
        const { date, onNextMonth, onPrevMonth, onToday, onMonths, onYear } = this.props;
        const months = getMonthNames(true);
        return (React.createElement(Container, null,
            React.createElement("div", null,
                React.createElement(Button, { tabIndex: -1, onClick: onMonths },
                    React.createElement("b", null, months[date.getMonth()])),
                React.createElement(Button, { tabIndex: -1, onClick: onYear }, date.getFullYear())),
            React.createElement("div", { style: { display: 'flex' } },
                React.createElement(Button, { tabIndex: -1, disabled: this.prevDisabled, onClick: onPrevMonth }, "\u25C0"),
                React.createElement(Button, { tabIndex: -1, onClick: onToday }, "\u25CB"),
                React.createElement(Button, { tabIndex: -1, disabled: this.nextDisabled, onClick: onNextMonth }, "\u25B6"))));
    }
}
//# sourceMappingURL=menu-title.js.map