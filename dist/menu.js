import * as tslib_1 from "tslib";
import { bind } from 'lodash-decorators';
import * as React from 'react';
import styled, { css } from 'styled-components';
import { isDisabled, validateDate, isToday, getMonthNames, getWeekOfYear, startOfWeek, addDays, startOfMonth, endOfWeek } from './utils';
import { Button } from './button';
const Flex = styled.div `
    display: flex;
    align-items: center;
`;
const MenuContainer = styled(Flex) `
    flex-direction: column;

    button {
        width: 100%;
    }
`;
const Confirm = styled.div `
    width: 100%;
    text-align: center;
    margin-top: 15px;

    button {
        padding: 3px 28px;
    }
`;
const Table = styled.table `
    margin-bottom: 5px;
    width: 100%;
    font-size: 13px;
    user-select: none;

    td.calendar-week {
        color: #aaa;
    }

    th.calendar-week {
        text-align: left;
        color: #aaa;
    }

    tr {
        ${(props) => props.selectWeek
    ? css `
                      &:hover {
                          cursor: pointer;

                          td.day {
                              background-color: #eee;
                          }
                      }
                  `
    : ''};

        th {
            padding: 3px 2px;
        }
    }
`;
const Day = styled(Flex) `
    padding: 3px 2px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: ${(props) => (props.current ? '#000' : '#aaa')};
    background-color: ${(props) => props.selected
    ? '#ddd'
    : props.today
        ? 'rgba(172, 206, 247, 0.4)'
        : 'transparent'};
    font-weight: ${(props) => (props.selected ? 'bold' : 'normal')};
    pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
    user-select: none;
    opacity: ${(props) => (props.disabled ? 0.3 : 1)};

    &:hover {
        background-color: ${(props) => props.selected ? '#ddd' : '#eee'};
    }
`;
export class Menu extends React.PureComponent {
    get now() {
        return new Date();
    }
    get monthMatrix() {
        const { date } = this.props;
        const dateMonth = date.getMonth();
        const dateYear = date.getFullYear();
        const weeks = [];
        let base = startOfMonth(date);
        let week = 0;
        while (startOfWeek(base).getMonth() === dateMonth ||
            endOfWeek(base).getMonth() === dateMonth) {
            const weekStart = startOfWeek(new Date(dateYear, dateMonth, week++ * 7 + 1));
            weeks.push([
                weekStart,
                addDays(weekStart, 1),
                addDays(weekStart, 2),
                addDays(weekStart, 3),
                addDays(weekStart, 4),
                addDays(weekStart, 5),
                addDays(weekStart, 6)
            ]);
            base = addDays(base, 7);
        }
        return weeks;
    }
    render() {
        const { mode, showConfirm } = this.props;
        switch (mode) {
            case 'year':
                return this.renderMenuYear();
            case 'months':
                return this.renderMenuMonths();
            case 'month':
                return (React.createElement(React.Fragment, null,
                    this.renderMonth(),
                    showConfirm && this.renderConfirm()));
        }
    }
    renderMenuYear() {
        const { date: currentDate } = this.props;
        const currentYear = this.now.getFullYear();
        return (React.createElement(MenuContainer, null, Array(100)
            .fill(undefined)
            .map((_, i) => {
            const newDate = new Date(currentDate);
            newDate.setFullYear(currentYear - i);
            const disabled = isDisabled(newDate, this.props);
            return (React.createElement(Button, { key: i, tabIndex: -1, style: { margin: 5 }, disabled: disabled, onClick: () => {
                    setTimeout(() => this.props.onSelectYear(newDate), 0);
                } }, currentYear - i));
        })));
    }
    renderMenuMonths() {
        const { date } = this.props;
        const months = getMonthNames();
        return (React.createElement(MenuContainer, null, months.map((str, i) => {
            const newDate = new Date(date);
            newDate.setMonth(i);
            const disabled = isDisabled(newDate, this.props);
            return (React.createElement(Button, { key: str, tabIndex: -1, style: { margin: 5 }, disabled: disabled, onClick: () => setTimeout(() => this.props.onSelectMonth(newDate), 0) }, str));
        })));
    }
    renderMonth() {
        const { monthMatrix } = this;
        const { showCalendarWeek, selectWeek } = this.props;
        return (React.createElement(Table, { selectWeek: selectWeek, cellSpacing: 0, cellPadding: 0 },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    showCalendarWeek && React.createElement("th", { className: "calendar-week" }),
                    React.createElement("th", null, "Mo"),
                    React.createElement("th", null, "Di"),
                    React.createElement("th", null, "Mi"),
                    React.createElement("th", null, "Do"),
                    React.createElement("th", null, "Fr"),
                    React.createElement("th", null, "Sa"),
                    React.createElement("th", null, "So"))),
            React.createElement("tbody", null, monthMatrix.map((dates, i) => (React.createElement("tr", { key: i },
                showCalendarWeek && (React.createElement("td", { className: "calendar-week" }, getWeekOfYear(dates[0]))),
                dates.map((date, j) => (React.createElement("td", { className: "day", key: j }, this.renderDay(date))))))))));
    }
    renderDay(day) {
        const num = day.getDate();
        const { value, date, selectWeek } = this.props;
        let selected = value &&
            day.getDate() === value.getDate() &&
            day.getMonth() === value.getMonth();
        const current = day.getMonth() === date.getMonth();
        const disabled = isDisabled(day, this.props);
        const today = isToday(day);
        if (selectWeek && value) {
            selected = getWeekOfYear(value) === getWeekOfYear(day);
        }
        return (React.createElement(Day, { "data-date": day.toString(), selected: selected, current: current, disabled: disabled, today: today, onClick: this.onSelectDay }, num));
    }
    renderConfirm() {
        const { valueText, format } = this.props;
        const validDate = validateDate(valueText, format);
        return (React.createElement(Confirm, null,
            React.createElement(Button, { tabIndex: -1, disabled: validDate === null, onClick: () => this.props.onSubmit(this.props.onToggle) }, "Ok")));
    }
    onSelectDay(e) {
        const date = new Date(e.currentTarget.getAttribute('data-date'));
        this.props.onSelectDay(date);
    }
}
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Menu.prototype, "onSelectDay", null);
//# sourceMappingURL=menu.js.map