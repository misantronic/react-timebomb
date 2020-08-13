(function(FuseBox){FuseBox.$fuse$=FuseBox;
FuseBox.target = "browser";
FuseBox.pkg("default", {}, function(___scope___){
___scope___.file("index.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactTimebomb = void 0;
const React = require("react");
const styled_components_1 = require("styled-components");
const react_slct_1 = require("react-slct");
const menu_1 = require("./menu");
const title_1 = require("./menu/title");
const value_1 = require("./value/value");
const utils_1 = require("./utils");
const value_multi_1 = require("./value/value-multi");
__exportStar(require("./typings"), exports);
const Container = styled_components_1.default.div `
    width: 100%;
    height: 100%;
    position: relative;
    background: #fff;
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
    height: 100%;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;

    * {
        box-sizing: border-box;
    }

    ${(props) => props.mobile
    ? styled_components_1.css `
                  position: fixed;
                  left: 50% !important;
                  top: 50% !important;
                  max-width: 96%;
                  width: 360px !important;
                  height: 320px !important;
                  margin-left: -180px;
                  margin-top: -160px;
                  max-height: 100%;
                  font-size: 16px;
                  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);

                  @media (max-width: 360px) {
                      width: 100% !important;
                      left: 0 !important;
                      margin-left: 0;
                      max-width: 100%;
                  }
              `
    : ''}
`;
const BlindInput = styled_components_1.default.input `
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    pointer-events: none;
`;
class ReactTimebomb extends React.Component {
    constructor(props) {
        super(props);
        this.valueRef = React.createRef();
        this.emitChange = (() => {
            let timeout = 0;
            return (date) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    const { value, onChange } = this.props;
                    if (utils_1.dateEqual(value, date)) {
                        return;
                    }
                    const changeDate = utils_1.isArray(date) ? date : [date];
                    onChange(...changeDate);
                    yield this.setStateAsync({
                        allowValidation: Boolean(date),
                        preventClose: false
                    });
                }), 0);
            };
        })();
        const { minDate, maxDate } = props;
        if (minDate && maxDate && utils_1.isBefore(maxDate, minDate)) {
            console.error('[react-timebomb]: minDate must appear before maxDate');
        }
        this.state = this.initialState;
        this.onChangeValueText = this.onChangeValueText.bind(this);
        this.emitChangeAndClose = this.emitChangeAndClose.bind(this);
        this.onSelectDay = this.onSelectDay.bind(this);
        this.onModeDay = this.onModeDay.bind(this);
        this.onModeYear = this.onModeYear.bind(this);
        this.onModeMonth = this.onModeMonth.bind(this);
        this.onChangeMonth = this.onChangeMonth.bind(this);
        this.onChangeYear = this.onChangeYear.bind(this);
        this.onReset = this.onReset.bind(this);
        this.onNextMonth = this.onNextMonth.bind(this);
        this.onPrevMonth = this.onPrevMonth.bind(this);
        this.onSelectTime = this.onSelectTime.bind(this);
        this.onSubmitOrCancelTime = this.onSubmitOrCancelTime.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onChangeFormatGroup = this.onChangeFormatGroup.bind(this);
        this.onHoverDays = this.onHoverDays.bind(this);
        this.onMultiValueSelect = this.onMultiValueSelect.bind(this);
        this.onPaste = this.onPaste.bind(this);
        this.onMobileMenuContainerClick = this.onMobileMenuContainerClick.bind(this);
    }
    /** @internal */
    static getDerivedStateFromProps(props) {
        const format = props.format;
        const { minDate, maxDate } = props;
        return {
            minDate: minDate ? utils_1.startOfDay(minDate) : undefined,
            maxDate: maxDate ? utils_1.endOfDay(maxDate) : undefined,
            showTime: utils_1.isTimeFormat(format),
            showDate: utils_1.isDateFormat(format)
        };
    }
    getMobileMenuContainer(MenuContainer) {
        return styled_components_1.default(MenuContainer) `
            position: fixed;
            left: 0 !important;
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0, 0, 0, 0.12);
            transform: none;
        `;
    }
    get className() {
        const classNames = ['react-timebomb'];
        if (this.props.className) {
            classNames.push(this.props.className);
        }
        if (this.props.error) {
            classNames.push('error');
        }
        if (this.props.disabled) {
            classNames.push('disabled');
        }
        return classNames.join(' ');
    }
    get defaultDateValue() {
        const { value, minDate, maxDate } = this.props;
        if (value) {
            return value;
        }
        let date = new Date();
        if (maxDate && utils_1.isBefore(maxDate, date)) {
            date = maxDate;
        }
        else if (minDate && utils_1.isAfter(minDate, date)) {
            date = minDate;
        }
        return utils_1.startOfDay(date);
    }
    get initialState() {
        return {
            allowValidation: false,
            mode: utils_1.getFormatType(this.props.format),
            valueText: this.props.value
                ? utils_1.dateFormat(this.props.value, this.props.format)
                : undefined,
            date: this.defaultDateValue,
            hoverDate: undefined,
            menuHeight: 'auto',
            selectedRange: 0,
            preventClose: false
        };
    }
    componentDidUpdate(prevProps, prevState) {
        return __awaiter(this, void 0, void 0, function* () {
            const { valueText, showDate, showTime, preventClose } = this.state;
            const { value, format, selectRange, showConfirm } = this.props;
            if (prevProps.format !== format || prevProps.value !== value) {
                this.setState({
                    valueText: value ? utils_1.dateFormat(value, format) : undefined
                });
            }
            if (!utils_1.stringEqual(prevState.valueText, valueText)) {
                const result = yield this.validateValueText();
                if (result.error) {
                    this.emitError(result.error, result.valueText);
                }
                if (result.date) {
                    const rangeIsComplete = selectRange &&
                        utils_1.isArray(result.date) &&
                        result.date.length === 2;
                    if ((!showConfirm && !selectRange && showDate) ||
                        rangeIsComplete) {
                        if (prevState.mode === 'day' && !preventClose) {
                            this.emitChangeAndClose(result.date);
                        }
                        else {
                            this.emitChange(result.date);
                        }
                    }
                    if (!showDate && showTime) {
                        this.emitChange(result.date);
                    }
                }
            }
        });
    }
    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve);
        });
    }
    validateValueText() {
        const { valueText, allowValidation } = this.state;
        const { format } = this.props;
        const validDate = utils_1.validateDate(valueText, format);
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (validDate) {
                yield this.setStateAsync({ allowValidation: true });
                const enabled = utils_1.isArray(validDate)
                    ? validDate.some((d) => utils_1.isEnabled('day', d, this.props))
                    : utils_1.isEnabled('day', validDate, this.props);
                if (enabled) {
                    yield this.setStateAsync({ date: validDate });
                    resolve({ date: validDate });
                }
                else {
                    resolve({ error: 'outOfRange', valueText });
                }
            }
            else if (valueText) {
                resolve({ error: 'invalidDate', valueText });
            }
            else if (!utils_1.isUndefined(valueText) && allowValidation) {
                resolve({ date: undefined });
            }
        }));
    }
    render() {
        const { placeholder, showConfirm, showCalendarWeek, selectRange, format, error, disabled, mobile, timeStep, confirmComponent, onOpen } = this.props;
        const { showDate, showTime, valueText, mode, selectedRange, minDate, maxDate, hoverDate } = this.state;
        const value = valueText
            ? utils_1.validateDate(valueText, format)
            : this.props.value;
        const menuWidth = Math.max(ReactTimebomb.MENU_WIDTH, this.props.menuWidth || 0);
        const menuLeft = utils_1.isArray(value) &&
            value.length === 1 &&
            this.valueRef.current &&
            selectRange === true
            ? this.valueRef.current.getBoundingClientRect().left +
                this.valueRef.current.getBoundingClientRect().width -
                menuWidth
            : undefined;
        return (React.createElement(react_slct_1.Select, { value: value, placeholder: placeholder, error: error, onOpen: onOpen, onClose: this.onClose }, ({ placeholder, open, onToggle, onClose, onOpen, onRef, MenuContainer }) => {
            const showMenu = open && (showDate || showTime) && !disabled;
            const className = [this.className];
            const onClick = mobile
                ? this.onMobileMenuContainerClick
                : undefined;
            if (showMenu) {
                className.push('open');
            }
            this.onToggle = onToggle;
            this.onCloseMenu = onClose;
            this.onOpenMenu = onOpen;
            if (mobile) {
                MenuContainer = this.getMobileMenuContainer(MenuContainer);
            }
            return (React.createElement(Container, { ref: onRef, className: className.join(' ') },
                this.renderValue(value, placeholder, open),
                showMenu ? (React.createElement(MenuContainer, { menuLeft: menuLeft, menuWidth: menuWidth, menuHeight: this.state.menuHeight, onClick: onClick },
                    React.createElement(MenuWrapper, { className: "react-timebomb-menu", mobile: mobile },
                        React.createElement(title_1.MenuTitle, { mode: mode, mobile: mobile, date: this.state.date, minDate: minDate, maxDate: maxDate, selectedRange: selectedRange, showTime: showTime, showDate: showDate, onMonth: this.onModeMonth, onYear: this.onModeYear, onNextMonth: this.onNextMonth, onPrevMonth: this.onPrevMonth, onReset: this.onReset }),
                        React.createElement(menu_1.Menu, { showTime: showTime, showDate: showDate, showConfirm: showConfirm, showCalendarWeek: showCalendarWeek, selectRange: selectRange, timeStep: timeStep, date: this.state.date, value: value, valueText: valueText, format: format, mode: mode, mobile: mobile, minDate: minDate, maxDate: maxDate, selectedRange: selectedRange, hoverDate: hoverDate, confirmComponent: confirmComponent, onHoverDays: this.onHoverDays, onSelectDay: this.onSelectDay, onChangeMonth: this.onChangeMonth, onChangeYear: this.onChangeYear, onSelectTime: this.onSelectTime, onSubmitTime: this.onSubmitOrCancelTime, onSubmit: this.emitChangeAndClose })))) : (React.createElement(BlindInput, { type: "text", onFocus: onToggle }))));
        }));
    }
    renderValue(value, placeholder, open) {
        const { minDate, maxDate, disabled, format, selectRange, mobile, timeStep, iconComponent, arrowButtonComponent, arrowButtonId, clearComponent, labelComponent } = this.props;
        const { showDate, showTime, allowValidation, mode, hoverDate } = this.state;
        const isMulti = selectRange || utils_1.isArray(value);
        const ValueComponent = isMulti ? value_multi_1.ValueMulti : value_1.Value;
        let componentValue = isMulti
            ? value
                ? utils_1.isArray(value)
                    ? value
                    : [value]
                : undefined
            : value;
        if (utils_1.isArray(componentValue) &&
            componentValue.length === 1 &&
            hoverDate) {
            componentValue = [...componentValue, hoverDate].sort((a, b) => a.getTime() - b.getTime());
        }
        placeholder = open && !isMulti ? undefined : placeholder;
        return (React.createElement(ValueComponent, { ref: this.valueRef, mode: mode, disabled: disabled, mobile: mobile, placeholder: placeholder, format: format, selectRange: selectRange, value: componentValue, hoverDate: hoverDate, minDate: minDate, maxDate: maxDate, allowValidation: allowValidation, open: open, showDate: showDate, showTime: showTime, timeStep: timeStep, iconComponent: iconComponent, arrowButtonId: arrowButtonId, arrowButtonComponent: arrowButtonComponent, clearComponent: clearComponent, labelComponent: labelComponent, onClear: this.onClear, onChangeValueText: this.onChangeValueText, onChangeFormatGroup: this.onChangeFormatGroup, onToggle: this.onToggle, onSubmit: this.emitChangeAndClose, onAllSelect: this.onModeDay, onValueSelect: this.onMultiValueSelect, onPaste: this.onPaste }));
    }
    onClose() {
        utils_1.clearSelection();
        // get rid of this timeout
        // fixme
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            utils_1.clearSelection();
            yield this.setStateAsync(this.initialState);
            if (this.props.onClose) {
                this.props.onClose();
            }
        }), 16);
    }
    emitError(error, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state.allowValidation) {
                yield this.setStateAsync({ allowValidation: false });
                if (this.props.onError) {
                    this.props.onError(error, value);
                }
            }
        });
    }
    emitChangeAndClose(newDate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.onCloseMenu) {
                this.onCloseMenu();
            }
            utils_1.clearSelection();
            const { date } = newDate
                ? { date: newDate }
                : yield this.validateValueText();
            if (date) {
                this.emitChange(date);
            }
        });
    }
    getSelectedRange(date) {
        if (utils_1.isArray(date)) {
            if (date.length === 2) {
                if (date[0] > date[1]) {
                    return 0;
                }
                else {
                    return 1;
                }
            }
            else if (date.length === 1) {
                return 0;
            }
        }
        else {
            return 0;
        }
        return this.state.selectedRange;
    }
    onClear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setStateAsync({ valueText: undefined });
            this.emitChange(undefined);
        });
    }
    onChangeValueText(valueText) {
        this.setState({ valueText, preventClose: true });
    }
    onChangeFormatGroup(format) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setStateAsync({
                menuHeight: 'auto',
                mode: format ? utils_1.getFormatType(format) : undefined
            });
        });
    }
    onHoverDays([date0, date1]) {
        const hoverDate = date1 || date0;
        if (utils_1.isArray(this.state.valueText) &&
            utils_1.isArray(this.state.date) &&
            this.state.valueText.length === 1 &&
            this.state.date.length === 1 &&
            hoverDate) {
            this.setState({ hoverDate });
        }
    }
    onMultiValueSelect(date, index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (index === 0) {
                yield this.setStateAsync(Object.assign(Object.assign({}, this.initialState), { hoverDate: date }));
            }
            if (index === 1 &&
                utils_1.isArray(this.state.valueText) &&
                utils_1.isArray(this.state.date)) {
                const [valueText0] = this.state.valueText;
                const [date0] = this.state.date;
                yield this.setStateAsync(Object.assign(Object.assign({}, this.initialState), { valueText: [valueText0], date: [date0], hoverDate: date }));
            }
            // since closing of the menu is delayed (16ms), we need to deplay the opening as well
            // fixme
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                if (this.onOpenMenu) {
                    this.onOpenMenu();
                }
                yield this.setStateAsync({ hoverDate: date });
            }), 32);
        });
    }
    onSelectDay(day) {
        const { value, selectRange } = this.props;
        const format = this.props.format;
        const valueDate = (() => {
            if (value instanceof Date) {
                return value;
            }
            if (utils_1.isArray(value)) {
                return value[0];
            }
            return day;
        })();
        if (selectRange === 'week') {
            const date = [utils_1.startOfWeek(day), utils_1.endOfWeek(day)];
            const valueText = utils_1.dateFormat(date, format);
            this.setState({ date, valueText, hoverDate: undefined });
        }
        else if (typeof selectRange === 'number') {
            const date = [day, utils_1.addDays(day, selectRange - 1)];
            const valueText = utils_1.dateFormat(date, format);
            this.setState({ date, valueText, hoverDate: undefined });
        }
        else if (selectRange === true) {
            const date = utils_1.setDate(day, valueDate.getHours(), valueDate.getMinutes());
            const dateArr = utils_1.isArray(this.state.valueText) &&
                this.state.valueText.length === 1
                ? [
                    utils_1.validateDate(this.state.valueText[0], format),
                    date
                ]
                : [date];
            const selectedRange = this.getSelectedRange(dateArr);
            const valueText = utils_1.dateFormat(dateArr.sort(utils_1.sortDates), format);
            this.setState({
                date: dateArr,
                valueText,
                selectedRange,
                hoverDate: undefined
            });
        }
        else {
            const date = utils_1.setDate(day, valueDate.getHours(), valueDate.getMinutes());
            const valueText = utils_1.dateFormat(date, format);
            this.setState({ date, valueText, hoverDate: undefined });
        }
    }
    onModeDay() {
        this.setState({ mode: 'day' });
    }
    onModeYear() {
        this.setState({ mode: 'year' });
    }
    onModeMonth() {
        this.setState({ mode: 'month' });
    }
    onChangeMonth(date) {
        this.setState({ date, mode: 'day' });
    }
    onChangeYear(date) {
        this.setState({ date, mode: 'day' });
    }
    onReset() {
        this.setState({ date: this.defaultDateValue });
    }
    onNextMonth() {
        const currentDate = utils_1.isArray(this.state.date)
            ? this.state.date[this.state.selectedRange]
            : this.state.date;
        if (currentDate) {
            const date = new Date(currentDate);
            date.setMonth(date.getMonth() + 1);
            this.setState({ date });
        }
    }
    onPrevMonth() {
        const currentDate = utils_1.isArray(this.state.date)
            ? this.state.date[this.state.selectedRange]
            : this.state.date;
        if (currentDate) {
            const date = new Date(currentDate);
            date.setMonth(date.getMonth() - 1);
            this.setState({ date });
        }
    }
    onSelectTime(time, mode, commit = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const format = this.props.format;
            const value = this.props.value || new Date();
            const newDate = utils_1.isArray(value)
                ? value.map((d) => utils_1.setDate(d, time.getHours(), time.getMinutes()))
                : utils_1.setDate(value, time.getHours(), time.getMinutes());
            const valueText = utils_1.dateFormat(newDate, format);
            yield this.setStateAsync({ mode, valueText });
            if (commit) {
                this.emitChange(newDate);
            }
        });
    }
    onPaste(text) {
        const date = utils_1.validateDate(text, this.props.format);
        if (date instanceof Date) {
            this.onSelectDay(date);
        }
    }
    onSubmitOrCancelTime(time, mode) {
        if (time) {
            this.onSelectTime(time, mode, true);
        }
        if (this.onToggle) {
            this.onToggle();
        }
    }
    onMobileMenuContainerClick(e) {
        if (e.target instanceof HTMLDivElement &&
            e.target.classList.contains('react-slct-menu')) {
            if (this.onToggle) {
                this.onToggle();
            }
        }
    }
}
exports.ReactTimebomb = ReactTimebomb;
ReactTimebomb.MENU_WIDTH = 320;
/** @internal */
ReactTimebomb.defaultProps = {
    format: 'YYYY-MM-DD'
};
//# sourceMappingURL=index.js.map
});
___scope___.file("menu/index.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu = void 0;
const React = require("react");
const styled_components_1 = require("styled-components");
const button_1 = require("../components/button");
const utils_1 = require("../utils");
const mobile_1 = require("./mobile");
const table_1 = require("./table");
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
    height: 100%;
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
    function onChangeMonth(e) {
        const date = new Date(utils_1.getAttribute(e.currentTarget, 'data-date'));
        setTimeout(() => props.onChangeMonth(date), 0);
    }
    return (React.createElement(MonthsContainer, { mobile: mobile, className: "months" }, monthNames.map((str, i) => {
        const newDate = new Date(date);
        newDate.setMonth(i);
        const enabled = utils_1.isEnabled('month', newDate, props);
        const selected = month === newDate.getMonth() &&
            year === newDate.getFullYear();
        return (React.createElement(button_1.Button, { key: str, tabIndex: -1, className: selected ? 'selected' : undefined, selected: selected, disabled: !enabled, mobile: props.mobile, "data-date": newDate.toISOString(), onClick: onChangeMonth }, str));
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
        setTimeout(() => props.onChangeYear(date), 0);
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
            React.createElement(MobileMenuTable, { date: utils_1.subtractMonths(getDate(props.date, props.selectedRange), 1), minDate: props.minDate, maxDate: props.maxDate, mobile: props.mobile, selectRange: props.selectRange, selectedRange: props.selectedRange, showCalendarWeek: props.showCalendarWeek, showConfirm: props.showConfirm, showTime: props.showTime, value: utils_1.subtractMonths(getDate(props.value, props.selectedRange), 1), onSubmit: props.onSubmit, onSelectDay: props.onSelectDay }),
            React.createElement(MobileMenuTable, { date: props.date, minDate: props.minDate, maxDate: props.maxDate, mobile: props.mobile, selectRange: props.selectRange, selectedRange: props.selectedRange, showCalendarWeek: props.showCalendarWeek, showConfirm: props.showConfirm, showTime: props.showTime, value: props.value, onSubmit: props.onSubmit, onSelectDay: props.onSelectDay }),
            React.createElement(MobileMenuTable, { date: utils_1.addMonths(getDate(props.date, props.selectedRange), 1), minDate: props.minDate, maxDate: props.maxDate, mobile: props.mobile, selectRange: props.selectRange, selectedRange: props.selectedRange, showCalendarWeek: props.showCalendarWeek, showConfirm: props.showConfirm, showTime: props.showTime, value: utils_1.addMonths(getDate(props.value, props.selectedRange), 1), onSubmit: props.onSubmit, onSelectDay: props.onSelectDay })));
    }
    return (React.createElement(table_1.MenuTable, { date: props.date, minDate: props.minDate, maxDate: props.maxDate, mobile: props.mobile, selectRange: props.selectRange, selectedRange: props.selectedRange, showCalendarWeek: props.showCalendarWeek, showConfirm: props.showConfirm, showTime: props.showTime, value: props.value, hoverDate: props.hoverDate, onSubmit: props.onSubmit, onSelectDay: props.onSelectDay, onHoverDays: props.onHoverDays }));
}
function Menu(props) {
    const { mode, mobile, showDate, showConfirm, showTime } = props;
    const ConfirmComponent = props.confirmComponent || MenuConfirm;
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
                return (React.createElement(MonthContainer, null,
                    showDate && React.createElement(MonthWrapper, Object.assign({}, props)),
                    showTime && (React.createElement(time_1.MenuTime, { date: props.date, timeStep: props.timeStep, topDivider: props.showDate, format: props.format, onChange: props.onSelectTime, onSubmit: props.onSubmitTime, onCancel: props.onSubmitTime })),
                    showConfirm && React.createElement(ConfirmComponent, Object.assign({}, props))));
        }
    }
    return null;
}
exports.Menu = Menu;
//# sourceMappingURL=index.js.map
});
___scope___.file("components/button.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrowButton = exports.SmallButton = exports.Button = void 0;
const React = require("react");
const styled_components_1 = require("styled-components");
const StyledButton = styled_components_1.default.button `
    margin-right: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 3px 6px;
    height: 21px;
    line-height: 1;
    box-sizing: border-box;
    background: ${(props) => (props.selected ? '#ccc' : '#fff')};

    ${(props) => props.mobile
    ? styled_components_1.css `
                  font-size: 16px;
                  margin-right: 6px;
                  padding: 6px 12px;
                  height: auto;
                  min-height: 21px;
              `
    : ''}

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
exports.Button = (props) => (React.createElement(StyledButton, Object.assign({ "data-react-timebomb-selectable": true, "data-role": "button", type: "button" }, props)));
exports.SmallButton = styled_components_1.default(exports.Button) `
    font-size: 13px;
    color: #ccc;
    cursor: pointer;
    border: none;

    &:hover:not(:disabled) {
        color: #333;
    }

    &:focus {
        outline: none;
    }
`;
exports.ArrowButton = (props) => (React.createElement(exports.SmallButton, { className: "react-timebomb-arrow", id: props.id, disabled: props.disabled, tabIndex: -1, onClick: props.onClick }, props.open ? '▲' : '▼'));
//# sourceMappingURL=button.js.map
});
___scope___.file("utils.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keys = exports.replaceSpaceWithNbsp = exports.fillZero = exports.isArray = exports.sortDates = exports.isTimeFormat = exports.isDateFormat = exports.isDayFormat = exports.getAttribute = exports.isEnabled = exports.getWeekdayNames = exports.getMonthNames = exports.stringEqual = exports.dateEqual = exports.isBetween = exports.isAfter = exports.isBefore = exports.isToday = exports.isSameDay = exports.setDate = exports.isUndefined = exports.endOfMonth = exports.startOfMonth = exports.manipulateDate = exports.subtractYears = exports.subtractMonths = exports.subtractDays = exports.subtractHours = exports.subtractMinutes = exports.subtractSeconds = exports.addSeconds = exports.addMinutes = exports.addHours = exports.addYears = exports.addMonths = exports.addDays = exports.endOfDay = exports.startOfDay = exports.endOfWeek = exports.startOfWeek = exports.getWeekOfYear = exports.selectElement = exports.clearSelection = exports.joinDates = exports.splitDate = exports.formatNumberRaw = exports.formatNumber = exports.stringFromCharCode = exports.validateFormatType = exports.validateFormatGroup = exports.formatIsActualNumber = exports.getMeridiem = exports.is24HoursFormat = exports.getFormatType = exports.validateDate = exports.dateFormat = exports.formatSplitExpr = void 0;
// @ts-ignore
const moment_1 = require("moment");
const momentImport = require("moment");
const moment = moment_1.default || momentImport;
exports.formatSplitExpr = /[.|:|\-|\\|_|\/|\s]/;
function dateFormat(date, format) {
    if (isArray(date)) {
        return date.map(date => moment(date).format(format));
    }
    else {
        return moment(date).format(format);
    }
}
exports.dateFormat = dateFormat;
function validateDate(date, format) {
    if (isArray(date)) {
        const dates = date
            .map(date => {
            const instance = moment(date, format, true);
            return instance.isValid() ? instance.toDate() : undefined;
        })
            .filter(d => Boolean(d));
        return dates.length === 0 ? undefined : dates;
    }
    else {
        const instance = moment(date, format, true);
        return instance.isValid() ? instance.toDate() : undefined;
    }
}
exports.validateDate = validateDate;
function getFormatType(format) {
    if (/^D/.test(format)) {
        return 'day';
    }
    if (/^M/.test(format)) {
        return 'month';
    }
    if (/^Y/.test(format)) {
        return 'year';
    }
    if (/^h/i.test(format)) {
        return 'hour';
    }
    if (/^m/.test(format)) {
        return 'minute';
    }
    if (/^s/.test(format)) {
        return 'second';
    }
    return undefined;
}
exports.getFormatType = getFormatType;
function is24HoursFormat(format) {
    if (!format) {
        return false;
    }
    return /H|k/.test(format);
}
exports.is24HoursFormat = is24HoursFormat;
function getMeridiem(format) {
    if (!format) {
        return undefined;
    }
    const matcher = format.match(/\s+([aAp])$/);
    if (matcher) {
        return matcher[1];
    }
    return undefined;
}
exports.getMeridiem = getMeridiem;
function formatIsActualNumber(format) {
    // day / year
    if (/D|Y|H|h|m|s/.test(format)) {
        return true;
    }
    // month
    if (format === 'M' || format === 'MM') {
        return true;
    }
    return false;
}
exports.formatIsActualNumber = formatIsActualNumber;
/** @return returns a string with transformed value, true for valid input or false for invalid input */
function validateFormatGroup(input, format) {
    const formatType = getFormatType(format);
    return validateFormatType(input, formatType);
}
exports.validateFormatGroup = validateFormatGroup;
/** @return returns a string with transformed value, true for valid input or false for invalid input */
function validateFormatType(input, formatType) {
    if (isFinite(input)) {
        const int = typeof input === 'string' ? parseInt(input, 10) : input;
        const char = String(input);
        const strLen = char.length;
        switch (formatType) {
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
exports.validateFormatType = validateFormatType;
const ALLOWED_CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
function stringFromCharCode(keyCode) {
    const charCode = keyCode - 48 * Math.floor(keyCode / 48);
    const char = String.fromCharCode(96 <= keyCode ? charCode : keyCode);
    if (ALLOWED_CHARS.includes(char)) {
        return char;
    }
    return '';
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
function formatNumberRaw(number) {
    if (number <= 9) {
        return `0${Number(number) || 0}`;
    }
    return String(number);
}
exports.formatNumberRaw = formatNumberRaw;
function splitDate(date, format) {
    const formattedDate = dateFormat(date, format);
    return formattedDate
        .split(exports.formatSplitExpr)
        .filter(group => group && exports.formatSplitExpr.test(group) === false);
}
exports.splitDate = splitDate;
function joinDates(parts, format) {
    const strParts = parts
        .map(part => (part instanceof HTMLElement ? part.innerText : part))
        .filter(val => val);
    const splittedFormat = format.split(exports.formatSplitExpr);
    if (strParts.length !== splittedFormat.length) {
        return '';
    }
    const date = strParts.join(' ');
    const spaceFormat = splittedFormat.join(' ');
    const momentDate = moment(date, spaceFormat);
    const parsingFlags = momentDate.parsingFlags();
    if (parsingFlags.overflow === 2) {
        return moment(
        // @ts-ignore
        new Date(...parsingFlags.parsedDateParts)).format(format);
    }
    return momentDate.format(format);
}
exports.joinDates = joinDates;
function clearSelection() {
    const sel = getSelection();
    if (sel) {
        if (sel.empty) {
            // Chrome
            sel.empty();
        }
        else if (sel.removeAllRanges) {
            // Firefox
            sel.removeAllRanges();
        }
    }
}
exports.clearSelection = clearSelection;
function selectElement(el, caret) {
    if (el) {
        const range = document.createRange();
        const sel = getSelection();
        if (caret === undefined) {
            range.selectNodeContents(el);
        }
        else {
            const [start, end] = caret;
            range.setStart(el, start);
            range.setEnd(el, end);
        }
        if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
}
exports.selectElement = selectElement;
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
function manipulateDate(date, formatType, direction, timeStep) {
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
                return addMinutes(date, timeStep || 1);
            if (direction === 'subtract')
                return subtractMinutes(date, timeStep || 1);
            break;
        case 'second':
            if (direction === 'add')
                return addSeconds(date, timeStep || 1);
            if (direction === 'subtract')
                return subtractSeconds(date, timeStep || 1);
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
function isSameDay(dateA, dateB) {
    return moment(dateA).isSame(dateB, 'day');
}
exports.isSameDay = isSameDay;
function isToday(date) {
    return moment(date).isSame(new Date(), 'day');
}
exports.isToday = isToday;
function isBefore(date, inp) {
    return moment(date).isBefore(inp, 'day');
}
exports.isBefore = isBefore;
function isAfter(date, inp) {
    return moment(date).isAfter(inp, 'day');
}
exports.isAfter = isAfter;
function isBetween(date, cmpDateA, cmpDateB, context = 'day') {
    return moment(date).isBetween(cmpDateA, cmpDateB, context, '[]');
}
exports.isBetween = isBetween;
function dateEqual(dateA, dateB, considerTime = false) {
    if (!dateA || !dateB) {
        return false;
    }
    if (considerTime) {
        if (isArray(dateA)) {
            dateA = dateA.map(startOfDay);
        }
        else {
            dateA = startOfDay(dateA);
        }
        if (isArray(dateB)) {
            dateB = dateB.map(startOfDay);
        }
        else {
            dateB = startOfDay(dateB);
        }
    }
    if (isArray(dateA) && isArray(dateB)) {
        return dateA.every((date, i) => {
            const dBi = dateB[i];
            if (date && dBi) {
                return date.getTime() === dBi.getTime();
            }
            return false;
        });
    }
    else if (isArray(dateA) && dateB instanceof Date) {
        return dateA.some(d => d.getTime() === dateB.getTime());
    }
    else if (isArray(dateB) && dateA instanceof Date) {
        return dateB.some(d => d.getTime() === dateA.getTime());
    }
    else if (!isArray(dateA) && !isArray(dateB)) {
        return dateA.getTime() === dateB.getTime();
    }
    return false;
}
exports.dateEqual = dateEqual;
function stringEqual(valueA, valueB) {
    if (valueA === valueB) {
        return true;
    }
    if (!valueA || !valueB) {
        return false;
    }
    if (isArray(valueA) && isArray(valueB) && valueA.length === valueB.length) {
        return valueA.every((val, i) => val === valueB[i]);
    }
    return false;
}
exports.stringEqual = stringEqual;
function getMonthNames(short) {
    if (short) {
        return moment.monthsShort();
    }
    return moment.months();
}
exports.getMonthNames = getMonthNames;
function getWeekdayNames() {
    return moment.weekdaysShort();
}
exports.getWeekdayNames = getWeekdayNames;
function isEnabled(context, date, { minDate, maxDate }) {
    if (!minDate && !maxDate) {
        return true;
    }
    if (minDate && !maxDate) {
        return moment(date).isSameOrAfter(minDate, context);
    }
    if (!minDate && maxDate) {
        return moment(date).isSameOrBefore(maxDate, context);
    }
    return isBetween(date, minDate, maxDate, context);
}
exports.isEnabled = isEnabled;
function getAttribute(input, attr) {
    return input.getAttribute(attr);
}
exports.getAttribute = getAttribute;
function isDayFormat(format) {
    return Boolean(/d/i.test(format));
}
exports.isDayFormat = isDayFormat;
function isDateFormat(format) {
    return Boolean(/D|M|Y/.test(format));
}
exports.isDateFormat = isDateFormat;
function isTimeFormat(format) {
    return Boolean(/H|h|m|k|a|S|s/.test(format));
}
exports.isTimeFormat = isTimeFormat;
function sortDates(a, b) {
    return a.getTime() - b.getTime();
}
exports.sortDates = sortDates;
function isArray(val) {
    return Array.isArray(val);
}
exports.isArray = isArray;
function fillZero(value, formatType) {
    value = String(value);
    switch (formatType) {
        case 'day':
            if (value === '1' || value === '2' || value === '3') {
                return `0${value}`;
            }
            break;
        case 'month':
            if (value === '1') {
                return `0${value}`;
            }
            break;
    }
    return undefined;
}
exports.fillZero = fillZero;
function replaceSpaceWithNbsp(str) {
    if (!str) {
        return str;
    }
    return str.replace(/ /g, ' ');
}
exports.replaceSpaceWithNbsp = replaceSpaceWithNbsp;
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
    DOT: 190,
    COMMA: 188
};
//# sourceMappingURL=react-timebomb.js.map?tm=1597301931744
});
___scope___.file("menu/mobile.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GestureWrapper = void 0;
const React = require("react");
const react_with_gesture_1 = require("react-with-gesture");
const styled_components_1 = require("styled-components");
const MobileMenuTableWrapper = styled_components_1.default.div `
    display: flex;
    width: 300%;
    position: relative;
    left: -100%;
    transition: ${(props) => props.animate ? 'transform 0.15s ease-out' : 'none'};
`;
let GestureWrapper = class GestureWrapper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidUpdate(prevProps) {
        const props = this.props;
        const { allowNext, allowPrev, down } = props;
        if (prevProps.down && !down) {
            const [xDir] = props.direction;
            let x = '';
            let direction;
            if (xDir > 0) {
                x = '33.3%';
                direction = 'prev';
            }
            else if (xDir < 0) {
                x = '-33.3%';
                direction = 'next';
            }
            if (x && direction) {
                if ((direction === 'next' && !allowNext) ||
                    (direction === 'prev' && !allowPrev)) {
                    return;
                }
                this.setState({ x, cooldown: true }, () => {
                    setTimeout(() => {
                        this.setState({ x: undefined }, () => {
                            this.props.onChangeMonth(direction);
                            this.setState({ cooldown: false });
                        });
                    }, 167);
                });
            }
        }
    }
    render() {
        const props = this.props;
        const { x, cooldown } = this.state;
        let [deltaX] = props.delta;
        if (!this.props.allowNext && deltaX < 0) {
            deltaX = 0;
        }
        if (!this.props.allowPrev && deltaX > 0) {
            deltaX = 0;
        }
        let translateX = x || `${props.down ? deltaX : 0}px`;
        if (cooldown && props.cancel) {
            props.cancel();
        }
        return (React.createElement(MobileMenuTableWrapper, { animate: Boolean(x), style: { transform: `translateX(${translateX})` } }, props.children));
    }
};
GestureWrapper = __decorate([
    react_with_gesture_1.withGesture({ mouse: false }),
    __metadata("design:paramtypes", [Object])
], GestureWrapper);
exports.GestureWrapper = GestureWrapper;
//# sourceMappingURL=mobile.js.map
});
___scope___.file("menu/table.jsx", function(exports, require, module, __filename, __dirname){

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
});
___scope___.file("menu/day.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeekNum = exports.Day = void 0;
const React = require("react");
const styled_components_1 = require("styled-components");
const utils_1 = require("../utils");
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
    background-color: transparent;
    pointer-events: ${(props) => props.disabled ? 'none' : 'auto'};
    user-select: none;
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
    return (React.createElement(StyledDay, { className: getClassNames(), current: current, disabled: !enabled, onClick: onSelectDay, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave }, day.getDate()));
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
});
___scope___.file("menu/time.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuTime = void 0;
const React = require("react");
const styled_components_1 = require("styled-components");
const utils_1 = require("../utils");
const number_input_1 = require("../components/number-input");
const Container = styled_components_1.default.div `
    padding: 0;
    display: flex;
    align-items: center;
    margin: 0 auto;
    width: 100%;
    border-top: ${(props) => props.topDivider ? '1px solid #ccc' : 'none'};

    &:not(:last-child) {
        border-bottom: 1px solid #ccc;
    }
`;
const Divider = styled_components_1.default.span `
    margin: 0 5px;
    font-weight: bold;
`;
const Meridiem = styled_components_1.default.span `
    margin: 0 10px;
`;
function MenuTime(props) {
    const { date, timeStep, topDivider, onChange, onSubmit, onCancel } = props;
    const meridiem = utils_1.getMeridiem(props.format);
    if (utils_1.isArray(date) || !date) {
        return null;
    }
    return (React.createElement(Container, { topDivider: topDivider, className: "react-timebomb-time" },
        React.createElement(number_input_1.NumberInput, { date: date, step: 1, mode: "hour", mode24Hours: utils_1.is24HoursFormat(props.format), onChange: onChange, onSubmit: onSubmit, onCancel: onCancel }),
        React.createElement(Divider, { className: "divider" }, ":"),
        React.createElement(number_input_1.NumberInput, { date: date, step: timeStep, mode: "minute", onChange: onChange, onSubmit: onSubmit, onCancel: onCancel }),
        meridiem && (React.createElement(Meridiem, { className: "meridiem" }, utils_1.dateFormat(date, meridiem)))));
}
exports.MenuTime = MenuTime;
//# sourceMappingURL=time.js.map
});
___scope___.file("components/number-input.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberInput = void 0;
const React = require("react");
const styled_components_1 = require("styled-components");
const utils_1 = require("../utils");
const Steps = styled_components_1.default.div `
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 0;
    top: 0;
    width: 24px;
    height: 100%;
    border-width: 0 1px;
    border-style: solid;
    border-color: #ccc;
    visibility: hidden;
`;
const Step = styled_components_1.default.button `
    margin: 0;
    padding: 0;
    line-height: 1;
    border: none;
    flex: 1;
    font-size: 8px;
    color: #ccc;
    cursor: pointer;
    -webkit-appearance: none;

    &:focus {
        outline: none;
    }

    &:hover {
        background: #eee;
        color: #000;
    }
`;
const InputContainer = styled_components_1.default.div `
    position: relative;
    flex: 1;
    display: flex;

    &:hover {
        ${Steps} {
            visibility: visible;
        }
    }

    &:last-child {
        ${Steps} {
            border-right: none;
        }
    }
`;
const Input = styled_components_1.default.input `
    flex: 1;
    padding: 0 25px 0 6px;
    margin: 0;
    width: 50%;
    min-height: 32px;
    text-align: center;
    border: none;

    // @see https://stackoverflow.com/a/4298216/1138860
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        /* display: none; <- Crashes Chrome on hover */
        -webkit-appearance: none;
        margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
    }

    &:focus {
        outline: none;
    }

    &:focus {
        background: #eee;

        + ${Steps} {
            visibility: visible;
        }
    }
