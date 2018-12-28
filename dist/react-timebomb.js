(function(FuseBox){FuseBox.$fuse$=FuseBox;
FuseBox.target = "browser";
FuseBox.pkg("default", {}, function(___scope___){
___scope___.file("index.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const styled_components_1 = require("styled-components");
const react_slct_1 = require("react-slct");
const menu_1 = require("./menu");
const menu_title_1 = require("./menu-title");
const value_1 = require("./value");
const utils_1 = require("./utils");
const typings_1 = require("./typings");
exports.ReactTimebombProps = typings_1.ReactTimebombProps;
exports.ReactTimebombState = typings_1.ReactTimebombState;
exports.ReactTimebombError = typings_1.ReactTimebombError;
const DEFAULT_FORMAT = 'YYYY-MM-DD';
const Container = styled_components_1.default.div `
    width: 100%;
    position: relative;
    position: relative;
`;
const MenuWrapper = styled_components_1.default.div `
    display: flex;
    width: 100%;
    flex-direction: column;
    border: 1px solid #ccc;
    box-sizing: border-box;
    padding: 0;
    background: white;
    z-index: 1;
    max-height: ${(props) => props.menuHeight}px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;
`;
const BlindInput = styled_components_1.default.input `
    position: absolute;
    opacity: 0;
`;
class ReactTimebomb extends React.Component {
    /** @internal */
    static getDerivedStateFromProps(props) {
        return {
            showTime: Boolean(props.format && /H|h|m|k|a|S|s/.test(props.format))
        };
    }
    get className() {
        const classNames = ['react-timebomb'];
        if (this.props.className) {
            classNames.push(this.props.className);
        }
        return classNames.join(' ');
    }
    constructor(props) {
        super(props);
        const { value, format = DEFAULT_FORMAT } = this.props;
        this.state = {
            allowValidation: false,
            mode: 'month',
            valueText: value ? utils_1.dateFormat(value, format) : undefined,
            date: value || utils_1.startOfDay(new Date())
        };
        this.onChangeValueText = this.onChangeValueText.bind(this);
        this.onValueSubmit = this.onValueSubmit.bind(this);
        this.onSelectDay = this.onSelectDay.bind(this);
        this.onModeYear = this.onModeYear.bind(this);
        this.onModeMonths = this.onModeMonths.bind(this);
        this.onSelectMonth = this.onSelectMonth.bind(this);
        this.onSelectYear = this.onSelectYear.bind(this);
        this.onToday = this.onToday.bind(this);
        this.onNextMonth = this.onNextMonth.bind(this);
        this.onPrevMonth = this.onPrevMonth.bind(this);
        this.onSelectTime = this.onSelectTime.bind(this);
    }
    componentDidUpdate(prevProps, prevState) {
        const { valueText } = this.state;
        const { value, format = DEFAULT_FORMAT } = this.props;
        if (prevProps.format !== format) {
            this.setState({
                valueText: value ? utils_1.dateFormat(value, format) : undefined
            });
        }
        if (prevState.valueText !== valueText) {
            this.valueTextDidUpdate();
        }
    }
    valueTextDidUpdate() {
        const { valueText, allowValidation } = this.state;
        const { format = DEFAULT_FORMAT } = this.props;
        const validDate = utils_1.validateDate(valueText, format);
        if (validDate) {
            this.setState({ allowValidation: true }, () => {
                const disabled = utils_1.isDisabled(validDate, this.props);
                if (disabled) {
                    this.emitError('outOfRange', valueText);
                }
                else {
                    this.setState({ date: validDate }, () => this.emitChange(validDate));
                }
            });
        }
        else if (valueText) {
            this.emitError('invalidDate', valueText);
        }
        else if (!utils_1.isUndefined(valueText) && allowValidation) {
            this.emitChange(undefined);
        }
    }
    render() {
        const { value, placeholder, menuWidth, showConfirm, showCalendarWeek, selectWeek, format = DEFAULT_FORMAT } = this.props;
        const { showTime, valueText, allowValidation, mode } = this.state;
        const menuHeight = 320;
        const minDate = this.props.minDate
            ? utils_1.startOfDay(this.props.minDate)
            : undefined;
        const maxDate = this.props.maxDate
            ? utils_1.endOfDay(this.props.maxDate)
            : undefined;
        return (React.createElement(react_slct_1.Select, { value: value, placeholder: placeholder }, ({ placeholder, open, onToggle, onRef, MenuContainer }) => (React.createElement(Container, { ref: onRef, className: this.className },
            open ? (React.createElement(MenuContainer, { menuWidth: menuWidth, menuHeight: menuHeight },
                React.createElement(MenuWrapper, { menuHeight: menuHeight },
                    React.createElement(menu_title_1.MenuTitle, { mode: mode, date: this.state.date, minDate: minDate, maxDate: maxDate, onMonths: this.onModeMonths, onYear: this.onModeYear, onNextMonth: this.onNextMonth, onPrevMonth: this.onPrevMonth, onToday: this.onToday }),
                    React.createElement(menu_1.Menu, { showTime: showTime, showConfirm: showConfirm, showCalendarWeek: showCalendarWeek, selectWeek: selectWeek, date: this.state.date, value: value, valueText: valueText, format: format, mode: mode, minDate: minDate, maxDate: maxDate, onSelectDay: this.onSelectDay, onSelectMonth: this.onSelectMonth, onSelectYear: this.onSelectYear, onSelectTime: this.onSelectTime, onToggle: onToggle, onSubmit: this.onValueSubmit })))) : (React.createElement(React.Fragment, null,
                this.onClose(),
                React.createElement(BlindInput, { type: "text", onFocus: onToggle }))),
            React.createElement(value_1.Value, { placeholder: open ? undefined : placeholder, format: format, value: value, valueText: valueText, minDate: minDate, maxDate: maxDate, allowValidation: allowValidation, open: open, onChangeValueText: this.onChangeValueText, onToggle: onToggle, onSubmit: this.onValueSubmit })))));
    }
    onClose() {
        utils_1.clearSelection();
        setTimeout(() => {
            const { format = DEFAULT_FORMAT } = this.props;
            const validDate = utils_1.validateDate(this.state.valueText, format);
            const isValid = validDate
                ? !utils_1.isDisabled(validDate, this.props)
                : validDate;
            if (!isValid && this.props.value) {
                const formattedDate = utils_1.dateFormat(this.props.value, format);
                if (this.state.valueText !== formattedDate) {
                    this.setState({ valueText: formattedDate });
                }
            }
        }, 0);
        return null;
    }
    emitError(error, value) {
        if (this.props.onError && this.state.allowValidation) {
            this.props.onError(error, value);
        }
    }
    emitChange(date) {
        const { value } = this.props;
        if (value && date && value.getTime() === date.getTime()) {
            return;
        }
        this.props.onChange(date);
        this.setState({ allowValidation: Boolean(date) });
    }
    onChangeValueText(valueText) {
        this.setState({ valueText });
    }
    onValueSubmit(onToggle) {
        onToggle();
        utils_1.clearSelection();
    }
    onSelectDay(day) {
        const { value, format = DEFAULT_FORMAT } = this.props;
        let date = new Date(day);
        if (value) {
            date = utils_1.setDate(day, value.getHours(), value.getMinutes());
        }
        const valueText = utils_1.dateFormat(date, format);
        this.setState({ date, valueText }, () => this.emitChange(date));
    }
    onModeYear() {
        this.setState({ mode: 'year' });
    }
    onModeMonths() {
        this.setState({ mode: 'months' });
    }
    onSelectMonth(date) {
        this.setState({ date, mode: 'month' });
    }
    onSelectYear(date) {
        this.setState({ date, mode: 'months' });
    }
    onToday() {
        const now = utils_1.startOfDay(new Date());
        this.setState({ date: now });
    }
    onNextMonth() {
        const date = new Date(this.state.date);
        date.setMonth(date.getMonth() + 1);
        this.setState({ date });
    }
    onPrevMonth() {
        const date = new Date(this.state.date);
        date.setMonth(date.getMonth() - 1);
        this.setState({ date });
    }
    onSelectTime(time) {
        const { format = DEFAULT_FORMAT } = this.props;
        const value = this.props.value || new Date('1970-01-01');
        if (!time) {
            this.emitChange(utils_1.startOfDay(value));
        }
        else {
            const splitted = time.split(':');
            const newDate = utils_1.setDate(value, parseInt(splitted[0], 10), parseInt(splitted[1], 10));
            const valueText = utils_1.dateFormat(newDate, format);
            this.setState({ valueText }, () => this.emitChange(newDate));
        }
    }
}
exports.ReactTimebomb = ReactTimebomb;
//# sourceMappingURL=index.js.map
});
___scope___.file("menu.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const styled_components_1 = require("styled-components");
const utils_1 = require("./utils");
const button_1 = require("./button");
const Flex = styled_components_1.default.div `
    display: flex;
    align-items: center;
`;
const MonthsContainer = styled_components_1.default.div `
    display: flex;
    flex: 1;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    padding: 10px;

    button {
        width: 33%;
        font-size: 16px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 3.13;
        border: none;
        margin: 0;
        padding: 0;
    }
`;
const MonthContainer = styled_components_1.default.div `
    padding: 0 0 10px;
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
    padding: 10px 0 0;

    button {
        padding: 3px 28px;
    }
`;
const Table = styled_components_1.default.table `
    width: 100%;
    font-size: 13px;
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
        }
    }
`;
const Day = styled_components_1.default(Flex) `
    padding: 8px 2px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: ${(props) => (props.current ? '#000' : '#aaa')};
    background-color: ${(props) => props.selected
    ? '#ddd'
    : props.today
        ? 'rgba(172, 206, 247, 0.4)'
        : 'transparent'};
    font-weight: ${(props) => (props.selected ? 'bold' : 'normal')};
    pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
    user-select: none;
    opacity: ${(props) => (props.disabled ? 0.3 : 1)};

    &:hover {
        background-color: ${(props) => props.selected ? '#ddd' : '#eee'};
    }
`;
class Menu extends React.PureComponent {
    get now() {
        return new Date();
    }
    get monthMatrix() {
        const { date } = this.props;
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
    }
    constructor(props) {
        super(props);
        this.onSelectDay = this.onSelectDay.bind(this);
        this.onSelectMonth = this.onSelectMonth.bind(this);
        this.onSelectYear = this.onSelectYear.bind(this);
    }
    render() {
        const { mode, showConfirm } = this.props;
        switch (mode) {
            case 'year':
            case 'months':
                return (React.createElement("div", { style: { display: 'flex' } },
                    this.renderMenuMonths(),
                    this.renderMenuYear()));
            case 'month':
                return (React.createElement(MonthContainer, null,
                    this.renderMonth(),
                    showConfirm && this.renderConfirm()));
        }
    }
    renderMenuYear() {
        const { date: currentDate } = this.props;
        const currentYear = this.now.getFullYear();
        const year = currentDate.getFullYear();
        return (React.createElement(YearContainer, { className: "years" }, Array(100)
            .fill(undefined)
            .map((_, i) => {
            const newDate = new Date(currentDate);
            newDate.setFullYear(currentYear - i);
            const disabled = utils_1.isDisabled(utils_1.endOfYear(newDate), this.props);
            const selected = year === newDate.getFullYear();
            return (React.createElement(button_1.Button, { key: i, tabIndex: -1, className: selected ? 'selected' : undefined, selected: selected, disabled: disabled, "data-date": newDate.toString(), onClick: this.onSelectYear }, currentYear - i));
        })));
    }
    renderMenuMonths() {
        const { date, value } = this.props;
        const months = utils_1.getMonthNames(true);
        const month = value && value.getMonth();
        const year = value && value.getFullYear();
        return (React.createElement(MonthsContainer, { className: "months" }, months.map((str, i) => {
            const newDate = new Date(date);
            newDate.setMonth(i);
            // TODO: funktioniet nicht ganz rund
            const disabled = utils_1.isDisabled(newDate, this.props);
            const selected = month === newDate.getMonth() &&
                year === newDate.getFullYear();
            return (React.createElement(button_1.Button, { key: str, tabIndex: -1, className: selected ? 'selected' : undefined, selected: selected, disabled: disabled, "data-date": newDate.toString(), onClick: this.onSelectMonth }, str));
        })));
    }
    renderMonth() {
        const { monthMatrix } = this;
        const { showCalendarWeek, selectWeek } = this.props;
        return (React.createElement(Table, { className: "month", selectWeek: selectWeek, cellSpacing: 0, cellPadding: 0 },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    showCalendarWeek && React.createElement("th", { className: "calendar-week" }),
                    React.createElement("th", null, "Mo"),
                    React.createElement("th", null, "Di"),
                    React.createElement("th", null, "Mi"),
                    React.createElement("th", null, "Do"),
                    React.createElement("th", null, "Fr"),
                    React.createElement("th", null, "Sa"),
                    React.createElement("th", null, "So"))),
            React.createElement("tbody", null, monthMatrix.map((dates, i) => (React.createElement("tr", { key: i },
                showCalendarWeek && (React.createElement("td", { className: "calendar-week" }, utils_1.getWeekOfYear(dates[0]))),
                dates.map((date, j) => (React.createElement("td", { className: "day", key: j }, this.renderDay(date))))))))));
    }
    renderDay(day) {
        const num = day.getDate();
        const { value, date, selectWeek } = this.props;
        let selected = value &&
            day.getDate() === value.getDate() &&
            day.getMonth() === value.getMonth();
        const current = day.getMonth() === date.getMonth();
        const disabled = utils_1.isDisabled(day, this.props);
        const today = utils_1.isToday(day);
        if (selectWeek && value) {
            selected = utils_1.getWeekOfYear(value) === utils_1.getWeekOfYear(day);
        }
        return (React.createElement(Day, { "data-date": day.toString(), className: selected ? 'value selected' : 'value', selected: selected, current: current, disabled: disabled, today: today, onClick: this.onSelectDay }, num));
    }
    renderConfirm() {
        const { valueText, format } = this.props;
        const validDate = utils_1.validateDate(valueText, format);
        return (React.createElement(Confirm, null,
            React.createElement(button_1.Button, { tabIndex: -1, disabled: validDate === null, onClick: () => this.props.onSubmit(this.props.onToggle) }, "Ok")));
    }
    onSelectDay(e) {
        const date = new Date(e.currentTarget.getAttribute('data-date'));
        this.props.onSelectDay(date);
    }
    onSelectMonth(e) {
        const date = new Date(e.currentTarget.getAttribute('data-date'));
        setTimeout(() => this.props.onSelectMonth(date), 0);
    }
    onSelectYear(e) {
        const date = new Date(e.currentTarget.getAttribute('data-date'));
        setTimeout(() => this.props.onSelectYear(date), 0);
    }
}
exports.Menu = Menu;
//# sourceMappingURL=menu.js.map
});
___scope___.file("utils.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const moment_1 = require("moment");
const momentImport = require("moment");
const moment = moment_1.default || momentImport;
const formatSplit = /[.|:|-|\\|_|\s]/;
function dateFormat(date, format) {
    return moment(date).format(format);
}
exports.dateFormat = dateFormat;
function validateDate(date, format) {
    const instance = moment(date, format, true);
    return instance.isValid() ? instance.toDate() : null;
}
exports.validateDate = validateDate;
function getFormatType(format) {
    if (/d/i.test(format)) {
        return 'day';
    }
    if (/M/.test(format)) {
        return 'month';
    }
    if (/y/i.test(format)) {
        return 'year';
    }
    if (/h/i.test(format)) {
        return 'hour';
    }
    if (/m/.test(format)) {
        return 'minute';
    }
    if (/s/.test(format)) {
        return 'second';
    }
    return undefined;
}
exports.getFormatType = getFormatType;
/** @return returns a string with transformed value, true for valid input or false for invalid input */
function validateFormatGroup(input, format) {
    if (isFinite(input)) {
        const int = typeof input === 'string' ? parseInt(input, 10) : input;
        const char = String(input);
        const strLen = char.length;
        const type = getFormatType(format);
        switch (type) {
            case 'day':
                if (strLen === 1) {
                    if (int >= 0 && int <= 3) {
                        return true;
                    }
                    else {
                        return `0${input}`;
                    }
                }
                if (strLen === 2 && int >= 1 && int <= 31) {
                    return true;
                }
                break;
            case 'month':
                if (strLen === 1) {
                    if (int === 0 || int === 1) {
                        return true;
                    }
                    else {
                        return `0${input}`;
                    }
                }
                if (strLen === 2 && int >= 0 && int <= 12) {
                    return true;
                }
                break;
            case 'year':
                if (strLen === 1 && (int === 1 || int === 2)) {
                    return true;
                }
                if (strLen >= 2 &&
                    (char.startsWith('19') || char.startsWith('20'))) {
                    return true;
                }
                break;
            case 'hour':
                if (strLen === 1) {
                    if (int >= 0 && int <= 2) {
                        return true;
                    }
                    else {
                        return `0${input}`;
                    }
                }
                if (strLen >= 2 && int >= 0 && int <= 24) {
                    return true;
                }
                break;
            case 'minute':
            case 'second':
                if (strLen === 1) {
                    if (int >= 0 && int <= 5) {
                        return true;
                    }
                    else {
                        return `0${input}`;
                    }
                }
                if (strLen >= 2 && int >= 0 && int <= 59) {
                    return true;
                }
                break;
        }
    }
    return false;
}
exports.validateFormatGroup = validateFormatGroup;
function stringFromCharCode(keyCode) {
    const charCode = keyCode - 48 * Math.floor(keyCode / 48);
    return String.fromCharCode(96 <= keyCode ? charCode : keyCode);
}
exports.stringFromCharCode = stringFromCharCode;
function formatNumber(number) {
    if (number <= 1) {
        return '01';
    }
    if (number <= 9) {
        return `0${number}`;
    }
    return String(number);
}
exports.formatNumber = formatNumber;
function splitDate(date, format) {
    return dateFormat(date, format).split(formatSplit);
}
exports.splitDate = splitDate;
function joinDates(parts, format) {
    const strParts = parts
        .map(part => (part instanceof HTMLElement ? part.innerText : part))
        .filter(val => val);
    const splittedFormat = format.split(formatSplit);
    if (strParts.length !== splittedFormat.length) {
        return '';
    }
    const date = strParts.join(' ');
    const spaceFormat = splittedFormat.join(' ');
    const momentDate = moment(date, spaceFormat);
    const parsingFlags = momentDate.parsingFlags();
    switch (parsingFlags.overflow) {
        case 2:
            return moment(
            // @ts-ignore
            new Date(...parsingFlags.parsedDateParts)).format(format);
    }
    return momentDate.format(format);
}
exports.joinDates = joinDates;
function clearSelection() {
    const sel = getSelection();
    if (sel.empty) {
        // Chrome
        sel.empty();
    }
    else if (sel.removeAllRanges) {
        // Firefox
        sel.removeAllRanges();
    }
}
exports.clearSelection = clearSelection;
function getWeekOfYear(date) {
    return moment(date).isoWeek();
}
exports.getWeekOfYear = getWeekOfYear;
function startOfWeek(date) {
    return moment(date)
        .startOf('isoWeek')
        .toDate();
}
exports.startOfWeek = startOfWeek;
function endOfWeek(date) {
    return moment(date)
        .endOf('isoWeek')
        .toDate();
}
exports.endOfWeek = endOfWeek;
function startOfDay(date) {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
}
exports.startOfDay = startOfDay;
function endOfDay(date) {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
}
exports.endOfDay = endOfDay;
function endOfYear(date) {
    return moment(date)
        .endOf('year')
        .toDate();
}
exports.endOfYear = endOfYear;
function addDays(date, num) {
    return moment(date)
        .add(num, 'days')
        .toDate();
}
exports.addDays = addDays;
function addMonths(date, num) {
    return moment(date)
        .add(num, 'months')
        .toDate();
}
exports.addMonths = addMonths;
function addYears(date, num) {
    return moment(date)
        .add(num, 'years')
        .toDate();
}
exports.addYears = addYears;
function addHours(date, num) {
    return moment(date)
        .add(num, 'hours')
        .toDate();
}
exports.addHours = addHours;
function addMinutes(date, num) {
    return moment(date)
        .add(num, 'minutes')
        .toDate();
}
exports.addMinutes = addMinutes;
function addSeconds(date, num) {
    return moment(date)
        .add(num, 'seconds')
        .toDate();
}
exports.addSeconds = addSeconds;
function subtractSeconds(date, num) {
    return moment(date)
        .subtract(num, 'seconds')
        .toDate();
}
exports.subtractSeconds = subtractSeconds;
function subtractMinutes(date, num) {
    return moment(date)
        .subtract(num, 'minutes')
        .toDate();
}
exports.subtractMinutes = subtractMinutes;
function subtractHours(date, num) {
    return moment(date)
        .subtract(num, 'hours')
        .toDate();
}
exports.subtractHours = subtractHours;
function subtractDays(date, num) {
    return moment(date)
        .subtract(num, 'days')
        .toDate();
}
exports.subtractDays = subtractDays;
function subtractMonths(date, num) {
    return moment(date)
        .subtract(num, 'months')
        .toDate();
}
exports.subtractMonths = subtractMonths;
function subtractYears(date, num) {
    return moment(date)
        .subtract(num, 'years')
        .toDate();
}
exports.subtractYears = subtractYears;
function manipulateDate(date, formatType, direction) {
    switch (formatType) {
        case 'day':
            if (direction === 'add')
                return addDays(date, 1);
            if (direction === 'subtract')
                return subtractDays(date, 1);
            break;
        case 'month':
            if (direction === 'add')
                return addMonths(date, 1);
            if (direction === 'subtract')
                return subtractMonths(date, 1);
            break;
        case 'year':
            if (direction === 'add')
                return addYears(date, 1);
            if (direction === 'subtract')
                return subtractYears(date, 1);
            break;
        case 'hour':
            if (direction === 'add')
                return addHours(date, 1);
            if (direction === 'subtract')
                return subtractHours(date, 1);
            break;
        case 'minute':
            if (direction === 'add')
                return addMinutes(date, 1);
            if (direction === 'subtract')
                return subtractMinutes(date, 1);
            break;
        case 'second':
            if (direction === 'add')
                return addSeconds(date, 1);
            if (direction === 'subtract')
                return subtractSeconds(date, 1);
            break;
    }
    return new Date();
}
exports.manipulateDate = manipulateDate;
function startOfMonth(date) {
    const newDate = new Date(date);
    newDate.setDate(1);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
}
exports.startOfMonth = startOfMonth;
function endOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
exports.endOfMonth = endOfMonth;
function isUndefined(val) {
    return val === null || val === undefined;
}
exports.isUndefined = isUndefined;
function setDate(date, hour, min) {
    const newDate = new Date(date);
    newDate.setHours(hour, min);
    return newDate;
}
exports.setDate = setDate;
function isToday(date) {
    return moment(date).isSame(new Date(), 'day');
}
exports.isToday = isToday;
function getMonthNames(short) {
    if (short) {
        return moment.monthsShort();
    }
    return moment.months();
}
exports.getMonthNames = getMonthNames;
function isDisabled(date, { minDate, maxDate }) {
    return ((minDate && date < startOfDay(minDate)) ||
        (maxDate && date >= endOfDay(maxDate)));
}
exports.isDisabled = isDisabled;
function getAttribute(input, attr) {
    return input.getAttribute(attr);
}
exports.getAttribute = getAttribute;
exports.keys = {
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
    ARROW_LEFT: 37,
    ENTER: 13,
    TAB: 9,
    ESC: 27,
    BACKSPACE: 8,
    DELETE: 46,
    SPACE: 32,
    SHIFT: 16,
    A: 65
};
//# sourceMappingURL=react-timebomb.js.map?tm=1546005837452
});
___scope___.file("button.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const styled_components_1 = require("styled-components");
exports.Button = styled_components_1.default.button `
    margin-right: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 3px 6px;
    min-height: 21px;
    box-sizing: border-box;
    background: ${(props) => props.selected ? '#ccc' : '#fff'};

    &:focus {
        outline: none;
    }

    &:disabled {
        cursor: not-allowed;
    }

    &:not(:disabled) {
        cursor: pointer;
    }

    &:not(:disabled):hover {
        background-color: ${(props) => props.selected ? '#ccc' : '#efefef'};
    }

    &:last-child {
        margin-right: 0;
    }
`;
//# sourceMappingURL=button.js.map
});
___scope___.file("menu-title.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const styled_components_1 = require("styled-components");
const button_1 = require("./button");
const utils_1 = require("./utils");
const Container = styled_components_1.default.div `
    display: ${(props) => (props.show ? 'flex' : 'none')};
    align-items: center;
    width: 100%;
    padding: 10px 10px 15px;
    justify-content: space-between;
    min-height: 21px;
    box-sizing: border-box;
`;
class MenuTitle extends React.PureComponent {
    get prevDisabled() {
        const { minDate, date } = this.props;
        if (minDate) {
            return utils_1.subtractDays(utils_1.startOfMonth(date), 1) < minDate;
        }
        return false;
    }
    get nextDisabled() {
        const { maxDate, date } = this.props;
        if (maxDate) {
            return utils_1.addDays(utils_1.endOfMonth(date), 1) > maxDate;
        }
        return false;
    }
    render() {
        const { date, mode, onNextMonth, onPrevMonth, onMonths, onYear } = this.props;
        const months = utils_1.getMonthNames(true);
        const show = mode === 'month';
        return (React.createElement(Container, { show: show },
            React.createElement(button_1.Button, { tabIndex: -1, disabled: this.prevDisabled, onClick: onPrevMonth }, "\u25C0"),
            React.createElement("div", null,
                React.createElement(button_1.Button, { tabIndex: -1, onClick: onMonths },
                    React.createElement("b", null, months[date.getMonth()])),
                React.createElement(button_1.Button, { tabIndex: -1, onClick: onYear }, date.getFullYear())),
            React.createElement(button_1.Button, { tabIndex: -1, disabled: this.nextDisabled, onClick: onNextMonth }, "\u25B6")));
    }
}
exports.MenuTitle = MenuTitle;
//# sourceMappingURL=menu-title.js.map
});
___scope___.file("value.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const styled_components_1 = require("styled-components");
const utils_1 = require("./utils");
const Flex = styled_components_1.default.div `
    display: flex;
    align-items: center;
`;
const Container = styled_components_1.default(Flex) `
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    border: 1px solid #ccc;
    cursor: pointer;
    width: 100%;
    height: 100%;
`;
const Input = styled_components_1.default.span `
    padding: 2px 0 2px 0;
    min-width: 1px;
    cursor: text;

    &:focus {
        outline: none;
    }

    &:last-of-type {
        padding: 2px 10px 2px 0;
    }

    &:not(:last-of-type):after {
        content: attr(data-separator);
        width: 4px;
        display: inline-block;
    }

    &:empty:before {
        content: attr(data-placeholder);
        color: #aaa;
    }

    &:empty:not(:last-of-type):after {
        color: #aaa;
    }
`;
const Button = styled_components_1.default.button `
    font-size: 13px;
    color: #ccc;
    cursor: pointer;
    border: none;
    line-height: 1;

    &:hover {
        color: #333;
    }

    &:focus {
        outline: none;
    }
`;
const ClearButton = styled_components_1.default(Button) `
    font-size: 18px;
`;
const Placeholder = styled_components_1.default.span `
    color: #aaa;
    user-select: none;
`;
const Icon = styled_components_1.default.span `
    margin-right: 5px;
    user-select: none;

    &:after {
        content: '📅';
    }
`;
const WHITELIST_KEYS = [utils_1.keys.BACKSPACE, utils_1.keys.DELETE, utils_1.keys.TAB];
class Value extends React.PureComponent {
    constructor(props) {
        super(props);
        this.searchInputs = [];
        this.onSearchRef = this.onSearchRef.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }
    get formatGroups() {
        return this.props.format.split('').reduce((memo, char) => {
            const prevChar = memo[memo.length - 1];
            if (prevChar && char === prevChar.substr(0, 1)) {
                memo[memo.length - 1] += char;
            }
            else {
                memo = [...memo, char];
            }
            return memo;
        }, []);
    }
    get focused() {
        return document.querySelector(':focus');
    }
    componentDidUpdate(prevProps) {
        const { open, value, format } = this.props;
        const hasFocus = this.searchInputs.some(inp => inp === this.focused);
        if (!hasFocus) {
            if (prevProps.value !== value && value) {
                const parts = utils_1.splitDate(value, format);
                const input = this.searchInputs[0];
                this.searchInputs.forEach((input, i) => (input.innerText = parts[i]));
                if (input) {
                    input.focus();
                }
            }
            if ((open && !prevProps.open) || value !== prevProps.value) {
                const input = this.searchInputs[0];
                if (input) {
                    if (input.innerText === '') {
                        input.focus();
                    }
                    else {
                        this.selectText(input);
                    }
                }
            }
        }
        if (!open && value) {
            const parts = utils_1.splitDate(value, format);
            this.searchInputs.forEach((input, i) => (input.innerText = parts[i]));
        }
    }
    render() {
        const { placeholder, value, open } = this.props;
        const showPlaceholder = placeholder && !open;
        return (React.createElement(Container, { "data-role": "value", className: "react-slct-value react-timebomb-value", onClick: this.onToggle },
            React.createElement(Flex, null,
                React.createElement(Icon, { className: "react-timebomb-icon" }),
                React.createElement(Flex, null,
                    this.renderValue(),
                    showPlaceholder && (React.createElement(Placeholder, { className: "react-timebomb-placeholder" }, placeholder)))),
            React.createElement(Flex, null,
                value && (React.createElement(ClearButton, { className: "react-timebomb-clearer", tabIndex: -1, onClick: this.onClear }, "\u00D7")),
                React.createElement(Button, { tabIndex: -1, className: "react-timebomb-arrow" }, open ? '▲' : '▼'))));
    }
    renderValue() {
        const { open, value } = this.props;
        if (!open && !value) {
            return null;
        }
        const { formatGroups } = this;
        return (React.createElement(Flex, null, formatGroups.map((group, i) => {
            if (group === '.' || group === ':' || group === ' ') {
                return null;
            }
            else {
                const separator = formatGroups[i + 1];
                return (React.createElement(Input, { contentEditable: true, "data-placeholder": group, "data-separator": separator, key: group, "data-group": group, ref: this.onSearchRef, onKeyDown: this.onKeyDown, onKeyUp: this.onKeyUp, onFocus: this.onFocus, onClick: this.onFocus, onChange: this.onChange }));
            }
        })));
    }
    selectText(el) {
        if (el) {
            const range = document.createRange();
            const sel = getSelection();
            range.selectNodeContents(el);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
    onSearchRef(el) {
        if (el) {
            this.searchInputs.push(el);
        }
        else {
            this.searchInputs = [];
        }
    }
    onKeyDown(e) {
        const { onChangeValueText, format, value, allowValidation } = this.props;
        const input = e.currentTarget;
        const { innerText, nextSibling, previousSibling } = input;
        const sel = getSelection();
        const hasSelection = Boolean(sel.focusOffset - sel.baseOffset);
        let numericValue = parseInt(innerText, 10);
        switch (e.keyCode) {
            case utils_1.keys.ENTER:
            case utils_1.keys.ESC:
                e.preventDefault();
                return;
            case utils_1.keys.ARROW_RIGHT:
                e.preventDefault();
                if (nextSibling instanceof HTMLSpanElement) {
                    nextSibling.focus();
                }
                else {
                    this.selectText(input);
                }
                return;
            case utils_1.keys.ARROW_LEFT:
                e.preventDefault();
                if (previousSibling instanceof HTMLSpanElement) {
                    previousSibling.focus();
                }
                else {
                    this.selectText(input);
                }
                return;
            case utils_1.keys.ARROW_UP:
            case utils_1.keys.ARROW_DOWN:
                e.preventDefault();
                const isArrowUp = e.keyCode === utils_1.keys.ARROW_UP;
                if (isNaN(numericValue)) {
                    numericValue = 0;
                }
                if (isFinite(numericValue)) {
                    const formatGroup = utils_1.getAttribute(input, 'data-group');
                    const formatType = utils_1.getFormatType(formatGroup);
                    if (!allowValidation) {
                        const nextValue = numericValue + (isArrowUp ? 1 : -1);
                        const valid = utils_1.validateFormatGroup(nextValue, formatGroup);
                        if (valid) {
                            input.innerText =
                                typeof valid === 'string'
                                    ? valid
                                    : utils_1.formatNumber(nextValue);
                        }
                    }
                    else {
                        if (value && formatType) {
                            const direction = isArrowUp ? 'add' : 'subtract';
                            const newDate = utils_1.manipulateDate(value, formatType, direction);
                            const disabled = utils_1.isDisabled(newDate, this.props);
                            if (!disabled) {
                                const dateParts = utils_1.splitDate(newDate, format);
                                this.searchInputs.map((inp, i) => (inp.innerText = dateParts[i]));
                            }
                        }
                    }
                    this.selectText(input);
                    onChangeValueText(utils_1.joinDates(this.searchInputs, format));
                }
                return;
        }
        const dataValue = utils_1.getAttribute(input, 'data-value');
        const dataGroup = utils_1.getAttribute(input, 'data-group');
        const char = utils_1.stringFromCharCode(e.keyCode);
        const groupValue = dataValue && !hasSelection ? dataValue + char : char;
        if (WHITELIST_KEYS.includes(e.keyCode) || e.metaKey || e.ctrlKey) {
            return;
        }
        const valid = utils_1.validateFormatGroup(groupValue, dataGroup);
        if (!valid) {
            e.preventDefault();
        }
        else if (typeof valid === 'string') {
            e.preventDefault();
            input.innerText = valid;
        }
        if (hasSelection) {
            return;
        }
        // validate group
        if (innerText.length >= dataGroup.length) {
            e.preventDefault();
        }
    }
    onKeyUp(e) {
        const { onChangeValueText, format, allowValidation } = this.props;
        const input = e.currentTarget;
        const { innerText, nextSibling } = input;
        if (e.keyCode === utils_1.keys.ENTER || e.keyCode === utils_1.keys.ESC) {
            if (this.focused) {
                this.focused.blur();
            }
            this.props.onSubmit(this.props.onToggle);
            return;
        }
        const forbiddenKeys = [
            utils_1.keys.SHIFT,
            utils_1.keys.ARROW_LEFT,
            utils_1.keys.ARROW_RIGHT,
            utils_1.keys.ARROW_UP,
            utils_1.keys.ARROW_DOWN,
            utils_1.keys.TAB
        ];
        // focus next
        if (innerText.length >= utils_1.getAttribute(input, 'data-group').length &&
            !forbiddenKeys.includes(e.keyCode)) {
            if (allowValidation || !nextSibling) {
                this.selectText(input);
            }
            else if (nextSibling instanceof HTMLSpanElement) {
                this.selectText(nextSibling);
            }
            onChangeValueText(utils_1.joinDates(this.searchInputs, format));
        }
        input.setAttribute('data-value', innerText);
    }
    onFocus(e) {
        this.selectText(e.currentTarget);
    }
    onChange(e) {
        const { format, onChangeValueText } = this.props;
        const input = e.currentTarget;
        const { innerText, nextSibling } = input;
        onChangeValueText(utils_1.joinDates(this.searchInputs, format));
        if (innerText.length >= utils_1.getAttribute(input, 'data-group').length) {
            if (nextSibling instanceof HTMLSpanElement) {
                nextSibling.focus();
            }
        }
    }
    onClear(e) {
        e.stopPropagation();
        this.props.onChangeValueText('');
    }
    onToggle(e) {
        const { open, onToggle } = this.props;
        if (this.searchInputs.some(inp => inp === e.target) === false ||
            !open) {
            onToggle();
        }
    }
}
exports.Value = Value;
//# sourceMappingURL=value.js.map
});
___scope___.file("typings.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=react-timebomb.js.map?tm=1546006840776
});
return ___scope___.entry = "index.jsx";
});

