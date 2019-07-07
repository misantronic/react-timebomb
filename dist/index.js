"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const styled_components_1 = require("styled-components");
const react_slct_1 = require("react-slct");
const menu_1 = require("./menu");
const title_1 = require("./menu/title");
const value_1 = require("./value/value");
const utils_1 = require("./utils");
const value_multi_1 = require("./value/value-multi");
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
                timeout = setTimeout(async () => {
                    const { value, onChange } = this.props;
                    if (utils_1.dateEqual(value, date)) {
                        return;
                    }
                    const changeDate = utils_1.isArray(date) ? date : [date];
                    onChange(...changeDate);
                    await this.setStateAsync({
                        allowValidation: Boolean(date),
                        preventClose: false
                    });
                }, 0);
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
        this.onSelectMonth = this.onSelectMonth.bind(this);
        this.onChangeMonth = this.onChangeMonth.bind(this);
        this.onSelectYear = this.onSelectYear.bind(this);
        this.onReset = this.onReset.bind(this);
        this.onNextMonth = this.onNextMonth.bind(this);
        this.onPrevMonth = this.onPrevMonth.bind(this);
        this.onSelectTime = this.onSelectTime.bind(this);
        this.onSubmitOrCancelTime = this.onSubmitOrCancelTime.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onChangeFormatGroup = this.onChangeFormatGroup.bind(this);
        this.onHoverDays = this.onHoverDays.bind(this);
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
        if (!this.MobileMenuContainer) {
            this.MobileMenuContainer = styled_components_1.default(MenuContainer) `
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
        return this.MobileMenuContainer;
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
            menuHeight: undefined,
            selectedRange: 0,
            preventClose: false
        };
    }
    async componentDidUpdate(prevProps, prevState) {
        const { valueText, showDate, showTime, preventClose } = this.state;
        const { value, format, selectRange, showConfirm } = this.props;
        if (prevProps.format !== format || prevProps.value !== value) {
            this.setState({
                valueText: value ? utils_1.dateFormat(value, format) : undefined
            });
        }
        if (!utils_1.stringEqual(prevState.valueText, valueText)) {
            const result = await this.validateValueText();
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
    }
    setStateAsync(state) {
        return new Promise(resolve => {
            this.setState(state, resolve);
        });
    }
    validateValueText() {
        const { valueText, allowValidation } = this.state;
        const { format } = this.props;
        const validDate = utils_1.validateDate(valueText, format);
        return new Promise(async (resolve) => {
            if (validDate) {
                await this.setStateAsync({ allowValidation: true });
                const enabled = utils_1.isArray(validDate)
                    ? validDate.some(d => utils_1.isEnabled('day', d, this.props))
                    : utils_1.isEnabled('day', validDate, this.props);
                if (enabled) {
                    await this.setStateAsync({ date: validDate });
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
        });
    }
    render() {
        const { placeholder, showConfirm, showCalendarWeek, selectRange, format, error, disabled, mobile, timeStep, confirmComponent, onOpen } = this.props;
        const { showDate, showTime, valueText, mode, selectedRange, minDate, maxDate } = this.state;
        const value = valueText
            ? utils_1.validateDate(valueText, format)
            : this.props.value;
        const menuWidth = Math.max(ReactTimebomb.MENU_WIDTH, this.props.menuWidth || 0);
        const menuLeft = utils_1.isArray(value) &&
            value.length !== 0 &&
            this.valueRef.current &&
            selectRange === true
            ? this.valueRef.current.getBoundingClientRect().left +
                this.valueRef.current.getBoundingClientRect().width -
                menuWidth
            : undefined;
        return (React.createElement(react_slct_1.Select, { value: value, placeholder: placeholder, error: error, onOpen: onOpen, onClose: this.onClose }, ({ placeholder, open, onToggle, onRef, MenuContainer }) => {
            const showMenu = open && (showDate || showTime) && !disabled;
            const className = [this.className];
            const onClick = mobile
                ? this.onMobileMenuContainerClick
                : undefined;
            if (showMenu) {
                className.push('open');
            }
            this.onToggle = onToggle;
            if (mobile) {
                MenuContainer = this.getMobileMenuContainer(MenuContainer);
            }
            return (React.createElement(Container, { ref: onRef, className: className.join(' ') },
                this.renderValue(value, placeholder, open),
                showMenu ? (React.createElement(MenuContainer, { menuLeft: menuLeft, menuWidth: menuWidth, menuHeight: this.state.menuHeight, onClick: onClick },
                    React.createElement(MenuWrapper, { className: "react-timebomb-menu", mobile: mobile },
                        React.createElement(title_1.MenuTitle, { mode: mode, mobile: mobile, date: this.state.date, minDate: minDate, maxDate: maxDate, selectedRange: selectedRange, showTime: showTime, showDate: showDate, onMonth: this.onModeMonth, onYear: this.onModeYear, onNextMonth: this.onNextMonth, onPrevMonth: this.onPrevMonth, onReset: this.onReset }),
                        React.createElement(menu_1.Menu, { showTime: showTime, showDate: showDate, showConfirm: showConfirm, showCalendarWeek: showCalendarWeek, selectRange: selectRange, timeStep: timeStep, date: this.state.date, value: value, valueText: valueText, format: format, mode: mode, mobile: mobile, minDate: minDate, maxDate: maxDate, selectedRange: selectedRange, confirmComponent: confirmComponent, onHoverDays: this.onHoverDays, onSelectDay: this.onSelectDay, onSelectMonth: this.onSelectMonth, onChangeMonth: this.onChangeMonth, onSelectYear: this.onSelectYear, onSelectTime: this.onSelectTime, onSubmitTime: this.onSubmitOrCancelTime, onSubmit: this.emitChangeAndClose })))) : (React.createElement(BlindInput, { type: "text", onFocus: onToggle }))));
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
        return (React.createElement(ValueComponent, { ref: this.valueRef, mode: mode, disabled: disabled, mobile: mobile, placeholder: placeholder, format: format, value: componentValue, hoverDate: hoverDate, minDate: minDate, maxDate: maxDate, allowValidation: allowValidation, open: open, showDate: showDate, showTime: showTime, timeStep: timeStep, iconComponent: iconComponent, arrowButtonId: arrowButtonId, arrowButtonComponent: arrowButtonComponent, clearComponent: clearComponent, labelComponent: labelComponent, onClear: this.onClear, onChangeValueText: this.onChangeValueText, onChangeFormatGroup: this.onChangeFormatGroup, onToggle: this.onToggle, onSubmit: this.emitChangeAndClose, onAllSelect: this.onModeDay }));
    }
    onClose() {
        utils_1.clearSelection();
        setTimeout(async () => {
            utils_1.clearSelection();
            await this.setStateAsync(this.initialState);
            if (this.props.onClose) {
                this.props.onClose();
            }
        }, 16);
    }
    async emitError(error, value) {
        if (this.state.allowValidation) {
            await this.setStateAsync({ allowValidation: false });
            if (this.props.onError) {
                this.props.onError(error, value);
            }
        }
    }
    async emitChangeAndClose(newDate) {
        if (this.onToggle) {
            this.onToggle();
        }
        utils_1.clearSelection();
        const { date } = newDate
            ? { date: newDate }
            : await this.validateValueText();
        if (date) {
            this.emitChange(date);
        }
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
    async onClear() {
        await this.setStateAsync({ valueText: undefined });
        this.emitChange(undefined);
    }
    onChangeValueText(valueText) {
        this.setState({ valueText, preventClose: true });
    }
    async onChangeFormatGroup(format) {
        await this.setStateAsync({
            menuHeight: 'auto',
            mode: format ? utils_1.getFormatType(format) : undefined
        });
    }
    onHoverDays([hoverDate]) {
        if (utils_1.isArray(this.state.valueText) &&
            utils_1.isArray(this.state.date) &&
            this.state.valueText.length === 1 &&
            this.state.date.length === 1 &&
            hoverDate) {
            this.setState({ hoverDate });
        }
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
    onSelectMonth(date) {
        this.onSelectDay(date);
        this.setState({ mode: 'day' });
    }
    onChangeMonth(date) {
        this.setState({ date, mode: 'day' });
    }
    onSelectYear(date) {
        this.onSelectDay(date);
        this.setState({ mode: 'day' });
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
    async onSelectTime(time, mode, commit = false) {
        const format = this.props.format;
        const value = this.props.value || new Date();
        const newDate = utils_1.isArray(value)
            ? value.map(d => utils_1.setDate(d, time.getHours(), time.getMinutes()))
            : utils_1.setDate(value, time.getHours(), time.getMinutes());
        const valueText = utils_1.dateFormat(newDate, format);
        await this.setStateAsync({ mode, valueText });
        if (commit) {
            this.emitChange(newDate);
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
ReactTimebomb.MENU_WIDTH = 320;
/** @internal */
ReactTimebomb.defaultProps = {
    format: 'YYYY-MM-DD'
};
exports.ReactTimebomb = ReactTimebomb;
//# sourceMappingURL=index.js.map