import * as React from 'react';
import styled, { css } from 'styled-components';
import { isEnabled, validateDate, isToday, getMonthNames, getWeekOfYear, startOfWeek, addDays, startOfMonth, endOfWeek, dateEqual } from './utils';
import { Button } from './button';
const Flex = styled.div `
    display: flex;
    align-items: center;
`;
const MonthsContainer = styled.div `
    display: flex;
    flex: 1;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    padding: 10px;

    button {
        width: 33%;
        font-size: 16px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 3.13;
        border: none;
        margin: 0;
        padding: 0;
    }
`;
const MonthContainer = styled.div `
    padding: 0 0 10px;
`;
const YearContainer = styled.div `
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    border-left: solid 1px #e6e6e6;
    padding: 10px;
    flex: 0 0 90px;

    button {
        width: 100%;
        font-size: 16px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        border: none;
        padding: 6px 0;
        margin: 0 0 4px;
        min-height: 46px;
    }
`;
const Confirm = styled.div `
    width: 100%;
    text-align: center;
    padding: 10px 0 0;

    button {
        padding: 3px 28px;
    }
`;
const Table = styled.table `
    width: 100%;
    font-size: 13px;
    user-select: none;
    padding: 0 10px;
    box-sizing: border-box;

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
    padding: 8px 2px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: ${(props) => (props.current ? 'inherit' : '#aaa')};
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
    get fullYears() {
        const { minDate, maxDate } = this.props;
        const year = this.props.date.getFullYear();
        if (minDate && !maxDate) {
            const currentYear = minDate.getFullYear();
            return Array(120)
                .fill(undefined)
                .map((_, i) => {
                const date = new Date(minDate);
                date.setFullYear(currentYear + i);
                const enabled = isEnabled('year', date, this.props);
                const selected = year === date.getFullYear();
                return { date, enabled, selected };
            })
                .filter(obj => obj.enabled);
        }
        else if (!minDate && maxDate) {
            const currentYear = maxDate.getFullYear();
            return Array(120)
                .fill(undefined)
                .map((_, i) => {
                const date = new Date(maxDate);
                date.setFullYear(currentYear - i);
                const enabled = isEnabled('year', date, this.props);
                const selected = year === date.getFullYear();
                return { date, enabled, selected };
            })
                .filter(obj => obj.enabled)
                .reverse();
        }
        else if (minDate && maxDate) {
            const minYear = minDate.getFullYear();
            const maxYear = maxDate.getFullYear();
            const array = [];
            for (let i = maxYear; i >= minYear; i--) {
                const date = new Date(maxDate);
                date.setFullYear(i);
                const enabled = isEnabled('year', date, this.props);
                const selected = year === date.getFullYear();
                array.push({ date, enabled, selected });
            }
            return array.reverse();
        }
        else {
            const currentDate = this.now;
            const currentYear = currentDate.getFullYear();
            return Array(120)
                .fill(undefined)
                .map((_, i) => {
                const date = new Date(currentDate);
                date.setFullYear(currentYear - i);
                const enabled = isEnabled('year', date, this.props);
                const selected = year === date.getFullYear();
                return { date, enabled, selected };
            })
                .filter(obj => obj.enabled)
                .reverse();
        }
    }
    constructor(props) {
        super(props);
        this.onSelectDay = this.onSelectDay.bind(this);
        this.onSelectMonth = this.onSelectMonth.bind(this);
        this.onSelectYear = this.onSelectYear.bind(this);
    }
    render() {
        const { mode, showConfirm } = this.props;
        switch (mode) {
            case 'year':
            case 'months':
                return (React.createElement("div", { style: { display: 'flex' } },
                    this.renderMenuMonths(),
                    this.renderMenuYear()));
            case 'month':
                return (React.createElement(MonthContainer, null,
                    this.renderMonth(),
                    showConfirm && this.renderConfirm()));
        }
    }
    renderMenuYear() {
        return (React.createElement(YearContainer, { ref: this.onYearContainer, className: "years" }, this.fullYears
            .map(({ date, selected }) => {
            const fullYear = date.getFullYear();
            const dateStr = date.toISOString();
            return (React.createElement(Button, { key: dateStr, tabIndex: -1, className: selected ? 'selected' : undefined, selected: selected, "data-date": dateStr, onClick: this.onSelectYear }, fullYear));
        })
            .reverse()));
    }
    renderMenuMonths() {
        const { date, value } = this.props;
        const months = getMonthNames(true);
        const month = value && value.getMonth();
        const year = value && value.getFullYear();
        return (React.createElement(MonthsContainer, { className: "months" }, months.map((str, i) => {
            const newDate = new Date(date);
            newDate.setMonth(i);
            const enabled = isEnabled('month', newDate, this.props);
            const selected = month === newDate.getMonth() &&
                year === newDate.getFullYear();
            return (React.createElement(Button, { key: str, tabIndex: -1, className: selected ? 'selected' : undefined, selected: selected, disabled: !enabled, "data-date": newDate.toISOString(), onClick: this.onSelectMonth }, str));
        })));
    }
    renderMonth() {
        const { monthMatrix } = this;
        const { showCalendarWeek, selectWeek } = this.props;
        return (React.createElement(Table, { className: "month", selectWeek: selectWeek, cellSpacing: 0, cellPadding: 0 },
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
        let selected = dateEqual(value, day);
        const current = day.getMonth() === date.getMonth();
        const enabled = isEnabled('day', day, this.props);
        const today = isToday(day);
        if (selectWeek && value) {
            selected = getWeekOfYear(value) === getWeekOfYear(day);
        }
        return (React.createElement(Day, { "data-date": day.toISOString(), className: selected ? 'value selected' : 'value', selected: selected, current: current, disabled: !enabled, today: today, onClick: this.onSelectDay }, num));
    }
    renderConfirm() {
        const { valueText, format } = this.props;
        const validDate = validateDate(valueText, format);
        return (React.createElement(Confirm, null,
            React.createElement(Button, { tabIndex: -1, disabled: validDate === null, onClick: () => this.props.onSubmit() }, "Ok")));
    }
    onSelectDay(e) {
        const { onSelectDay, showConfirm, onSubmit } = this.props;
        const date = new Date(e.currentTarget.getAttribute('data-date'));
        onSelectDay(date);
        if (!showConfirm) {
            onSubmit();
        }
    }
    onSelectMonth(e) {
        const date = new Date(e.currentTarget.getAttribute('data-date'));
        setTimeout(() => this.props.onSelectMonth(date), 0);
    }
    onSelectYear(e) {
        const date = new Date(e.currentTarget.getAttribute('data-date'));
        setTimeout(() => this.props.onSelectYear(date), 0);
    }
    onYearContainer(el) {
        if (el) {
            const selected = el.querySelector('.selected');
            if (selected) {
                selected.scrollIntoView();
                el.scrollBy({ top: -10 });
            }
        }
    }
}
//# sourceMappingURL=menu.js.map