import * as React from 'react';
import { startOfMonth, startOfWeek, endOfWeek, addDays, getWeekdayNames, getWeekOfYear, isArray } from '../utils';
import styled, { css } from 'styled-components';
import { WeekNum, Day } from './day';
const Table = styled.table `
    width: 100%;
    height: 100%;
    font-size: inherit;
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
            width: 14.285714286%;
        }

        td {
            width: 14.285714286%;
        }
    }
`;
export class MenuTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.monthMatrixCache = new Map();
        this.state = {};
        this.weekdayNames = getWeekdayNames();
        this.onSelectDay = this.onSelectDay.bind(this);
        this.onDayMouseEnter = this.onDayMouseEnter.bind(this);
        this.onDayMouseLeave = this.onDayMouseLeave.bind(this);
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
    render() {
        const { showCalendarWeek, selectWeek, mobile } = this.props;
        const { hoverDay } = this.state;
        const [sun, mon, tue, wed, thu, fri, sat] = this.weekdayNames;
        return (React.createElement(Table, { className: "month", selectWeek: selectWeek, mobile: mobile, cellSpacing: 0, cellPadding: 0 },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    showCalendarWeek && React.createElement("th", { className: "calendar-week" }),
                    React.createElement("th", null, mon),
                    React.createElement("th", null, tue),
                    React.createElement("th", null, wed),
                    React.createElement("th", null, thu),
                    React.createElement("th", null, fri),
                    React.createElement("th", null, sat),
                    React.createElement("th", null, sun))),
            React.createElement("tbody", null, this.monthMatrix.map(dates => {
                const weekNum = getWeekOfYear(dates[0]);
                return (React.createElement("tr", { key: weekNum },
                    showCalendarWeek && (React.createElement("td", { className: "calendar-week" },
                        React.createElement(WeekNum, { day: dates[0], onClick: this.onSelectDay }, weekNum))),
                    dates.map(date => (React.createElement("td", { className: "day", key: date.toISOString() },
                        React.createElement(Day, { day: date, hoverDay: hoverDay, date: this.props.date, value: this.props.value, minDate: this.props.minDate, maxDate: this.props.maxDate, selectWeek: this.props.selectWeek, selectRange: this.props.selectRange, showTime: this.props.showTime, onSelectDay: this.onSelectDay, onMouseEnter: this.onDayMouseEnter, onMouseLeave: this.onDayMouseLeave }))))));
            }))));
    }
    getDate(date) {
        return (isArray(date) ? date[this.props.selectedRange] : date);
    }
    onSelectDay(date) {
        const { onSelectDay, showConfirm, onSubmit } = this.props;
        onSelectDay(date);
        if (!showConfirm) {
            onSubmit();
        }
    }
    onDayMouseEnter(day) {
        if (this.props.selectRange) {
            this.setState({ hoverDay: day });
        }
    }
    onDayMouseLeave() {
        if (this.props.selectRange) {
            this.setState({ hoverDay: undefined });
        }
    }
}
//# sourceMappingURL=table.js.map