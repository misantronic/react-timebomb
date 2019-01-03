import * as React from 'react';
import styled, { css } from 'styled-components';
import { isEnabled, validateDate, getMonthNames, getWeekOfYear, startOfWeek, addDays, startOfMonth, endOfWeek, getAttribute } from './utils';
import { Button } from './button';
import { Day, WeekDay } from './menu-day';
const MonthAndYearContainer = styled.div `
    display: flex;
    height: 220px;
`;
const MonthsContainer = styled.div `
    display: flex;
    flex: 1;
    flex-direction: row;
    flex-wrap: wrap;
    align-self: flex-start;
    align-items: flex-start;
    padding: 10px;

    button {
        width: 33%;
        font-size: 16px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        min-height: 46px;
        border: none;
        margin: 0 0 4px;
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
export class Menu extends React.PureComponent {
    constructor(props) {
        super(props);
        this.monthMatrixCache = new Map();
        this.onSelectDay = this.onSelectDay.bind(this);
        this.onSelectMonth = this.onSelectMonth.bind(this);
        this.onSelectYear = this.onSelectYear.bind(this);
    }
    get now() {
        return new Date();
    }
    getDate(date) {
        return (Array.isArray(date) ? date[0] : date);
    }
    get monthMatrix() {
        const date = this.getDate(this.props.date);
        const dateMonth = date.getMonth();
        const dateYear = date.getFullYear();
        // cache
        const cacheKey = `${dateMonth}-${dateYear}`;
        const cached = this.monthMatrixCache.get(cacheKey);
        if (cached) {
            return cached;
        }
        // generate
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
        this.monthMatrixCache.set(cacheKey, weeks);
        return weeks;
    }
    get fullYears() {
        const { minDate, maxDate } = this.props;
        const year = this.getDate(this.props.date).getFullYear();
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
    render() {
        const { mode, showConfirm } = this.props;
        switch (mode) {
            case 'year':
            case 'months':
                return (React.createElement(MonthAndYearContainer, null,
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
        const { value } = this.props;
        const valueDate = this.getDate(value);
        const date = this.getDate(this.props.date);
        const months = getMonthNames(true);
        const month = value && valueDate.getMonth();
        const year = value && valueDate.getFullYear();
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
            React.createElement("tbody", null, this.monthMatrix.map(dates => {
                const weekNum = getWeekOfYear(dates[0]);
                return (React.createElement("tr", { key: weekNum },
                    showCalendarWeek && (React.createElement("td", { className: "calendar-week" },
                        React.createElement(WeekDay, { day: dates[0], onClick: this.onSelectDay }, weekNum))),
                    dates.map(date => (React.createElement("td", { className: "day", key: date.toISOString() },
                        React.createElement(Day, { day: date, date: this.props.date, value: this.props.value, minDate: this.props.minDate, maxDate: this.props.maxDate, selectWeek: this.props.selectWeek, onSelectDay: this.onSelectDay }))))));
            }))));
    }
    renderConfirm() {
        const { valueText, format } = this.props;
        const validDate = validateDate(valueText, format);
        const isValid = validDate
            ? Array.isArray(validDate)
                ? validDate.every(v => isEnabled('day', v, this.props))
                : isEnabled('day', validDate, this.props)
            : false;
        return (React.createElement(Confirm, null,
            React.createElement(Button, { tabIndex: -1, disabled: !isValid, onClick: () => this.props.onSubmit() }, "Ok")));
    }
    onSelectDay(date) {
        const { onSelectDay, showConfirm, onSubmit } = this.props;
        onSelectDay(date);
        if (!showConfirm) {
            onSubmit();
        }
    }
    onSelectMonth(e) {
        const date = new Date(getAttribute(e.currentTarget, 'data-date'));
        setTimeout(() => this.props.onSelectMonth(date), 0);
    }
    onSelectYear(e) {
        const date = new Date(getAttribute(e.currentTarget, 'data-date'));
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