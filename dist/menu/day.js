"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeekNum = exports.Day = void 0;
const React = require("react");
const styled_components_1 = require("styled-components");
const utils_1 = require("../utils");
const StyledDay = styled_components_1.default.button `
    display: flex;
    align-items: center;
    padding: 8px 2px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: ${(props) => (props.current ? 'inherit' : '#aaa')};
    background-color: transparent;
    pointer-events: ${(props) => props.disabled ? 'none' : 'auto'};
    width: 100%;
    border: none;
    opacity: ${(props) => (props.disabled ? 0.3 : 1)};

    &.today {
        background-color: rgba(172, 206, 247, 0.4);
    }

    &.hover {
        background-color: #eee;
    }

    &.selected {
        font-weight: bold;
        background-color: rgba(221, 221, 221, 0.3);
    }

    &.selected-start,
    &.selected-end {
        background-color: rgba(221, 221, 221, 1);
    }
`;
function Day(props) {
    const { day, date, hover, minDate, maxDate, showTime } = props;
    const [enabled, setEnabled] = React.useState(true);
    const [today, setToday] = React.useState(false);
    const current = React.useMemo(getCurrent, [date, day, showTime]);
    React.useEffect(() => {
        setToday(utils_1.isToday(day));
    }, [day.getTime()]);
    React.useEffect(() => {
        setEnabled(utils_1.isEnabled('day', day, {
            minDate: props.minDate,
            maxDate: props.maxDate
        }));
    }, [
        minDate ? minDate.getTime() : minDate,
        maxDate ? maxDate.getTime() : maxDate
    ]);
    function getCurrent() {
        const dayMonth = day.getMonth();
        if (utils_1.isArray(date)) {
            return date.some((d) => d.getMonth() === dayMonth);
        }
        if (date) {
            return dayMonth === date.getMonth();
        }
        return false;
    }
    function onMouseDown(e) {
        e.stopPropagation();
        e.preventDefault();
    }
    function onSelectDay(e) {
        e.stopPropagation();
        e.preventDefault();
        props.onSelectDay(day);
    }
    function onMouseEnter() {
        props.onMouseEnter(day);
    }
    function onMouseLeave() {
        props.onMouseLeave(day);
    }
    function getClassNames() {
        const classes = ['value'];
        if (props.selected) {
            classes.push('selected');
        }
        if (props.selectedStart) {
            classes.push('selected-start');
        }
        if (props.selectedEnd) {
            classes.push('selected-end');
        }
        if (today) {
            classes.push('today');
        }
        if (hover) {
            classes.push('hover');
        }
        return classes.join(' ');
    }
    return (React.createElement(StyledDay, { type: "button", className: getClassNames(), current: current, disabled: !enabled, onClick: onSelectDay, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, onMouseDown: onMouseDown }, day.getDate()));
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