`;
function NumberInput(props) {
    const { date, step, mode, mode24Hours, onCancel, onSubmit } = props;
    const ref = React.useRef(null);
    const [focused, setFocused] = React.useState(false);
    const [value, setValue] = React.useState(getDateValue(date));
    React.useEffect(() => {
        setValue(getDateValue(props.date));
    }, [date.getTime()]);
    React.useEffect(() => {
        if (value && focused) {
            const newDate = new Date(date);
            props.onChange(newDate, mode);
        }
    }, [value]);
    function getDateValue(date) {
        switch (mode) {
            case 'hour':
                return utils_1.dateFormat(date, mode24Hours ? 'H' : 'h');
            case 'minute':
                return date.getMinutes();
        }
        return 0;
    }
    function getRenderedValue() {
        if (focused) {
            return value;
        }
        else {
            return isFinite(value) ? utils_1.formatNumberRaw(value) : '';
        }
    }
    function onFocusIn() {
        setFocused(true);
    }
    function onFocusOut() {
        if (document.querySelector(':focus') !== ref.current) {
            setFocused(false);
        }
    }
    function onChange(e) {
        const { value } = e.currentTarget;
        if (value.length > 2) {
            e.preventDefault();
            return;
        }
        if (value === '') {
            setValue(value);
        }
        else if (date) {
            const newDate = new Date(date);
            setValue(getDateValue(newDate));
        }
    }
    function onStepUp() {
        if (date) {
            const newDate = (() => {
                switch (mode) {
                    case 'hour':
                        return utils_1.addHours(date, 1);
                    case 'minute':
                        return utils_1.addMinutes(date, step);
                }
                return undefined;
            })();
            if (newDate) {
                props.onChange(newDate, mode);
            }
        }
    }
    function onStepDown() {
        if (date) {
            const newDate = (() => {
                switch (mode) {
                    case 'hour':
                        return utils_1.subtractHours(date, 1);
                    case 'minute':
                        return utils_1.subtractMinutes(date, step);
                }
                return undefined;
            })();
            if (newDate) {
                props.onChange(newDate, mode);
            }
        }
    }
    function onKeyUp(e) {
        switch (e.keyCode) {
            case utils_1.keys.ENTER:
                onSubmit(date, mode);
                break;
            case utils_1.keys.ESC:
                onCancel(undefined, mode);
                break;
        }
    }
    return (React.createElement(InputContainer, { className: `react-timebomb-number-input ${mode}`, onMouseEnter: onFocusIn, onMouseLeave: onFocusOut },
        React.createElement(Input, { "data-react-timebomb-selectable": true, type: "number", ref: ref, step: step, value: getRenderedValue(), onChange: onChange, onFocus: onFocusIn, onBlur: onFocusOut, onKeyUp: onKeyUp }),
        React.createElement(Steps, null,
            React.createElement(Step, { "data-react-timebomb-selectable": true, tabIndex: -1, onClick: onStepUp }, "\u25B2"),
            React.createElement(Step, { "data-react-timebomb-selectable": true, tabIndex: -1, onClick: onStepDown }, "\u25BC"))));
}
exports.NumberInput = NumberInput;
//# sourceMappingURL=number-input.js.map
});
___scope___.file("menu/title.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuTitle = void 0;
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
});
___scope___.file("value/value.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Value = exports.DefaultClearComponent = exports.Icon = exports.Placeholder = exports.ClearButton = exports.Container = exports.Flex = void 0;
const React = require("react");
const styled_components_1 = require("styled-components");
const button_1 = require("../components/button");
const utils_1 = require("../utils");
exports.Flex = styled_components_1.default.div `
    display: flex;
    align-items: center;
    white-space: nowrap;
    position: relative;
    line-height: 1;
