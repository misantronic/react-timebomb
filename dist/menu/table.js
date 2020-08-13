"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuTable = void 0;
const React = require("react");
const utils_1 = require("../utils");
const styled_components_1 = require("styled-components");
const day_1 = require("./day");
const Table = styled_components_1.default.table `
    width: 100%;
    height: 186px;
    table-layout: fixed;
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
            text-align: center;
        }

        td {
            width: 14.285714286%;
        }
    }
`;
function getSelected(config) {
    const { day, value, hoverDays, showTime, selectRange } = config;
    if (value) {
        if (selectRange === 'week') {
            const dayWeekOfYear = utils_1.getWeekOfYear(day);
            if (utils_1.isArray(value)) {
                return value.some(v => utils_1.getWeekOfYear(v) === dayWeekOfYear);
            }
            return utils_1.getWeekOfYear(value) === dayWeekOfYear;
        }
        if (selectRange && utils_1.isArray(value)) {
            const [minDate, maxDate] = value;
            if (value.length === 1 && hoverDays.length) {
                const firstHover = hoverDays[0];
                const lastHover = hoverDays[hoverDays.length - 1];
                return utils_1.isEnabled('day', day, {
                    minDate: minDate < firstHover ? minDate : firstHover,
                    maxDate: minDate > lastHover ? minDate : lastHover
                });
            }
            if (value.length === 2) {
                return utils_1.isEnabled('day', day, {
                    minDate,
                    maxDate
                });
            }
        }
    }
    return utils_1.dateEqual(value, day, showTime);
}
function MenuTable(props) {
    const { value, showCalendarWeek, selectRange, selectedRange, showConfirm, hoverDate, showTime, onSubmit } = props;
    const [hoverDays, setHoverDays] = React.useState(getDefaultHoverDays());
    const [selectedDates, setSelectedDates] = React.useState([]);
    const { current: weekdayNames } = React.useRef(utils_1.getWeekdayNames());
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
    React.useEffect(() => {
        if (props.onHoverDays) {
            props.onHoverDays(hoverDays);
        }
    }, [hoverDays]);
    React.useEffect(() => {
        setSelectedDates(monthMatrix.reduce((memo, dates) => {
            memo.push(...dates.filter(day => getSelected({
                day,
                value,
                selectRange,
                hoverDays,
                showTime
            })));
            return memo;
        }, []));
    }, [monthMatrix, hoverDays, value]);
    function getDefaultHoverDays() {
        if (!hoverDate) {
            return [];
        }
        if (utils_1.isArray(value)) {
            return [value[0], hoverDate];
        }
        return [];
    }
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
        if (!showConfirm && !selectRange) {
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
        setHoverDays([]);
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
            const selected = dates.some(day => selectedDates.some(d => utils_1.isSameDay(d, day)));
            const selectedStart = dates.some(day => utils_1.dateEqual(selectedDates[0], day));
            const selectedEnd = dates.some(day => utils_1.dateEqual(selectedDates[selectedDates.length - 1], day));
            const className = [
                'day',
                selected && 'selected',
                selectedStart && 'selected-start',
                selectedEnd && 'selected-end'
            ]
                .filter(c => c)
                .join(' ');
            return (React.createElement("tr", { key: weekNum, className: className },
                showCalendarWeek && (React.createElement("td", { className: "calendar-week" },
                    React.createElement(day_1.WeekNum, { day: dates[0], onClick: onSelectDay }, weekNum))),
                dates.map(day => {
                    const hover = hoverDays.some(hoverDay => utils_1.dateEqual(hoverDay, day));
                    const selected = selectedDates.some(d => utils_1.isSameDay(d, day));
                    const selectedStart = utils_1.dateEqual(selectedDates[0], day);
                    const selectedEnd = utils_1.dateEqual(selectedDates[selectedDates.length - 1], day);
                    const className = [
                        'day',
                        selected && 'selected',
                        selectedStart && 'selected-start',
                        selectedEnd && 'selected-end'
                    ]
                        .filter(c => c)
                        .join(' ');
                    return (React.createElement("td", { key: day.toISOString(), className: className },
                        React.createElement(day_1.Day, { day: day, hover: hover, selected: selected, selectedStart: selectedStart, selectedEnd: selectedEnd, date: props.date, minDate: props.minDate, maxDate: props.maxDate, showTime: props.showTime, onSelectDay: onSelectDay, onMouseEnter: onDayMouseEnter, onMouseLeave: onDayMouseLeave })));
                })));
        }))));
}
exports.MenuTable = MenuTable;
//# sourceMappingURL=table.js.map