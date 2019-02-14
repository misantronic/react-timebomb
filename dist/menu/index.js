"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const styled_components_1 = require("styled-components");
const utils_1 = require("../utils");
const button_1 = require("../components/button");
const table_1 = require("./table");
const mobile_1 = require("./mobile");
const time_1 = require("./time");
const MonthAndYearContainer = styled_components_1.default.div `
    display: flex;
    height: ${(props) => props.mobile ? '100%' : '220px'};
`;
const MonthsContainer = styled_components_1.default.div `
    display: flex;
    flex: 1;
    flex-direction: row;
    flex-wrap: wrap;
    align-self: flex-start;
    align-items: flex-start;
    padding: 10px;
    box-sizing: border-box;
    height: 100%;

    button {
        width: ${(props) => props.mobile ? 'calc(33% - 6px)' : '33%'};
        font-size: 16px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        min-height: 25%;
        border: none;
        margin: 0;
    }
`;
const MonthContainer = styled_components_1.default.div `
    flex: 1;
    padding: 0;
    height: ${(props) => (props.mobile ? '100' : 'auto')};
    overflow: hidden;
`;
const YearContainer = styled_components_1.default.div `
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
const Confirm = styled_components_1.default.div `
    width: 100%;
    text-align: center;
    padding: 10px 0;

    button {
        padding: 3px 28px;
    }
