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
        th {
            padding: 3px 2px;
            width: 14.285714286%;
        }

        td {
            width: 14.285714286%;
        }
    }
`;
function MenuTable(props) {
    const { showCalendarWeek, selectRange, selectedRange, showConfirm, onSubmit } = props;
    const [hoverDays, setHoverDays] = React.useState([]);
    const [weekdayNames] = React.useState(utils_1.getWeekdayNames());
    const [sun, mon, tue, wed, thu, fri, sat] = weekdayNames;
    const className = ['month', props.className]
        .filter(c => Boolean(c))
        .join(' ');
    const monthMatrix = React.useMemo(() => {
        const date = getDate(props.date);
        const dateMonth = date.getMonth();
        const dateYear = date.getFullYear();
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
        return weeks;
    }, [getCacheKey()]);
    function getCacheKey() {
        const date = getDate(props.date);
        const dateMonth = date.getMonth();
        const dateYear = date.getFullYear();
        // cache
        return `${dateMonth}-${dateYear}`;
    }
    function getDate(date) {
        return (utils_1.isArray(date) ? date[selectedRange] : date);
    }
    function onSelectDay(date) {
        props.onSelectDay(date);
        if (!showConfirm) {
            onSubmit();
        }
    }
    function onDayMouseEnter(day) {
        if (typeof selectRange === 'number') {
            const days = Array(selectRange)
                .fill(null)
                .map((_, i) => utils_1.addDays(day, i));
            setHoverDays(days);
        }
        else if (selectRange === 'week') {
            const firstDay = utils_1.startOfWeek(day);
            const days = Array(7)
                .fill(null)
                .map((_, i) => utils_1.addDays(firstDay, i));
            setHoverDays(days);
        }
        else {
            setHoverDays([day]);
        }
    }
    function onDayMouseLeave() {
        if (selectRange) {
            setHoverDays([]);
        }
    }
    return (React.createElement(Table, { className: className, cellSpacing: 0, cellPadding: 0 },
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
        React.createElement("tbody", null, monthMatrix.map(dates => {
            const weekNum = utils_1.getWeekOfYear(dates[0]);
            return (React.createElement("tr", { key: weekNum },
                showCalendarWeek && (React.createElement("td", { className: "calendar-week" },
                    React.createElement(day_1.WeekNum, { day: dates[0], onClick: onSelectDay }, weekNum))),
                dates.map(date => {
                    return (React.createElement("td", { className: "day", key: date.toISOString() },
                        React.createElement(day_1.Day, { day: date, hoverDays: hoverDays, hover: hoverDays.some(day => utils_1.dateEqual(day, date)), date: props.date, value: props.value, minDate: props.minDate, maxDate: props.maxDate, selectRange: props.selectRange, showTime: props.showTime, onSelectDay: onSelectDay, onMouseEnter: onDayMouseEnter, onMouseLeave: onDayMouseLeave })));
                })));
        }))));
}
exports.MenuTable = MenuTable;
//# sourceMappingURL=table.js.map