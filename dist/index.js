import * as React from 'react';
import styled from 'styled-components';
import { Select } from 'react-slct';
import { Menu } from './menu';
import { MenuTitle } from './menu-title';
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
    max-height: ${(props) => props.menuHeight}px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;
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
            mode: 'day',
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
        const { placeholder, menuWidth, showConfirm, showCalendarWeek, selectWeek, selectRange, format, error, disabled, onOpen } = this.props;
        const { showDate, showTime, valueText, mode, selectedRange, minDate, maxDate } = this.state;
        const menuHeight = ReactTimebomb.MENU_HEIGHT;
        const value = valueText
            ? validateDate(valueText, format)
            : this.props.value;
        return (React.createElement(Select, { value: value, placeholder: placeholder, error: error, onOpen: onOpen, onClose: this.onClose }, ({ placeholder, open, onToggle, onRef, MenuContainer }) => {
            const showMenu = open && showDate && !disabled;
            this.onToggle = onToggle;
            return (React.createElement(Container, { ref: onRef, className: this.className },
                this.renderValue(value, placeholder, open),
                showMenu ? (React.createElement(MenuContainer, { menuWidth: Math.max(ReactTimebomb.MENU_WIDTH, menuWidth || 0), menuHeight: menuHeight },
                    React.createElement(MenuWrapper, { className: "react-timebomb-menu", menuHeight: menuHeight },
                        React.createElement(MenuTitle, { mode: mode, date: this.state.date, minDate: minDate, maxDate: maxDate, selectedRange: selectedRange, onMonth: this.onModeMonth, onYear: this.onModeYear, onNextMonth: this.onNextMonth, onPrevMonth: this.onPrevMonth, onReset: this.onReset }),
                        React.createElement(Menu, { showTime: showTime, showDate: showDate, showConfirm: showConfirm, showCalendarWeek: showCalendarWeek, selectWeek: selectWeek, selectRange: selectRange, date: this.state.date, value: value, valueText: valueText, format: format, mode: mode, minDate: minDate, maxDate: maxDate, selectedRange: selectedRange, onSelectDay: this.onSelectDay, onSelectMonth: this.onSelectMonth, onSelectYear: this.onSelectYear, onSelectTime: this.onSelectTime, onSubmit: this.onValueSubmit })))) : (React.createElement(BlindInput, { type: "text", onFocus: onToggle }))));
        }));
    }
    renderValue(value, placeholder, open) {
        placeholder = open ? undefined : placeholder;
        const { minDate, maxDate, disabled, format, selectRange, arrowButtonComponent } = this.props;
        const { showDate, showTime, allowValidation, mode } = this.state;
        if (selectRange || isArray(value)) {
            const multiValue = value
                ? isArray(value)
                    ? value
                    : [value]
                : undefined;
            return (React.createElement(ValueMulti, { open: open, disabled: disabled, placeholder: placeholder, value: multiValue, arrowButtonComponent: arrowButtonComponent, onClear: this.onClear, onToggle: this.onToggle }));
        }
        return (React.createElement(Value, { mode: mode, disabled: disabled, placeholder: placeholder, format: format, value: value, minDate: minDate, maxDate: maxDate, allowValidation: allowValidation, open: open, showDate: showDate, showTime: showTime, arrowButtonComponent: arrowButtonComponent, onClear: this.onClear, onChangeValueText: this.onChangeValueText, onChangeFormatGroup: this.onChangeFormatGroup, onToggle: this.onToggle, onSubmit: this.onValueSubmit, onAllSelect: this.onModeDay }));
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
        this.setState({ date, mode: 'month' });
    }
    onSelectYear(date) {
        this.setState({ date, mode: 'day' });
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
    onSelectTime(time) {
        const { format } = this.props;
        let value = this.props.value || new Date('1970-01-01');
        if (!time) {
            if (isArray(value)) {
                value = value.map(v => startOfDay(v));
            }
            this.emitChange(value, false);
        }
        else {
            const splitted = time.split(':');
            const newDate = isArray(value)
                ? value.map(d => setDate(d, parseInt(splitted[0], 10), parseInt(splitted[1], 10)))
                : setDate(value, parseInt(splitted[0], 10), parseInt(splitted[1], 10));
            const valueText = dateFormat(newDate, format);
            this.setState({ valueText }, () => this.emitChange(newDate, false));
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