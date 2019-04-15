"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const styled_components_1 = require("styled-components");
const button_1 = require("../components/button");
const utils_1 = require("../utils");
const Container = styled_components_1.default.div `
    display: ${(props) => (props.show ? 'flex' : 'none')};
    align-items: center;
    width: 100%;
    padding: 10px;
    justify-content: space-between;
    box-sizing: border-box;
    white-space: nowrap;
`;
function MenuTitle(props) {
    const { mode, minDate, maxDate, mobile, showDate, selectedRange, onNextMonth, onPrevMonth, onMonth, onReset, onYear } = props;
    const [monthNames] = React.useState(utils_1.getMonthNames());
    const show = (mode === 'day' ||
        mode === 'hour' ||
        mode === 'minute' ||
        mode === 'second') &&
        Boolean(showDate);
    const date = getDate();
    function prevDisabled() {
        if (minDate && props.date) {
            return utils_1.subtractDays(utils_1.startOfMonth(date), 1) < minDate;
        }
        return false;
    }
    function nextDisabled() {
        if (maxDate && props.date) {
            const lastDate = utils_1.isArray(props.date)
                ? props.date[props.date.length - 1]
                : props.date;
            return utils_1.addDays(utils_1.endOfMonth(lastDate), 1) > maxDate;
        }
        return false;
    }
    function getDate() {
        return (utils_1.isArray(props.date) ? props.date[selectedRange] : props.date);
    }
    return (React.createElement(Container, { className: "react-timebomb-menu-title", show: show },
        React.createElement("div", null,
            React.createElement(button_1.Button, { className: "react-timebomb-button-month", tabIndex: -1, mobile: mobile, onClick: onMonth },
                React.createElement("b", null, monthNames[date.getMonth()])),
            React.createElement(button_1.Button, { className: "react-timebomb-button-year", tabIndex: -1, mobile: mobile, onClick: onYear }, date.getFullYear())),
        React.createElement("div", null,
            React.createElement(button_1.Button, { className: "react-timebomb-button-month-prev", tabIndex: -1, disabled: prevDisabled(), mobile: mobile, onClick: onPrevMonth }, "\u25C0"),
            React.createElement(button_1.Button, { className: "react-timebomb-button-month-reset", tabIndex: -1, mobile: mobile, onClick: onReset }, "\u25CB"),
            React.createElement(button_1.Button, { className: "react-timebomb-button-month-next", tabIndex: -1, disabled: nextDisabled(), mobile: mobile, onClick: onNextMonth }, "\u25B6"))));
}
exports.MenuTitle = MenuTitle;
//# sourceMappingURL=title.js.map