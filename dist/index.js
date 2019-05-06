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
    max-height: ${(props) => props.menuHeight}px;
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
        this.emitChange = (() => {
            let timeout = 0;
            return (date, commit) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    const { value, showConfirm, onChange } = this.props;
                    if (!showConfirm) {
                        commit = true;
                    }
                    if (utils_1.dateEqual(value, date)) {
                        return;
                    }
                    if (commit) {
                        if (utils_1.isArray(date)) {
                            onChange(...date);
                        }
                        else {
                            onChange(date);
                        }
                    }
                    this.setState({ allowValidation: Boolean(date) });
                }, 0);
            };
        })();
        const { minDate, maxDate, selectRange, showConfirm } = props;
        if (minDate && maxDate && utils_1.isBefore(maxDate, minDate)) {
            console.error('[react-timebomb]: minDate must appear before maxDate');
        }
        if (selectRange === true && !showConfirm) {
            console.error('[react-timebomb]: when setting `selectRange = true` please also set `showConfirm`');
        }
        this.state = this.initialState;
        this.onChangeValueText = this.onChangeValueText.bind(this);
        this.onValueSubmit = this.onValueSubmit.bind(this);
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
        this.onMenuRef = this.onMenuRef.bind(this);
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
            selectedRange: 0,
            menuHeight: 0
        };
    }
    componentDidUpdate(prevProps, prevState) {
        const { valueText } = this.state;
        const { value, format } = this.props;
        if (prevProps.format !== format || prevProps.value !== value) {
            this.setState({
                valueText: value ? utils_1.dateFormat(value, format) : undefined
            });
        }
        if (prevState.valueText !== valueText) {
            this.valueTextDidUpdate(false);
        }
    }
    valueTextDidUpdate(commit) {
        const { valueText, allowValidation } = this.state;
        const { format } = this.props;
        const validDate = utils_1.validateDate(valueText, format);
        if (validDate) {
            this.setState({ allowValidation: true }, () => {
                const enabled = utils_1.isArray(validDate)
                    ? validDate.some(d => utils_1.isEnabled('day', d, this.props))
                    : utils_1.isEnabled('day', validDate, this.props);
                if (enabled) {
                    this.setState({ date: validDate }, () => this.emitChange(validDate, commit));
                }
                else {
                    this.emitError('outOfRange', valueText);
                }
            });
        }
        else if (valueText) {
            this.emitError('invalidDate', valueText);
        }
        else if (!utils_1.isUndefined(valueText) && allowValidation) {
            this.emitChange(undefined, commit);
        }
    }
    render() {
        const { placeholder, showConfirm, showCalendarWeek, selectRange, format, error, disabled, mobile, timeStep, onOpen } = this.props;
        const { showDate, showTime, valueText, mode, selectedRange, minDate, maxDate } = this.state;
        const value = valueText
            ? utils_1.validateDate(valueText, format)
            : this.props.value;
        const menuWidth = Math.max(ReactTimebomb.MENU_WIDTH, this.props.menuWidth || 0);
        const menuHeight = this.state.menuHeight || ReactTimebomb.MENU_HEIGHT;
        return (React.createElement(react_slct_1.Select, { value: value, placeholder: placeholder, error: error, onOpen: onOpen, onClose: this.onClose }, ({ placeholder, open, onToggle, onRef, MenuContainer }) => {
            const showMenu = open && (showDate || showTime) && !disabled;
            const className = [this.className];
            if (showMenu) {
                className.push('open');
            }
            this.onToggle = onToggle;
            if (mobile) {
                MenuContainer = this.getMobileMenuContainer(MenuContainer);
            }
            return (React.createElement(Container, { ref: onRef, className: className.join(' ') },
                this.renderValue(value, placeholder, open),
                showMenu ? (React.createElement(MenuContainer, { menuWidth: menuWidth, menuHeight: menuHeight, onClick: mobile
                        ? this.onMobileMenuContainerClick
                        : undefined },
                    React.createElement(MenuWrapper, { className: "react-timebomb-menu", menuHeight: menuHeight, mobile: mobile, ref: this.onMenuRef },
                        React.createElement(title_1.MenuTitle, { mode: mode, mobile: mobile, date: this.state.date, minDate: minDate, maxDate: maxDate, selectedRange: selectedRange, showTime: showTime, showDate: showDate, onMonth: this.onModeMonth, onYear: this.onModeYear, onNextMonth: this.onNextMonth, onPrevMonth: this.onPrevMonth, onReset: this.onReset }),
                        React.createElement(menu_1.Menu, { showTime: showTime, showDate: showDate, showConfirm: showConfirm, showCalendarWeek: showCalendarWeek, selectRange: selectRange, timeStep: timeStep, date: this.state.date, value: value, valueText: valueText, format: format, mode: mode, mobile: mobile, minDate: minDate, maxDate: maxDate, selectedRange: selectedRange, onSelectDay: this.onSelectDay, onSelectMonth: this.onSelectMonth, onChangeMonth: this.onChangeMonth, onSelectYear: this.onSelectYear, onSelectTime: this.onSelectTime, onSubmitTime: this.onSubmitOrCancelTime, onSubmit: this.onValueSubmit })))) : (React.createElement(BlindInput, { type: "text", onFocus: onToggle }))));
        }));
    }
    renderValue(value, placeholder, open) {
        placeholder = open ? undefined : placeholder;
        const { minDate, maxDate, disabled, format, selectRange, mobile, timeStep, iconComponent, arrowButtonComponent, arrowButtonId } = this.props;
        const { showDate, showTime, allowValidation, mode } = this.state;
        if (selectRange || utils_1.isArray(value)) {
            const multiValue = value
                ? utils_1.isArray(value)
                    ? value
                    : [value]
                : undefined;
            return (React.createElement(value_multi_1.ValueMulti, { open: open, disabled: disabled, placeholder: placeholder, value: multiValue, iconComponent: iconComponent, arrowButtonId: arrowButtonId, arrowButtonComponent: arrowButtonComponent, onClear: this.onClear, onToggle: this.onToggle }));
        }
        return (React.createElement(value_1.Value, { mode: mode, disabled: disabled, mobile: mobile, placeholder: placeholder, format: format, value: value, minDate: minDate, maxDate: maxDate, allowValidation: allowValidation, open: open, showDate: showDate, showTime: showTime, timeStep: timeStep, iconComponent: iconComponent, arrowButtonId: arrowButtonId, arrowButtonComponent: arrowButtonComponent, onClear: this.onClear, onChangeValueText: this.onChangeValueText, onChangeFormatGroup: this.onChangeFormatGroup, onToggle: this.onToggle, onSubmit: this.onValueSubmit, onAllSelect: this.onModeDay }));
    }
    onClose() {
        utils_1.clearSelection();
        setTimeout(() => {
            utils_1.clearSelection();
            this.setState(this.initialState, () => {
                if (this.props.onClose) {
                    this.props.onClose();
                }
            });
        }, 16);
    }
    emitError(error, value) {
        if (this.state.allowValidation) {
            this.setState({ allowValidation: false }, () => {
                if (this.props.onError) {
                    this.props.onError(error, value);
                }
            });
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
    onClear() {
        this.setState({ valueText: undefined }, () => {
            this.emitChange(undefined, true);
        });
    }
    onChangeValueText(valueText) {
        this.setState({ valueText });
    }
    onChangeFormatGroup(format) {
        this.setState({ mode: format ? utils_1.getFormatType(format) : undefined });
    }
    onValueSubmit() {
        if (this.onToggle) {
            this.onToggle();
        }
        utils_1.clearSelection();
        this.valueTextDidUpdate(true);
    }
    onSelectDay(day) {
        const { value, format, selectRange } = this.props;
        const valueDate = value instanceof Date
            ? value
            : utils_1.isArray(value)
                ? value[0]
                : undefined;
        if (selectRange === 'week') {
            const date = [utils_1.startOfWeek(day), utils_1.endOfWeek(day)];
            const valueText = utils_1.dateFormat(date, format);
            this.setState({ date, valueText });
            return;
        }
        else if (typeof selectRange === 'number') {
            const date = [day, utils_1.addDays(day, selectRange - 1)];
            const valueText = utils_1.dateFormat(date, format);
            this.setState({ date, valueText });
            return;
        }
        const date = utils_1.setDate(day, valueDate ? valueDate.getHours() : 0, valueDate ? valueDate.getMinutes() : 0);
        if (selectRange) {
            const dateArr = utils_1.isArray(this.state.valueText) &&
                this.state.valueText.length === 1
                ? [
                    utils_1.validateDate(this.state.valueText[0], format),
                    date
                ]
                : [date];
            const selectedRange = this.getSelectedRange(dateArr);
            const valueText = utils_1.dateFormat(dateArr.sort(utils_1.sortDates), format);
            this.setState({ date: dateArr, valueText, selectedRange });
        }
        else {
            const valueText = utils_1.dateFormat(date, format);
            this.setState({ date, valueText });
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
    onSelectTime(time, mode, commit = false) {
        const format = this.props.format;
        const value = this.props.value || new Date();
        const newDate = utils_1.isArray(value)
            ? value.map(d => utils_1.setDate(d, time.getHours(), time.getMinutes()))
            : utils_1.setDate(value, time.getHours(), time.getMinutes());
        const valueText = utils_1.dateFormat(newDate, format);
        this.setState({ mode, valueText }, () => this.emitChange(newDate, commit));
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
    onMenuRef(el) {
        if (el) {
            this.setState({ menuHeight: el.getBoundingClientRect().height });
        }
        else {
            this.setState({ menuHeight: 0 });
        }
    }
}
ReactTimebomb.MENU_WIDTH = 320;
ReactTimebomb.MENU_HEIGHT = 320;
/** @internal */
ReactTimebomb.defaultProps = {
    format: 'YYYY-MM-DD'
};
exports.ReactTimebomb = ReactTimebomb;
//# sourceMappingURL=index.js.map