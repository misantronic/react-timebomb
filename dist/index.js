import * as React from 'react';
import styled, { css } from 'styled-components';
import { Select } from 'react-slct';
import { Menu } from './menu';
import { MenuTitle } from './menu/title';
import { Value } from './value';
import { isUndefined, startOfDay, isEnabled, dateFormat, validateDate, setDate, clearSelection, endOfDay, isBefore, isAfter, dateEqual, startOfWeek, endOfWeek, sortDates, isDateFormat, isTimeFormat, isArray, getFormatType } from './utils';
import { ValueMulti } from './value-multi';
const Container = styled.div `
    width: 100%;
    height: 100%;
    position: relative;
`;
const MenuWrapper = styled.div `
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
    ? css `
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
const BlindInput = styled.input `
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    pointer-events: none;
`;
export class ReactTimebomb extends React.Component {
    constructor(props) {
        super(props);
        this.emitChange = (() => {
            let timeout;
            return (date, commit) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    const { value, showConfirm, onChange } = this.props;
                    if (!showConfirm) {
                        commit = true;
                    }
                    if (dateEqual(value, date)) {
                        return;
                    }
                    if (commit) {
                        if (isArray(date)) {
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
        if (minDate && maxDate && isBefore(maxDate, minDate)) {
            throw new Error('minDate must appear before maxDate');
        }
        if (selectRange && !showConfirm) {
            throw new Error('when using `selectRange` please also set `showConfirm`');
        }
        this.state = this.initialState;
        this.onChangeValueText = this.onChangeValueText.bind(this);
        this.onValueSubmit = this.onValueSubmit.bind(this);
        this.onSelectDay = this.onSelectDay.bind(this);
        this.onModeDay = this.onModeDay.bind(this);
        this.onModeYear = this.onModeYear.bind(this);
        this.onModeMonth = this.onModeMonth.bind(this);
        this.onSelectMonth = this.onSelectMonth.bind(this);
        this.onSelectYear = this.onSelectYear.bind(this);
        this.onReset = this.onReset.bind(this);
        this.onNextMonth = this.onNextMonth.bind(this);
        this.onPrevMonth = this.onPrevMonth.bind(this);
        this.onSelectTime = this.onSelectTime.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onChangeFormatGroup = this.onChangeFormatGroup.bind(this);
        this.onMobileMenuContainerClick = this.onMobileMenuContainerClick.bind(this);
    }
    /** @internal */
    static getDerivedStateFromProps(props) {
        const format = props.format;
        const { minDate, maxDate } = props;
        return {
            minDate: minDate ? startOfDay(minDate) : undefined,
            maxDate: maxDate ? endOfDay(maxDate) : undefined,
            showTime: isTimeFormat(format),
            showDate: isDateFormat(format)
        };
    }
    getMobileMenuContainer(MenuContainer) {
        if (!this.MobileMenuContainer) {
            this.MobileMenuContainer = styled(MenuContainer) `
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
        if (maxDate && isBefore(maxDate, date)) {
            date = maxDate;
        }
        else if (minDate && isAfter(minDate, date)) {
            date = minDate;
        }
        return startOfDay(date);
    }
    get initialState() {
        return {
            allowValidation: false,
            mode: getFormatType(this.props.format),
            valueText: this.props.value
                ? dateFormat(this.props.value, this.props.format)
                : undefined,
            date: this.defaultDateValue,
            selectedRange: 0
        };
    }
    componentDidUpdate(prevProps, prevState) {
        const { valueText } = this.state;
        const { value, format } = this.props;
        if (prevProps.format !== format || prevProps.value !== value) {
            this.setState({
                valueText: value ? dateFormat(value, format) : undefined
            });
        }
        if (prevState.valueText !== valueText) {
            this.valueTextDidUpdate(false);
        }
    }
    valueTextDidUpdate(commit) {
        const { valueText, allowValidation } = this.state;
        const { format } = this.props;
        const validDate = validateDate(valueText, format);
        if (validDate) {
            this.setState({ allowValidation: true }, () => {
                const enabled = isArray(validDate)
                    ? validDate.every(d => isEnabled('day', d, this.props))
                    : isEnabled('day', validDate, this.props);
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
        else if (!isUndefined(valueText) && allowValidation) {
            this.emitChange(undefined, commit);
        }
    }
    render() {
        const { placeholder, showConfirm, showCalendarWeek, selectWeek, selectRange, format, error, disabled, mobile, timeStep, onOpen } = this.props;
        const { showDate, showTime, valueText, mode, selectedRange, minDate, maxDate } = this.state;
        const value = valueText
            ? validateDate(valueText, format)
            : this.props.value;
        const menuWidth = Math.max(ReactTimebomb.MENU_WIDTH, this.props.menuWidth || 0);
        const menuHeight = ReactTimebomb.MENU_HEIGHT;
        return (React.createElement(Select, { value: value, placeholder: placeholder, error: error, onOpen: onOpen, onClose: this.onClose }, ({ placeholder, open, onToggle, onRef, MenuContainer }) => {
            const showMenu = open && (showDate || showTime) && !disabled;
            this.onToggle = onToggle;
            if (mobile) {
                MenuContainer = this.getMobileMenuContainer(MenuContainer);
            }
            return (React.createElement(Container, { ref: onRef, className: this.className },
                this.renderValue(value, placeholder, open),
                showMenu ? (React.createElement(MenuContainer, { menuWidth: menuWidth, menuHeight: menuHeight, onClick: mobile
                        ? this.onMobileMenuContainerClick
                        : undefined },
                    React.createElement(MenuWrapper, { className: "react-timebomb-menu", menuHeight: menuHeight, mobile: mobile },
                        React.createElement(MenuTitle, { mode: mode, mobile: mobile, date: this.state.date, minDate: minDate, maxDate: maxDate, selectedRange: selectedRange, showTime: showTime, showDate: showDate, onMonth: this.onModeMonth, onYear: this.onModeYear, onNextMonth: this.onNextMonth, onPrevMonth: this.onPrevMonth, onReset: this.onReset }),
                        React.createElement(Menu, { showTime: showTime, showDate: showDate, showConfirm: showConfirm, showCalendarWeek: showCalendarWeek, selectWeek: selectWeek, selectRange: selectRange, timeStep: timeStep, date: this.state.date, value: value, valueText: valueText, format: format, mode: mode, mobile: mobile, minDate: minDate, maxDate: maxDate, selectedRange: selectedRange, onSelectDay: this.onSelectDay, onSelectMonth: this.onSelectMonth, onSelectYear: this.onSelectYear, onSelectTime: this.onSelectTime, onSubmit: this.onValueSubmit })))) : (React.createElement(BlindInput, { type: "text", onFocus: onToggle }))));
        }));
    }
    renderValue(value, placeholder, open) {
        placeholder = open ? undefined : placeholder;
        const { minDate, maxDate, disabled, format, selectRange, mobile, timeStep, arrowButtonComponent } = this.props;
        const { showDate, showTime, allowValidation, mode } = this.state;
        if (selectRange || isArray(value)) {
            const multiValue = value
                ? isArray(value)
                    ? value
                    : [value]
                : undefined;
            return (React.createElement(ValueMulti, { open: open, disabled: disabled, placeholder: placeholder, value: multiValue, arrowButtonComponent: arrowButtonComponent, onClear: this.onClear, onToggle: this.onToggle }));
        }
        return (React.createElement(Value, { mode: mode, disabled: disabled, mobile: mobile, placeholder: placeholder, format: format, value: value, minDate: minDate, maxDate: maxDate, allowValidation: allowValidation, open: open, showDate: showDate, showTime: showTime, timeStep: timeStep, arrowButtonComponent: arrowButtonComponent, onClear: this.onClear, onChangeValueText: this.onChangeValueText, onChangeFormatGroup: this.onChangeFormatGroup, onToggle: this.onToggle, onSubmit: this.onValueSubmit, onAllSelect: this.onModeDay }));
    }
    onClose() {
        clearSelection();
        setTimeout(() => {
            clearSelection();
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
        if (isArray(date)) {
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
        this.setState({ mode: format ? getFormatType(format) : undefined });
    }
    onValueSubmit() {
        if (this.onToggle) {
            this.onToggle();
        }
        clearSelection();
        this.valueTextDidUpdate(true);
    }
    onSelectDay(day) {
        const { value, format, selectWeek, selectRange } = this.props;
        const valueDate = value instanceof Date
            ? value
            : isArray(value)
                ? value[0]
                : undefined;
        if (selectWeek) {
            const date = [startOfWeek(day), endOfWeek(day)];
            const valueText = dateFormat(date, format);
            this.setState({ date, valueText });
        }
        else {
            const date = setDate(day, valueDate ? valueDate.getHours() : 0, valueDate ? valueDate.getMinutes() : 0);
            if (selectRange) {
                const dateArr = isArray(this.state.valueText) &&
                    this.state.valueText.length === 1
                    ? [
                        validateDate(this.state.valueText[0], format),
                        date
                    ]
                    : [date];
                const selectedRange = this.getSelectedRange(dateArr);
                const valueText = dateFormat(dateArr.sort(sortDates), format);
                this.setState({ date: dateArr, valueText, selectedRange });
            }
            else {
                const valueText = dateFormat(date, format);
                this.setState({ date, valueText });
            }
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
    onSelectYear(date) {
        this.onSelectDay(date);
        this.setState({ mode: 'day' });
    }
    onReset() {
        this.setState({ date: this.defaultDateValue });
    }
    onNextMonth() {
        const currentDate = isArray(this.state.date)
            ? this.state.date[this.state.selectedRange]
            : this.state.date;
        if (currentDate) {
            const date = new Date(currentDate);
            date.setMonth(date.getMonth() + 1);
            this.setState({ date });
        }
    }
    onPrevMonth() {
        const currentDate = isArray(this.state.date)
            ? this.state.date[this.state.selectedRange]
            : this.state.date;
        if (currentDate) {
            const date = new Date(currentDate);
            date.setMonth(date.getMonth() - 1);
            this.setState({ date });
        }
    }
    onSelectTime(time, mode) {
        const format = this.props.format;
        let value = this.props.value || new Date('1970-01-01');
        if (!time) {
            if (isArray(value)) {
                value = value.map(v => startOfDay(v));
            }
            this.emitChange(value, false);
        }
        else {
            const newDate = isArray(value)
                ? value.map(d => setDate(d, time.getHours(), time.getMinutes()))
                : setDate(value, time.getHours(), time.getMinutes());
            const valueText = dateFormat(newDate, format);
            this.setState({ mode, valueText }, () => this.emitChange(newDate, false));
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
ReactTimebomb.MENU_HEIGHT = 320;
/** @internal */
ReactTimebomb.defaultProps = {
    format: 'YYYY-MM-DD'
};
//# sourceMappingURL=index.js.map