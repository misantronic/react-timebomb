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
class MenuTitle extends React.PureComponent {
    get prevDisabled() {
        const { minDate, date } = this.props;
        if (minDate && date) {
            return utils_1.subtractDays(utils_1.startOfMonth(this.date), 1) < minDate;
        }
        return false;
    }
    get nextDisabled() {
        const { maxDate, date } = this.props;
        if (maxDate && date) {
            const lastDate = utils_1.isArray(date) ? date[date.length - 1] : date;
            return utils_1.addDays(utils_1.endOfMonth(lastDate), 1) > maxDate;
        }
        return false;
    }
    get date() {
        const { date, selectedRange } = this.props;
        return (utils_1.isArray(date) ? date[selectedRange] : date);
    }
    constructor(props) {
        super(props);
        this.monthNames = utils_1.getMonthNames();
    }
    render() {
        const { mode, showDate, onNextMonth, onPrevMonth, onMonth, onReset, onYear } = this.props;
        const show = (mode === 'day' ||
            mode === 'hour' ||
            mode === 'minute' ||
            mode === 'second') &&
            Boolean(showDate);
        const date = this.date;
        return (React.createElement(Container, { className: "react-timebomb-menu-title", show: show },
            React.createElement("div", null,
                React.createElement(button_1.Button, { className: "react-timebomb-button-month", tabIndex: -1, mobile: this.props.mobile, onClick: onMonth },
                    React.createElement("b", null, this.monthNames[date.getMonth()])),
                React.createElement(button_1.Button, { className: "react-timebomb-button-year", tabIndex: -1, mobile: this.props.mobile, onClick: onYear }, date.getFullYear())),
            React.createElement("div", null,
                React.createElement(button_1.Button, { className: "react-timebomb-button-month-prev", tabIndex: -1, disabled: this.prevDisabled, mobile: this.props.mobile, onClick: onPrevMonth }, "\u25C0"),
                React.createElement(button_1.Button, { className: "react-timebomb-button-month-reset", tabIndex: -1, mobile: this.props.mobile, onClick: onReset }, "\u25CB"),
                React.createElement(button_1.Button, { className: "react-timebomb-button-month-next", tabIndex: -1, disabled: this.nextDisabled, mobile: this.props.mobile, onClick: onNextMonth }, "\u25B6"))));
    }
}
exports.MenuTitle = MenuTitle;
//# sourceMappingURL=title.js.map