FuseBox.import("default/index.jsx");
FuseBox.main("default/index.jsx");
})
(function(e){function r(e){var r=e.charCodeAt(0),n=e.charCodeAt(1);if((m||58!==n)&&(r>=97&&r<=122||64===r)){if(64===r){var t=e.split("/"),i=t.splice(2,t.length).join("/");return[t[0]+"/"+t[1],i||void 0]}var o=e.indexOf("/");if(o===-1)return[e];var a=e.substring(0,o),f=e.substring(o+1);return[a,f]}}function n(e){return e.substring(0,e.lastIndexOf("/"))||"./"}function t(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var o=[],t=0,i=n.length;t<i;t++){var a=n[t];a&&"."!==a&&(".."===a?o.pop():o.push(a))}return""===n[0]&&o.unshift(""),o.join("/")||(o.length?"/":".")}function i(e){var r=e.match(/\.(\w{1,})$/);return r&&r[1]?e:e+".js"}function o(e){if(m){var r,n=document,t=n.getElementsByTagName("head")[0];/\.css$/.test(e)?(r=n.createElement("link"),r.rel="stylesheet",r.type="text/css",r.href=e):(r=n.createElement("script"),r.type="text/javascript",r.src=e,r.async=!0),t.insertBefore(r,t.firstChild)}}function a(e,r){for(var n in e)e.hasOwnProperty(n)&&r(n,e[n])}function f(e){return{server:require(e)}}function u(e,n){var o=n.path||"./",a=n.pkg||"default",u=r(e);if(u&&(o="./",a=u[0],n.v&&n.v[a]&&(a=a+"@"+n.v[a]),e=u[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),o="./";else if(!m&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return f(e);var s=x[a];if(!s){if(m&&"electron"!==_.target)throw"Package not found "+a;return f(a+(e?"/"+e:""))}e=e?e:"./"+s.s.entry;var l,d=t(o,e),c=i(d),p=s.f[c];return!p&&c.indexOf("*")>-1&&(l=c),p||l||(c=t(d,"/","index.js"),p=s.f[c],p||"."!==d||(c=s.s&&s.s.entry||"index.js",p=s.f[c]),p||(c=d+".js",p=s.f[c]),p||(p=s.f[d+".jsx"]),p||(c=d+"/index.jsx",p=s.f[c])),{file:p,wildcard:l,pkgName:a,versions:s.v,filePath:d,validPath:c}}function s(e,r,n){if(void 0===n&&(n={}),!m)return r(/\.(js|json)$/.test(e)?h.require(e):"");if(n&&n.ajaxed===e)return console.error(e,"does not provide a module");var i=new XMLHttpRequest;i.onreadystatechange=function(){if(4==i.readyState)if(200==i.status){var n=i.getResponseHeader("Content-Type"),o=i.responseText;/json/.test(n)?o="module.exports = "+o:/javascript/.test(n)||(o="module.exports = "+JSON.stringify(o));var a=t("./",e);_.dynamic(a,o),r(_.import(e,{ajaxed:e}))}else console.error(e,"not found on request"),r(void 0)},i.open("GET",e,!0),i.send()}function l(e,r){var n=y[e];if(n)for(var t in n){var i=n[t].apply(null,r);if(i===!1)return!1}}function d(e){if(null!==e&&["function","object","array"].indexOf(typeof e)!==-1&&!e.hasOwnProperty("default"))return Object.isFrozen(e)?void(e.default=e):void Object.defineProperty(e,"default",{value:e,writable:!0,enumerable:!1})}function c(e,r){if(void 0===r&&(r={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return o(e);var t=u(e,r);if(t.server)return t.server;var i=t.file;if(t.wildcard){var a=new RegExp(t.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@@/g,".*").replace(/@/g,"[a-z0-9$_-]+"),"i"),f=x[t.pkgName];if(f){var p={};for(var v in f.f)a.test(v)&&(p[v]=c(t.pkgName+"/"+v));return p}}if(!i){var g="function"==typeof r,y=l("async",[e,r]);if(y===!1)return;return s(e,function(e){return g?r(e):null},r)}var w=t.pkgName;if(i.locals&&i.locals.module)return i.locals.module.exports;var b=i.locals={},j=n(t.validPath);b.exports={},b.module={exports:b.exports},b.require=function(e,r){var n=c(e,{pkg:w,path:j,v:t.versions});return _.sdep&&d(n),n},m||!h.require.main?b.require.main={filename:"./",paths:[]}:b.require.main=h.require.main;var k=[b.module.exports,b.require,b.module,t.validPath,j,w];return l("before-import",k),i.fn.apply(k[0],k),l("after-import",k),b.module.exports}if(e.FuseBox)return e.FuseBox;var p="undefined"!=typeof ServiceWorkerGlobalScope,v="undefined"!=typeof WorkerGlobalScope,m="undefined"!=typeof window&&"undefined"!=typeof window.navigator||v||p,h=m?v||p?{}:window:global;m&&(h.global=v||p?{}:window),e=m&&"undefined"==typeof __fbx__dnm__?e:module.exports;var g=m?v||p?{}:window.__fsbx__=window.__fsbx__||{}:h.$fsbx=h.$fsbx||{};m||(h.require=require);var x=g.p=g.p||{},y=g.e=g.e||{},_=function(){function r(){}return r.global=function(e,r){return void 0===r?h[e]:void(h[e]=r)},r.import=function(e,r){return c(e,r)},r.on=function(e,r){y[e]=y[e]||[],y[e].push(r)},r.exists=function(e){try{var r=u(e,{});return void 0!==r.file}catch(e){return!1}},r.remove=function(e){var r=u(e,{}),n=x[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},r.main=function(e){return this.mainFile=e,r.import(e,{})},r.expose=function(r){var n=function(n){var t=r[n].alias,i=c(r[n].pkg);"*"===t?a(i,function(r,n){return e[r]=n}):"object"==typeof t?a(t,function(r,n){return e[n]=i[r]}):e[t]=i};for(var t in r)n(t)},r.dynamic=function(r,n,t){this.pkg(t&&t.pkg||"default",{},function(t){t.file(r,function(r,t,i,o,a){var f=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);f(!0,r,t,i,o,a,e)})})},r.flush=function(e){var r=x.default;for(var n in r.f)e&&!e(n)||delete r.f[n].locals},r.pkg=function(e,r,n){if(x[e])return n(x[e].s);var t=x[e]={};return t.f={},t.v=r,t.s={file:function(e,r){return t.f[e]={fn:r}}},n(t.s)},r.addPlugin=function(e){this.plugins.push(e)},r.packages=x,r.isBrowser=m,r.isServer=!m,r.plugins=[],r}();return m||(h.FuseBox=_),e.FuseBox=_}(this))
//# sourceMappingURL=react-timebomb.js.map?tm=1546008477129