`;
exports.Container = styled_components_1.default(exports.Flex) `
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    border: 1px solid #ccc;
    cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};
    width: 100%;
    height: 100%;
    box-sizing: border-box;
`;
const Input = styled_components_1.default.span `
    padding: 2px 0 2px 0;
    min-width: 1px;
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'text')};
    pointer-events: ${(props) => props.disabled ? 'none' : 'auto'};

    &:focus {
        outline: none;
    }

    &:last-of-type {
        padding: 2px 10px 2px 0;
    }

    &:not(:last-of-type):after {
        content: attr(data-separator);
        min-width: 4px;
        display: inline-block;
    }

    &:empty:before {
        content: attr(data-placeholder);
        color: #aaa;
    }

    &:empty:not(:last-of-type):after {
        color: #aaa;
    }

    &:not([contenteditable='true']) {
        user-select: none;
    }
`;
exports.ClearButton = styled_components_1.default(button_1.SmallButton) `
    font-size: 18px;
`;
const ClearButtonX = styled_components_1.default.span `
    position: relative;
    left: -1px;
    top: -2px;
`;
exports.Placeholder = styled_components_1.default.span `
    color: #aaa;
    user-select: none;
`;
exports.Icon = styled_components_1.default.span `
    margin-right: 5px;
    user-select: none;

    &:after {
        content: '${(props) => props.icon}';
    }
