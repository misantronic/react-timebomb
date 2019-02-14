"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const utils_1 = require("../utils");
const styled_components_1 = require("styled-components");
const day_1 = require("./day");
const Table = styled_components_1.default.table `
    width: 100%;
    height: 100%;
    font-size: inherit;
    user-select: none;
    padding: 5px 10px;
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
    ? styled_components_1.css `
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
class MenuTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.monthMatrixCache = new Map();
        this.state = {};
        this.weekdayNames = utils_1.getWeekdayNames();
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
        let base = utils_1.startOfMonth(date);
        let week = 0;
        while (utils_1.startOfWeek(base).getMonth() === dateMonth ||
            utils_1.endOfWeek(base).getMonth() === dateMonth) {
            const weekStart = utils_1.startOfWeek(new Date(dateYear, dateMonth, week++ * 7 + 1));
            weeks.push([
                weekStart,
                utils_1.addDays(weekStart, 1),
                utils_1.addDays(weekStart, 2),
                utils_1.addDays(weekStart, 3),
                utils_1.addDays(weekStart, 4),
                utils_1.addDays(weekStart, 5),
                utils_1.addDays(weekStart, 6)
            ]);
            base = utils_1.addDays(base, 7);
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
                const weekNum = utils_1.getWeekOfYear(dates[0]);
                return (React.createElement("tr", { key: weekNum },
                    showCalendarWeek && (React.createElement("td", { className: "calendar-week" },
                        React.createElement(day_1.WeekNum, { day: dates[0], onClick: this.onSelectDay }, weekNum))),
                    dates.map(date => (React.createElement("td", { className: "day", key: date.toISOString() },
                        React.createElement(day_1.Day, { day: date, hoverDay: hoverDay, date: this.props.date, value: this.props.value, minDate: this.props.minDate, maxDate: this.props.maxDate, selectWeek: this.props.selectWeek, selectRange: this.props.selectRange, showTime: this.props.showTime, onSelectDay: this.onSelectDay, onMouseEnter: this.onDayMouseEnter, onMouseLeave: this.onDayMouseLeave }))))));
            }))));
    }
    getDate(date) {
        return (utils_1.isArray(date) ? date[this.props.selectedRange] : date);
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
exports.MenuTable = MenuTable;
//# sourceMappingURL=table.js.map