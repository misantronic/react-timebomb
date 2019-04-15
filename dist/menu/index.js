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
const MobileMenuTable = styled_components_1.default(table_1.MenuTable) `
    width: 33.3%;
`;
function getDate(date, selectedRange) {
    return (utils_1.isArray(date) ? date[selectedRange] : date);
}
function MenuMonths(props) {
    const { value, mobile, selectedRange } = props;
    const [monthNames] = React.useState(utils_1.getMonthNames(true));
    const valueDate = getDate(value, selectedRange);
    const date = getDate(props.date, selectedRange);
    const month = value && valueDate.getMonth();
    const year = value && valueDate.getFullYear();
    function onSelectMonth(e) {
        const date = new Date(utils_1.getAttribute(e.currentTarget, 'data-date'));
        setTimeout(() => props.onSelectMonth(date), 0);
    }
    return (React.createElement(MonthsContainer, { mobile: mobile, className: "months" }, monthNames.map((str, i) => {
        const newDate = new Date(date);
        newDate.setMonth(i);
        const enabled = utils_1.isEnabled('month', newDate, props);
        const selected = month === newDate.getMonth() &&
            year === newDate.getFullYear();
        return (React.createElement(button_1.Button, { key: str, tabIndex: -1, className: selected ? 'selected' : undefined, selected: selected, disabled: !enabled, mobile: props.mobile, "data-date": newDate.toISOString(), onClick: onSelectMonth }, str));
    })));
}
function MenuYear(props) {
    const { value, minDate, maxDate } = props;
    const [yearContainer, setYearContainer] = React.useState(null);
    React.useEffect(scrollToYear, [props.date]);
    function scrollToYear() {
        if (yearContainer) {
            const selected = yearContainer.querySelector('.selected');
            if (selected) {
                selected.scrollIntoView();
                if (yearContainer.scrollBy) {
                    yearContainer.scrollBy({ top: -10 });
                }
            }
        }
    }
    function getFullYears() {
        const valueDate = getDate(value, props.selectedRange);
        const year = getDate(props.date, props.selectedRange).getFullYear();
        const getDateConfig = (date, newYear) => {
            date = new Date(date);
            date.setFullYear(newYear);
            const enabled = utils_1.isEnabled('year', date, props);
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
            const now = new Date();
            const currentDate = valueDate > now ? valueDate : now;
            const currentYear = currentDate.getFullYear();
            return Array(120)
                .fill(undefined)
                .map((_, i) => {
                const date = new Date(currentDate);
                date.setFullYear(currentYear - i);
                const enabled = utils_1.isEnabled('year', date, props);
                const selected = year === date.getFullYear();
                return { date, enabled, selected };
            })
                .filter(obj => obj.enabled)
                .reverse();
        }
    }
    function onSelectYear(e) {
        const date = new Date(utils_1.getAttribute(e.currentTarget, 'data-date'));
        setTimeout(() => props.onSelectYear(date), 0);
    }
    function onYearContainer(el) {
        setYearContainer(el);
        scrollToYear();
    }
    return (React.createElement(YearContainer, { ref: onYearContainer, className: "years" }, getFullYears()
        .map(({ date, selected }) => {
        const fullYear = date.getFullYear();
        const dateStr = date.toISOString();
        return (React.createElement(button_1.Button, { key: dateStr, tabIndex: -1, className: selected ? 'selected' : undefined, selected: selected, mobile: props.mobile, "data-date": dateStr, onClick: onSelectYear }, fullYear));
    })
        .reverse()));
}
function MenuConfirm(props) {
    const { valueText, format } = props;
    const validDate = utils_1.validateDate(valueText, format);
    const isValid = validDate
        ? utils_1.isArray(validDate)
            ? validDate.every(v => utils_1.isEnabled('day', v, props))
            : utils_1.isEnabled('day', validDate, props)
        : false;
    return (React.createElement(Confirm, null,
        React.createElement(button_1.Button, { tabIndex: -1, disabled: !isValid, mobile: props.mobile, onClick: () => props.onSubmit() }, "Ok")));
}
function MonthWrapper(props) {
    const { minDate, maxDate, mobile } = props;
    function allowPrev() {
        let date = props.date;
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
    function allowNext() {
        let date = props.date;
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
    function onChangeMonth(direction) {
        const { onChangeMonth } = props;
        const date = getDate(props.date, props.selectedRange);
        switch (direction) {
            case 'next':
                onChangeMonth(utils_1.addMonths(date, 1));
                break;
            case 'prev':
                onChangeMonth(utils_1.subtractMonths(date, 1));
                break;
        }
    }
    if (mobile) {
        return (React.createElement(mobile_1.GestureWrapper, { allowNext: allowNext(), allowPrev: allowPrev(), onChangeMonth: onChangeMonth },
            React.createElement(MobileMenuTable, { date: utils_1.subtractMonths(getDate(props.date, props.selectedRange), 1), minDate: props.minDate, maxDate: props.maxDate, mobile: props.mobile, selectRange: props.selectRange, selectedRange: props.selectedRange, selectWeek: props.selectWeek, showCalendarWeek: props.showCalendarWeek, showConfirm: props.showConfirm, showTime: props.showTime, value: utils_1.subtractMonths(getDate(props.value, props.selectedRange), 1), onSubmit: props.onSubmit, onSelectDay: props.onSelectDay }),
            React.createElement(MobileMenuTable, { date: props.date, minDate: props.minDate, maxDate: props.maxDate, mobile: props.mobile, selectRange: props.selectRange, selectedRange: props.selectedRange, selectWeek: props.selectWeek, showCalendarWeek: props.showCalendarWeek, showConfirm: props.showConfirm, showTime: props.showTime, value: props.value, onSubmit: props.onSubmit, onSelectDay: props.onSelectDay }),
            React.createElement(MobileMenuTable, { date: utils_1.addMonths(getDate(props.date, props.selectedRange), 1), minDate: props.minDate, maxDate: props.maxDate, mobile: props.mobile, selectRange: props.selectRange, selectedRange: props.selectedRange, selectWeek: props.selectWeek, showCalendarWeek: props.showCalendarWeek, showConfirm: props.showConfirm, showTime: props.showTime, value: utils_1.addMonths(getDate(props.value, props.selectedRange), 1), onSubmit: props.onSubmit, onSelectDay: props.onSelectDay })));
    }
    return (React.createElement(table_1.MenuTable, { date: props.date, minDate: props.minDate, maxDate: props.maxDate, mobile: props.mobile, selectRange: props.selectRange, selectedRange: props.selectedRange, selectWeek: props.selectWeek, showCalendarWeek: props.showCalendarWeek, showConfirm: props.showConfirm, showTime: props.showTime, value: props.value, onSubmit: props.onSubmit, onSelectDay: props.onSelectDay }));
}
function Menu(props) {
    const { mode, mobile, showDate, showConfirm, showTime } = props;
    if (showDate || showTime) {
        switch (mode) {
            case 'year':
            case 'month':
                return (React.createElement(MonthAndYearContainer, { mobile: mobile },
                    React.createElement(MenuMonths, Object.assign({}, props)),
                    React.createElement(MenuYear, Object.assign({}, props))));
            case 'day':
            case 'hour':
            case 'minute':
            case 'second':
                return (React.createElement(MonthContainer, { mobile: mobile },
                    showDate && React.createElement(MonthWrapper, Object.assign({}, props)),
                    showTime && (React.createElement(time_1.MenuTime, { date: props.date, timeStep: props.timeStep, topDivider: props.showDate, onChange: props.onSelectTime, onSubmit: props.onSubmitTime, onCancel: props.onSubmitTime })),
                    showConfirm && React.createElement(MenuConfirm, Object.assign({}, props))));
        }
    }
    return null;
}
exports.Menu = Menu;
//# sourceMappingURL=index.js.map