`;
const DefaultIcon = (props) => {
    function getIconClass() {
        const { showTime, showDate } = props;
        if (!showDate && showTime) {
            return 'time';
        }
        return 'calendar';
    }
    function getIcon() {
        switch (getIconClass()) {
            case 'calendar':
                return '📅';
            case 'time':
                return '⏱';
            default:
                return '';
        }
    }
    return (React.createElement(exports.Icon, { icon: getIcon(), className: `react-timebomb-icon ${getIconClass()}` }));
};
exports.DefaultClearComponent = (props) => (React.createElement(exports.ClearButton, { className: "react-timebomb-clearer", tabIndex: -1, disabled: props.disabled, onClick: props.onClick },
    React.createElement(ClearButtonX, null, "\u00D7")));
const META_KEYS = [utils_1.keys.BACKSPACE, utils_1.keys.DELETE, utils_1.keys.TAB];
const FORBIDDEN_KEYS = [
    utils_1.keys.SHIFT,
    utils_1.keys.ARROW_LEFT,
    utils_1.keys.ARROW_RIGHT,
    utils_1.keys.ARROW_UP,
    utils_1.keys.ARROW_DOWN,
    utils_1.keys.TAB
];
class ValueComponent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.inputs = [];
        this.mounted = false;
        this.onFocus = (() => {
            let timeout = 0;
            return (e) => {
                clearTimeout(timeout);
                const input = e.currentTarget;
                utils_1.selectElement(input);
                timeout = setTimeout(() => {
                    if (!this.state.allSelected && this.mounted) {
                        const formatGroup = utils_1.getAttribute(input, 'data-group');
                        this.props.onChangeFormatGroup(formatGroup);
                    }
                }, 16);
            };
        })();
        this.state = {};
        this.onSearchRef = this.onSearchRef.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onDblClick = this.onDblClick.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onPaste = this.onPaste.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }
    get formatGroups() {
        return this.props.format.split('').reduce((memo, char) => {
            const prevChar = memo[memo.length - 1];
            if ((prevChar && char === prevChar.substr(0, 1)) ||
                (utils_1.formatSplitExpr.test(prevChar) && utils_1.formatSplitExpr.test(char))) {
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
    get firstInput() {
        const formatParts = this.props
            .format.split(utils_1.formatSplitExpr)
            .filter(s => Boolean(s));
        const i = formatParts.findIndex(utils_1.isDayFormat);
        return this.inputs[i === -1 ? 0 : i];
    }
    componentDidUpdate(prevProps) {
        setTimeout(() => {
            if (!this.mounted) {
                return;
            }
            const { open, value, format, mode, allowValidation } = this.props;
            const hasFocus = this.inputs.some(inp => inp === this.focused);
            const allowTextSelection = mode === 'day' || mode === 'month' || mode === 'year';
            if (!hasFocus) {
                if (open) {
                    const { firstInput } = this;
                    if (prevProps.value !== value && value) {
                        const parts = utils_1.splitDate(value, format);
                        this.inputs.forEach((input, i) => (input.innerText = parts[i]));
                        if (firstInput && allowTextSelection) {
                            firstInput.focus();
                        }
                    }
                    if (allowTextSelection) {
                        if (!prevProps.open || value !== prevProps.value) {
                            if (firstInput) {
                                utils_1.selectElement(firstInput);
                            }
                        }
                    }
                }
            }
            if (open &&
                prevProps.mode !== mode &&
                !this.state.allSelected &&
                allowTextSelection) {
                const input = this.inputs.find(el => {
                    const format = utils_1.getAttribute(el, 'data-group');
                    const type = utils_1.getFormatType(format);
                    return type === mode;
                });
                utils_1.selectElement(input);
            }
            if (!open && value) {
                const parts = utils_1.splitDate(value, format);
                this.inputs.forEach((input, i) => (input.innerText = parts[i]));
            }
            if (open && prevProps.value && !value && !allowValidation) {
                this.inputs.forEach(input => (input.innerText = ''));
            }
            if (!open) {
                this.setState({ allSelected: false });
            }
        }, 16);
    }
    componentDidMount() {
        this.mounted = true;
        if (this.props.value) {
            this.forceUpdate();
        }
    }
    componentWillUnmount() {
        this.mounted = false;
    }
    render() {
        const { placeholder, value, showDate, showTime, disabled, arrowButtonId, iconComponent, open } = this.props;
        const ArrowButtonComp = this.props.arrowButtonComponent || button_1.ArrowButton;
        const ClearComponent = this.props.clearComponent || exports.DefaultClearComponent;
        const showPlaceholder = placeholder && !open;
        const showClearer = value && !disabled;
        const timeOnly = showTime && !showDate;
        const IconComponent = iconComponent !== undefined ? iconComponent : DefaultIcon;
        return (React.createElement(exports.Container, { "data-role": "value", className: "react-slct-value react-timebomb-value", ref: this.props.innerRef, disabled: disabled, onClick: this.onToggle },
            React.createElement(exports.Flex, null,
                IconComponent && (React.createElement(IconComponent, { showDate: showDate, showTime: showTime })),
                React.createElement(exports.Flex, null,
                    this.renderValue(),
                    showPlaceholder && (React.createElement(exports.Placeholder, { className: "react-timebomb-placeholder" }, placeholder)))),
            React.createElement(exports.Flex, null,
                showClearer && (React.createElement(ClearComponent, { disabled: disabled, onClick: this.onClear })),
                !timeOnly && (React.createElement(ArrowButtonComp, { id: arrowButtonId, disabled: disabled, open: open })))));
    }
    renderValue() {
        const { open, disabled, mobile, value } = this.props;
        const LabelComponent = this.props.labelComponent;
        const contentEditable = !disabled && !mobile;
        if (!open && !value) {
            return null;
        }
        if (LabelComponent) {
            return React.createElement(LabelComponent, Object.assign({}, this.props));
        }
        const formatGroups = this.formatGroups;
        return (React.createElement(exports.Flex, null, formatGroups.map((group, i) => {
            if (group.split('').some(g => utils_1.formatSplitExpr.test(g))) {
                return null;
            }
            else {
                const separator = formatGroups[i + 1];
                const hasFormatType = Boolean(utils_1.getFormatType(group));
                const placeholder = hasFormatType ? group : undefined;
                return (React.createElement(Input, { "data-react-timebomb-selectable": true, contentEditable: contentEditable, disabled: disabled || !hasFormatType, "data-placeholder": placeholder, "data-separator": utils_1.replaceSpaceWithNbsp(separator), key: group, "data-group": group, ref: this.onSearchRef, onKeyDown: this.onKeyDown, onKeyUp: this.onKeyUp, onFocus: this.onFocus, onBlur: this.onBlur, onClick: this.onClick, onDoubleClick: this.onDblClick, onChange: this.onChange, onPaste: this.onPaste }));
            }
        })));
    }
    onSearchRef(el) {
        if (el) {
            this.inputs.push(el);
        }
        else {
            this.inputs = [];
        }
    }
    onKeyDown(e) {
        const { onChangeValueText, format, value, allowValidation, timeStep } = this.props;
        const input = e.currentTarget;
        const { innerText, nextSibling, previousSibling } = input;
        const formatGroup = utils_1.getAttribute(input, 'data-group');
        const numericFormat = utils_1.formatIsActualNumber(formatGroup);
        const sel = getSelection();
        const hasSelection = sel
            ? Boolean(sel.focusOffset - sel.anchorOffset)
            : false;
        let numericValue = parseInt(innerText, 10);
        switch (e.keyCode) {
            case utils_1.keys.ENTER:
            case utils_1.keys.ESC:
            case utils_1.keys.BACKSPACE:
            case utils_1.keys.DOT:
            case utils_1.keys.COMMA:
                e.preventDefault();
                return;
            case utils_1.keys.ARROW_RIGHT:
                e.preventDefault();
                if (nextSibling instanceof HTMLSpanElement) {
                    nextSibling.focus();
                }
                else {
                    utils_1.selectElement(input);
                }
                return;
            case utils_1.keys.ARROW_LEFT:
                e.preventDefault();
                if (previousSibling instanceof HTMLSpanElement) {
                    previousSibling.focus();
                }
                else {
                    utils_1.selectElement(input);
                }
                return;
            case utils_1.keys.ARROW_UP:
            case utils_1.keys.ARROW_DOWN:
                e.preventDefault();
                if (!numericFormat) {
                    return;
                }
                const isArrowUp = e.keyCode === utils_1.keys.ARROW_UP;
                if (isNaN(numericValue)) {
                    numericValue = 0;
                }
                if (isFinite(numericValue)) {
                    const formatType = utils_1.getFormatType(formatGroup);
                    if (!allowValidation) {
                        const add = formatType === 'minute' ? timeStep || 1 : 1;
                        const nextValue = numericValue + (isArrowUp ? add : -add);
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
                            const newDate = utils_1.manipulateDate(value, formatType, direction, timeStep);
                            const enabled = utils_1.isEnabled('day', newDate, this.props);
                            if (enabled) {
                                const dateParts = utils_1.splitDate(newDate, format);
                                this.inputs.map((inp, i) => (inp.innerText = dateParts[i]));
                            }
                        }
                    }
                    utils_1.selectElement(input);
                    onChangeValueText(utils_1.joinDates(this.inputs, format));
                }
                return;
        }
        const char = utils_1.stringFromCharCode(e.keyCode);
        const groupValue = innerText && !hasSelection ? innerText + char : char;
        if (META_KEYS.includes(e.keyCode) || e.metaKey || e.ctrlKey) {
            return;
        }
        if (!numericFormat) {
            e.preventDefault();
            return;
        }
        const valid = utils_1.validateFormatGroup(groupValue, formatGroup);
        if (!valid) {
            e.preventDefault();
        }
        else if (typeof valid === 'string') {
            e.preventDefault();
            input.innerText = valid;
        }
        if (this.state.allSelected &&
            e.keyCode !== utils_1.keys.BACKSPACE &&
            e.keyCode !== utils_1.keys.DELETE) {
            const [firstInput] = this.inputs;
            let validatedChar = utils_1.validateFormatGroup(char, formatGroup);
            if (validatedChar && validatedChar === true) {
                validatedChar = char;
            }
            if (validatedChar) {
                e.preventDefault();
                this.inputs.forEach((el, i) => i !== 0 && (el.innerText = ''));
                if (validatedChar.length === 2) {
                    utils_1.selectElement(firstInput);
                }
                else {
                    utils_1.clearSelection();
                    firstInput.innerText = validatedChar;
                    firstInput.focus();
                    utils_1.selectElement(firstInput, [1, 1]);
                }
            }
        }
        // validate group
        if (!hasSelection && innerText.length >= formatGroup.length) {
            e.preventDefault();
        }
    }
    onKeyUp(e) {
        const { onChangeValueText, format, onSubmit, onToggle } = this.props;
        const input = e.currentTarget;
        const { innerText, nextSibling, previousSibling } = input;
        const dataGroup = utils_1.getAttribute(input, 'data-group');
        if (e.keyCode === utils_1.keys.ENTER) {
            e.preventDefault();
            if (this.focused) {
                this.focused.blur();
            }
            onSubmit();
            return;
        }
        if (e.keyCode === utils_1.keys.ESC && onToggle) {
            onToggle();
            return;
        }
        if (this.state.allSelected) {
            if (e.keyCode === utils_1.keys.BACKSPACE || e.keyCode === utils_1.keys.DELETE) {
                // delete all
                this.inputs.forEach(el => (el.innerText = ''));
                utils_1.selectElement(this.inputs[0]);
            }
            this.setState({ allSelected: false });
        }
        // remove text / focus prev
        else if (e.keyCode === utils_1.keys.BACKSPACE) {
            if (innerText) {
                input.innerText = '';
            }
            else if (previousSibling instanceof HTMLSpanElement) {
                utils_1.selectElement(previousSibling);
            }
        }
        // focus next
        else if ((innerText.length >= dataGroup.length &&
            !FORBIDDEN_KEYS.includes(e.keyCode)) ||
            e.keyCode === utils_1.keys.DOT ||
            e.keyCode === utils_1.keys.COMMA) {
            if ((e.keyCode === utils_1.keys.DOT || e.keyCode === utils_1.keys.COMMA) &&
                innerText.length < dataGroup.length) {
                const formatType = utils_1.getFormatType(dataGroup);
                if (!utils_1.validateFormatType(innerText, formatType)) {
                    return;
                }
            }
            if (!nextSibling) {
                utils_1.selectElement(input);
            }
            else if (nextSibling instanceof HTMLSpanElement) {
                utils_1.selectElement(nextSibling);
            }
            onChangeValueText(utils_1.joinDates(this.inputs, format));
        }
    }
    onClick(e) {
        utils_1.selectElement(e.currentTarget);
    }
    onDblClick(e) {
        const input = e.currentTarget;
        if (input.parentNode && this.inputs.some(el => Boolean(el.innerText))) {
            utils_1.selectElement(this.inputs[0]);
            utils_1.selectElement(input.parentNode);
            this.setState({ allSelected: true }, this.props.onAllSelect);
        }
    }
    onBlur(e) {
        if (!this.state.allSelected) {
            const input = e.target;
            const value = input.innerText;
            const dataGroup = utils_1.getAttribute(input, 'data-group');
            const formatType = utils_1.getFormatType(dataGroup);
            if (formatType) {
                const filledValue = utils_1.fillZero(value, formatType);
                if (filledValue) {
                    input.innerText = filledValue;
                }
            }
        }
        // check if timebomb is still focused
        setTimeout(() => {
            const { focused } = this;
            if (this.mounted &&
                this.props.onToggle &&
                this.props.open &&
                focused &&
                !utils_1.getAttribute(focused, 'data-react-timebomb-selectable')) {
                this.props.onToggle();
            }
        }, 0);
    }
    onChange(e) {
        const { format, onChangeValueText } = this.props;
        const input = e.currentTarget;
        const { innerText, nextSibling } = input;
        onChangeValueText(utils_1.joinDates(this.inputs, format));
        if (innerText.length >= utils_1.getAttribute(input, 'data-group').length) {
            if (nextSibling instanceof HTMLSpanElement) {
                nextSibling.focus();
            }
        }
    }
    onPaste(e) {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        if (text) {
            this.props.onPaste(text);
            if (e.target instanceof HTMLSpanElement) {
                e.target.blur();
            }
        }
    }
    onClear(e) {
        e.stopPropagation();
        this.props.onClear();
    }
    onToggle(e) {
        const { open, disabled, onToggle } = this.props;
        if (disabled) {
            return;
        }
        if (onToggle) {
            if (!this.inputs.some(inp => inp === e.target) || !open) {
                onToggle();
            }
        }
    }
}
exports.Value = React.forwardRef((props, ref) => (React.createElement(ValueComponent, Object.assign({ innerRef: ref }, props))));
//# sourceMappingURL=value.js.map
});
___scope___.file("value/value-multi.jsx", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueMulti = void 0;
const React = require("react");
const styled_components_1 = require("styled-components");
const button_1 = require("../components/button");
const utils_1 = require("../utils");
const value_1 = require("./value");
const DefaultIcon = () => React.createElement(value_1.Icon, { className: "react-timebomb-icon", icon: "\uD83D\uDCC5" });
const StyledValue = styled_components_1.default(Value) `
    > span:after {
        content: ' – ';
    }

    > span:last-child:after {
        content: '';
    }
