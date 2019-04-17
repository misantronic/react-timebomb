"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const utils_1 = require("../utils");
const styled_components_1 = require("styled-components");
function getBackgroundColor(props) {
    if (props.selected) {
        return '#ddd';
    }
    if (props.hover) {
        return '#eee';
    }
    if (props.today) {
        return 'rgba(172, 206, 247, 0.4)';
    }
    return 'transparent';
}
const Flex = styled_components_1.default.div `
    display: flex;
    align-items: center;
`;
const StyledDay = styled_components_1.default(Flex) `
    padding: 8px 2px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: ${(props) => (props.current ? 'inherit' : '#aaa')};
    background-color: ${getBackgroundColor};
    font-weight: ${(props) => props.selected ? 'bold' : 'normal'};
    pointer-events: ${(props) => props.disabled ? 'none' : 'auto'};
    user-select: none;
    opacity: ${(props) => (props.disabled ? 0.3 : 1)};
`;
function Day(props) {
    const { day, date, value, selectRange, hover, hoverDays, minDate, maxDate, showTime } = props;
    const [enabled, setEnabled] = React.useState(true);
    const [today, setToday] = React.useState(false);
    const current = React.useMemo(getCurrent, [date, day, showTime]);
    const selected = React.useMemo(getSelected, [
        day,
        value,
        selectRange,
        hoverDays
    ]);
    React.useEffect(() => {
        setToday(utils_1.isToday(day));
    }, [day.getTime()]);
    React.useEffect(() => {
        setEnabled(utils_1.isEnabled('day', day, props));
    }, [
        minDate ? minDate.getTime() : minDate,
        maxDate ? maxDate.getTime() : maxDate
    ]);
    function getSelected() {
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
    function getCurrent() {
        const dayMonth = day.getMonth();
        if (utils_1.isArray(date)) {
            return date.some(d => d.getMonth() === dayMonth);
        }
        if (date) {
            return dayMonth === date.getMonth();
        }
        return false;
    }
    function onSelectDay() {
        props.onSelectDay(day);
    }
    function onMouseEnter() {
        props.onMouseEnter(day);
    }
    function onMouseLeave() {
        props.onMouseLeave(day);
    }
    return (React.createElement(StyledDay, { className: selected ? 'value selected' : 'value', selected: selected, current: current, hoverDays: hoverDays, hover: hover, disabled: !enabled, today: today, onClick: onSelectDay, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave }, day.getDate()));
}
exports.Day = Day;
function WeekNum(props) {
    function onClick() {
        props.onClick(props.day);
    }
    return React.createElement("div", { onClick: onClick }, props.children);
}
exports.WeekNum = WeekNum;
//# sourceMappingURL=day.js.map