`;
class Menu extends React.PureComponent {
    constructor(props) {
        super(props);
        this.yearContainer = null;
        this.scrollToYear = (() => {
            let timeout;
            return (delay) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    if (this.yearContainer) {
                        const selected = this.yearContainer.querySelector('.selected');
                        if (selected) {
                            selected.scrollIntoView();
                            if (this.yearContainer.scrollBy) {
                                this.yearContainer.scrollBy({ top: -10 });
                            }
                        }
                    }
                }, delay);
            };
        })();
        this.state = {};
        this.onSelectMonth = this.onSelectMonth.bind(this);
        this.onSelectYear = this.onSelectYear.bind(this);
        this.onYearContainer = this.onYearContainer.bind(this);
        this.onChangeMonth = this.onChangeMonth.bind(this);
        this.monthNames = utils_1.getMonthNames(true);
    }
    get now() {
        return new Date();
    }
    getDate(date) {
        return (utils_1.isArray(date) ? date[this.props.selectedRange] : date);
    }
    get fullYears() {
        const { value, minDate, maxDate } = this.props;
        const valueDate = this.getDate(value);
        const year = this.getDate(this.props.date).getFullYear();
        const getDateConfig = (date, newYear) => {
            date = new Date(date);
            date.setFullYear(newYear);
            const enabled = utils_1.isEnabled('year', date, this.props);
            const selected = year === newYear;
            if (value) {
                date.setSeconds(valueDate.getSeconds());
                date.setMinutes(valueDate.getMinutes());
                date.setHours(valueDate.getHours());
                date.setDate(valueDate.getDate());
                date.setMonth(valueDate.getMonth());
            }
            return { date, enabled, selected };
        };
        if (minDate && !maxDate) {
            const currentYear = minDate.getFullYear();
            return Array(120)
                .fill(undefined)
                .map((_, i) => getDateConfig(minDate, currentYear + i))
                .filter(obj => obj.enabled);
        }
        else if (!minDate && maxDate) {
            const currentYear = maxDate.getFullYear();
            return Array(120)
                .fill(undefined)
                .map((_, i) => getDateConfig(maxDate, currentYear - i))
                .filter(obj => obj.enabled)
                .reverse();
        }
        else if (minDate && maxDate) {
            const minYear = minDate.getFullYear();
            const maxYear = maxDate.getFullYear();
            const array = [];
            for (let i = maxYear; i >= minYear; i--) {
                array.push(getDateConfig(maxDate, i));
            }
            return array.reverse();
        }
        else {
            const now = this.now;
            const currentDate = valueDate > now ? valueDate : now;
            const currentYear = currentDate.getFullYear();
            return Array(120)
                .fill(undefined)
                .map((_, i) => {
                const date = new Date(currentDate);
                date.setFullYear(currentYear - i);
                const enabled = utils_1.isEnabled('year', date, this.props);
                const selected = year === date.getFullYear();
                return { date, enabled, selected };
            })
                .filter(obj => obj.enabled)
                .reverse();
        }
    }
    get allowPrev() {
        const { minDate } = this.props;
        let date = this.props.date;
        if (!minDate) {
            return true;
        }
        if (utils_1.isArray(date)) {
            date = date[0];
        }
        if (date) {
            if (utils_1.subtractDays(utils_1.startOfMonth(date), 1) < minDate) {
                return false;
            }
        }
        return true;
    }
    get allowNext() {
        const { maxDate } = this.props;
        let date = this.props.date;
        if (!maxDate) {
            return true;
        }
        if (utils_1.isArray(date)) {
            date = date[0];
        }
        if (date) {
            if (utils_1.addDays(utils_1.endOfMonth(date), 1) > maxDate) {
                return false;
            }
        }
        return true;
    }
    componentDidUpdate(prevProps) {
        if (!utils_1.dateEqual(prevProps.date, this.props.date)) {
            this.scrollToYear(64);
        }
    }
    render() {
        const { mode, mobile, showDate, showConfirm, showTime } = this.props;
        if (showDate || showTime) {
            switch (mode) {
                case 'year':
                case 'month':
                    return (React.createElement(MonthAndYearContainer, { mobile: mobile },
                        this.renderMenuMonths(),
                        this.renderMenuYear()));
                case 'day':
                case 'hour':
                case 'minute':
                case 'second':
                    return (React.createElement(MonthContainer, { mobile: mobile },
                        showDate && this.renderMonth(),
                        showTime && this.renderTime(),
                        showConfirm && this.renderConfirm()));
            }
        }
        return null;
    }
    renderMenuYear() {
        return (React.createElement(YearContainer, { ref: this.onYearContainer, className: "years" }, this.fullYears
            .map(({ date, selected }) => {
            const fullYear = date.getFullYear();
            const dateStr = date.toISOString();
            return (React.createElement(button_1.Button, { key: dateStr, tabIndex: -1, className: selected ? 'selected' : undefined, selected: selected, mobile: this.props.mobile, "data-date": dateStr, onClick: this.onSelectYear }, fullYear));
        })
            .reverse()));
    }
    renderMenuMonths() {
        const { value, mobile } = this.props;
        const valueDate = this.getDate(value);
        const date = this.getDate(this.props.date);
        const month = value && valueDate.getMonth();
        const year = value && valueDate.getFullYear();
        return (React.createElement(MonthsContainer, { mobile: mobile, className: "months" }, this.monthNames.map((str, i) => {
            const newDate = new Date(date);
            newDate.setMonth(i);
            const enabled = utils_1.isEnabled('month', newDate, this.props);
            const selected = month === newDate.getMonth() &&
                year === newDate.getFullYear();
            return (React.createElement(button_1.Button, { key: str, tabIndex: -1, className: selected ? 'selected' : undefined, selected: selected, disabled: !enabled, mobile: this.props.mobile, "data-date": newDate.toISOString(), onClick: this.onSelectMonth }, str));
        })));
    }
    renderMonth() {
        const { mobile } = this.props;
        if (mobile) {
            return (React.createElement(mobile_1.GestureWrapper, { allowNext: this.allowNext, allowPrev: this.allowPrev, onChangeMonth: this.onChangeMonth },
                React.createElement(table_1.MenuTable, { date: utils_1.subtractMonths(this.getDate(this.props.date), 1), minDate: this.props.minDate, maxDate: this.props.maxDate, mobile: this.props.mobile, selectRange: this.props.selectRange, selectedRange: this.props.selectedRange, selectWeek: this.props.selectWeek, showCalendarWeek: this.props.showCalendarWeek, showConfirm: this.props.showConfirm, showTime: this.props.showTime, value: utils_1.subtractMonths(this.getDate(this.props.value), 1), onSubmit: this.props.onSubmit, onSelectDay: this.props.onSelectDay }),
                React.createElement(table_1.MenuTable, { date: this.props.date, minDate: this.props.minDate, maxDate: this.props.maxDate, mobile: this.props.mobile, selectRange: this.props.selectRange, selectedRange: this.props.selectedRange, selectWeek: this.props.selectWeek, showCalendarWeek: this.props.showCalendarWeek, showConfirm: this.props.showConfirm, showTime: this.props.showTime, value: this.props.value, onSubmit: this.props.onSubmit, onSelectDay: this.props.onSelectDay }),
                React.createElement(table_1.MenuTable, { date: utils_1.addMonths(this.getDate(this.props.date), 1), minDate: this.props.minDate, maxDate: this.props.maxDate, mobile: this.props.mobile, selectRange: this.props.selectRange, selectedRange: this.props.selectedRange, selectWeek: this.props.selectWeek, showCalendarWeek: this.props.showCalendarWeek, showConfirm: this.props.showConfirm, showTime: this.props.showTime, value: utils_1.addMonths(this.getDate(this.props.value), 1), onSubmit: this.props.onSubmit, onSelectDay: this.props.onSelectDay })));
        }
        return (React.createElement(table_1.MenuTable, { date: this.props.date, minDate: this.props.minDate, maxDate: this.props.maxDate, mobile: this.props.mobile, selectRange: this.props.selectRange, selectedRange: this.props.selectedRange, selectWeek: this.props.selectWeek, showCalendarWeek: this.props.showCalendarWeek, showConfirm: this.props.showConfirm, showTime: this.props.showTime, value: this.props.value, onSubmit: this.props.onSubmit, onSelectDay: this.props.onSelectDay }));
    }
    renderTime() {
        return (React.createElement(time_1.MenuTime, { date: this.props.date, timeStep: this.props.timeStep, topDivider: this.props.showDate, onChange: this.props.onSelectTime, onSubmit: this.props.onSubmitTime, onCancel: this.props.onSubmitTime }));
    }
    renderConfirm() {
        const { valueText, format } = this.props;
        const validDate = utils_1.validateDate(valueText, format);
        const isValid = validDate
            ? utils_1.isArray(validDate)
                ? validDate.every(v => utils_1.isEnabled('day', v, this.props))
                : utils_1.isEnabled('day', validDate, this.props)
            : false;
        return (React.createElement(Confirm, null,
            React.createElement(button_1.Button, { tabIndex: -1, disabled: !isValid, mobile: this.props.mobile, onClick: () => this.props.onSubmit() }, "Ok")));
    }
    onSelectMonth(e) {
        const date = new Date(utils_1.getAttribute(e.currentTarget, 'data-date'));
        setTimeout(() => this.props.onSelectMonth(date), 0);
    }
    onSelectYear(e) {
        const date = new Date(utils_1.getAttribute(e.currentTarget, 'data-date'));
        setTimeout(() => this.props.onSelectYear(date), 0);
    }
    onYearContainer(el) {
        this.yearContainer = el;
        this.scrollToYear(0);
    }
    onChangeMonth(direction) {
        const { onChangeMonth } = this.props;
        const date = this.getDate(this.props.date);
        switch (direction) {
            case 'next':
                onChangeMonth(utils_1.addMonths(date, 1));
                break;
            case 'prev':
                onChangeMonth(utils_1.subtractMonths(date, 1));
                break;
        }
    }
}
exports.Menu = Menu;
//# sourceMappingURL=index.js.map