`;
const HoverSpan = styled_components_1.default.span `
    opacity: 0.5;
`;
function Value(props) {
    const { value, className } = props;
    const LabelComponent = props.labelComponent;
    const onClickDate = (e) => {
        if (props.selectRange === true) {
            const { currentTarget } = e;
            setTimeout(() => {
                const date = new Date(currentTarget.getAttribute('data-date') || 0);
                const index = parseInt(currentTarget.getAttribute('data-index') || '0', 10);
                props.onValueSelect(date, index);
            }, 0);
        }
        else if (props.onToggle) {
            props.onToggle();
        }
    };
    const content = (() => {
        if (!value) {
            return null;
        }
        if (LabelComponent) {
            return React.createElement(LabelComponent, Object.assign({}, props));
        }
        if (value.length === 1) {
            return React.createElement("span", null, utils_1.dateFormat(value[0], props.format));
        }
        return (React.createElement(React.Fragment, null, value.map((d, i) => {
            const str = utils_1.dateFormat(d, props.format);
            if (utils_1.dateEqual(d, props.hoverDate)) {
                return (React.createElement(HoverSpan, { key: i, onClick: props.onToggle }, str));
            }
            else {
                return (React.createElement("span", { key: i, "data-index": i, "data-date": d.toDateString(), onClick: onClickDate }, str));
            }
        })));
    })();
    return React.createElement("div", { className: className }, content);
}
exports.ValueMulti = React.forwardRef((props, ref) => {
    const { placeholder, value, open, disabled, arrowButtonId, iconComponent, onToggle } = props;
    const ArrowButtonComp = props.arrowButtonComponent || button_1.ArrowButton;
    const ClearComponent = props.clearComponent || value_1.DefaultClearComponent;
    const showPlaceholder = placeholder && !value;
    const IconComponent = iconComponent !== undefined ? iconComponent : DefaultIcon;
    React.useEffect(() => {
        document.body.addEventListener('keyup', onKeyUp);
        return () => {
            document.body.removeEventListener('keyup', onKeyUp);
        };
    }, []);
    function onClear(e) {
        e.stopPropagation();
        props.onClear();
    }
    function onKeyUp(e) {
        switch (e.keyCode) {
            case utils_1.keys.ESC:
                if (open && onToggle) {
                    onToggle();
                }
                break;
        }
    }
    return (React.createElement(value_1.Container, { "data-role": "value", className: "react-slct-value react-timebomb-value", disabled: disabled, ref: ref, onClick: value || disabled ? undefined : onToggle },
        React.createElement(value_1.Flex, null,
            IconComponent && React.createElement(IconComponent, null),
            React.createElement(value_1.Flex, null,
                React.createElement(StyledValue, Object.assign({}, props)),
                showPlaceholder && (React.createElement(value_1.Placeholder, { className: "react-timebomb-placeholder" }, placeholder)))),
        React.createElement(value_1.Flex, null,
            value && (React.createElement(ClearComponent, { disabled: disabled, onClick: onClear })),
            React.createElement(ArrowButtonComp, { id: arrowButtonId, disabled: disabled, open: open, onClick: disabled ? undefined : onToggle }))));
});
//# sourceMappingURL=value-multi.js.map
});
___scope___.file("typings.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactTimebombArrowButtonProps = void 0;
const button_1 = require("./components/button");
Object.defineProperty(exports, "ReactTimebombArrowButtonProps", { enumerable: true, get: function () { return button_1.ArrowButtonProps; } });
//# sourceMappingURL=react-timebomb.js.map?tm=1597301931744
});
return ___scope___.entry = "index.jsx";
});

FuseBox.import("default/index.jsx");
FuseBox.main("default/index.jsx");
})
(function(e){function r(e){var r=e.charCodeAt(0),n=e.charCodeAt(1);if((m||58!==n)&&(r>=97&&r<=122||64===r)){if(64===r){var t=e.split("/"),i=t.splice(2,t.length).join("/");return[t[0]+"/"+t[1],i||void 0]}var o=e.indexOf("/");if(o===-1)return[e];var a=e.substring(0,o),f=e.substring(o+1);return[a,f]}}function n(e){return e.substring(0,e.lastIndexOf("/"))||"./"}function t(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var o=[],t=0,i=n.length;t<i;t++){var a=n[t];a&&"."!==a&&(".."===a?o.pop():o.push(a))}return""===n[0]&&o.unshift(""),o.join("/")||(o.length?"/":".")}function i(e){var r=e.match(/\.(\w{1,})$/);return r&&r[1]?e:e+".js"}function o(e){if(m){var r,n=document,t=n.getElementsByTagName("head")[0];/\.css$/.test(e)?(r=n.createElement("link"),r.rel="stylesheet",r.type="text/css",r.href=e):(r=n.createElement("script"),r.type="text/javascript",r.src=e,r.async=!0),t.insertBefore(r,t.firstChild)}}function a(e,r){for(var n in e)e.hasOwnProperty(n)&&r(n,e[n])}function f(e){return{server:require(e)}}function u(e,n){var o=n.path||"./",a=n.pkg||"default",u=r(e);if(u&&(o="./",a=u[0],n.v&&n.v[a]&&(a=a+"@"+n.v[a]),e=u[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),o="./";else if(!m&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return f(e);var s=x[a];if(!s){if(m&&"electron"!==_.target)throw"Package not found "+a;return f(a+(e?"/"+e:""))}e=e?e:"./"+s.s.entry;var l,d=t(o,e),c=i(d),p=s.f[c];return!p&&c.indexOf("*")>-1&&(l=c),p||l||(c=t(d,"/","index.js"),p=s.f[c],p||"."!==d||(c=s.s&&s.s.entry||"index.js",p=s.f[c]),p||(c=d+".js",p=s.f[c]),p||(p=s.f[d+".jsx"]),p||(c=d+"/index.jsx",p=s.f[c])),{file:p,wildcard:l,pkgName:a,versions:s.v,filePath:d,validPath:c}}function s(e,r,n){if(void 0===n&&(n={}),!m)return r(/\.(js|json)$/.test(e)?h.require(e):"");if(n&&n.ajaxed===e)return console.error(e,"does not provide a module");var i=new XMLHttpRequest;i.onreadystatechange=function(){if(4==i.readyState)if(200==i.status){var n=i.getResponseHeader("Content-Type"),o=i.responseText;/json/.test(n)?o="module.exports = "+o:/javascript/.test(n)||(o="module.exports = "+JSON.stringify(o));var a=t("./",e);_.dynamic(a,o),r(_.import(e,{ajaxed:e}))}else console.error(e,"not found on request"),r(void 0)},i.open("GET",e,!0),i.send()}function l(e,r){var n=y[e];if(n)for(var t in n){var i=n[t].apply(null,r);if(i===!1)return!1}}function d(e){if(null!==e&&["function","object","array"].indexOf(typeof e)!==-1&&!e.hasOwnProperty("default"))return Object.isFrozen(e)?void(e.default=e):void Object.defineProperty(e,"default",{value:e,writable:!0,enumerable:!1})}function c(e,r){if(void 0===r&&(r={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return o(e);var t=u(e,r);if(t.server)return t.server;var i=t.file;if(t.wildcard){var a=new RegExp(t.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@@/g,".*").replace(/@/g,"[a-z0-9$_-]+"),"i"),f=x[t.pkgName];if(f){var p={};for(var v in f.f)a.test(v)&&(p[v]=c(t.pkgName+"/"+v));return p}}if(!i){var g="function"==typeof r,y=l("async",[e,r]);if(y===!1)return;return s(e,function(e){return g?r(e):null},r)}var w=t.pkgName;if(i.locals&&i.locals.module)return i.locals.module.exports;var b=i.locals={},j=n(t.validPath);b.exports={},b.module={exports:b.exports},b.require=function(e,r){var n=c(e,{pkg:w,path:j,v:t.versions});return _.sdep&&d(n),n},m||!h.require.main?b.require.main={filename:"./",paths:[]}:b.require.main=h.require.main;var k=[b.module.exports,b.require,b.module,t.validPath,j,w];return l("before-import",k),i.fn.apply(k[0],k),l("after-import",k),b.module.exports}if(e.FuseBox)return e.FuseBox;var p="undefined"!=typeof ServiceWorkerGlobalScope,v="undefined"!=typeof WorkerGlobalScope,m="undefined"!=typeof window&&"undefined"!=typeof window.navigator||v||p,h=m?v||p?{}:window:global;m&&(h.global=v||p?{}:window),e=m&&"undefined"==typeof __fbx__dnm__?e:module.exports;var g=m?v||p?{}:window.__fsbx__=window.__fsbx__||{}:h.$fsbx=h.$fsbx||{};m||(h.require=require);var x=g.p=g.p||{},y=g.e=g.e||{},_=function(){function r(){}return r.global=function(e,r){return void 0===r?h[e]:void(h[e]=r)},r.import=function(e,r){return c(e,r)},r.on=function(e,r){y[e]=y[e]||[],y[e].push(r)},r.exists=function(e){try{var r=u(e,{});return void 0!==r.file}catch(e){return!1}},r.remove=function(e){var r=u(e,{}),n=x[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},r.main=function(e){return this.mainFile=e,r.import(e,{})},r.expose=function(r){var n=function(n){var t=r[n].alias,i=c(r[n].pkg);"*"===t?a(i,function(r,n){return e[r]=n}):"object"==typeof t?a(t,function(r,n){return e[n]=i[r]}):e[t]=i};for(var t in r)n(t)},r.dynamic=function(r,n,t){this.pkg(t&&t.pkg||"default",{},function(t){t.file(r,function(r,t,i,o,a){var f=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);f(!0,r,t,i,o,a,e)})})},r.flush=function(e){var r=x.default;for(var n in r.f)e&&!e(n)||delete r.f[n].locals},r.pkg=function(e,r,n){if(x[e])return n(x[e].s);var t=x[e]={};return t.f={},t.v=r,t.s={file:function(e,r){return t.f[e]={fn:r}}},n(t.s)},r.addPlugin=function(e){this.plugins.push(e)},r.packages=x,r.isBrowser=m,r.isServer=!m,r.plugins=[],r}();return m||(h.FuseBox=_),e.FuseBox=_}(this))
//# sourceMappingURL=react-timebomb.js.map?tm=1597301931744