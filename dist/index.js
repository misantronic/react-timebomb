import * as React from 'react';
import styled from 'styled-components';
import { Select } from 'react-slct';
import { Menu } from './menu';
import { MenuTitle } from './menu-title';
import { Value } from './value';
import { isUndefined, startOfDay, isEnabled, dateFormat, validateDate, setDate, clearSelection, endOfDay, isBefore, isAfter, dateEqual } from './utils';
const Container = styled.div `
    width: 100%;
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
        const { value, minDate, maxDate, format } = this.props;
        if (minDate && maxDate && isBefore(maxDate, minDate)) {
            throw new Error('minDate must appear before maxDate');
        }
        this.state = {
            allowValidation: false,
            mode: 'month',
            valueText: value ? dateFormat(value, format) : undefined,
            date: this.defaultDateValue
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
    /** @internal */
    static getDerivedStateFromProps(props) {
        return {
            showTime: Boolean(/H|h|m|k|a|S|s/.test(props.format))
        };
    }
    get className() {
        const classNames = ['react-timebomb'];
        if (this.props.className) {
            classNames.push(this.props.className);
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
    componentDidUpdate(prevProps, prevState) {
        const { valueText } = this.state;
        const { value, format } = this.props;
        if (prevProps.format !== format) {
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
                const enabled = isEnabled('day', validDate, this.props);
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
        const { placeholder, menuWidth, showConfirm, showCalendarWeek, selectWeek, format } = this.props;
        const { showTime, valueText, allowValidation, mode } = this.state;
        const menuHeight = 320;
        const minDate = this.props.minDate
            ? startOfDay(this.props.minDate)
            : undefined;
        const maxDate = this.props.maxDate
            ? endOfDay(this.props.maxDate)
            : undefined;
        const value = valueText
            ? validateDate(valueText, format)
            : this.props.value;
        return (React.createElement(Select, { value: value, placeholder: placeholder }, ({ placeholder, open, onToggle, onRef, MenuContainer }) => {
            this.onToggle = onToggle;
            return (React.createElement(Container, { ref: onRef, className: this.className },
                React.createElement(Value, { placeholder: open ? undefined : placeholder, format: format, value: value, valueText: valueText, minDate: minDate, maxDate: maxDate, allowValidation: allowValidation, open: open, onChangeValueText: this.onChangeValueText, onToggle: onToggle, onSubmit: this.onValueSubmit }),
                open ? (React.createElement(MenuContainer, { menuWidth: menuWidth, menuHeight: menuHeight },
                    React.createElement(MenuWrapper, { menuHeight: menuHeight },
                        React.createElement(MenuTitle, { mode: mode, date: this.state.date, minDate: minDate, maxDate: maxDate, onMonths: this.onModeMonths, onYear: this.onModeYear, onNextMonth: this.onNextMonth, onPrevMonth: this.onPrevMonth, onToday: this.onToday }),
                        React.createElement(Menu, { showTime: showTime, showConfirm: showConfirm, showCalendarWeek: showCalendarWeek, selectWeek: selectWeek, date: this.state.date, value: value, valueText: valueText, format: format, mode: mode, minDate: minDate, maxDate: maxDate, onSelectDay: this.onSelectDay, onSelectMonth: this.onSelectMonth, onSelectYear: this.onSelectYear, onSelectTime: this.onSelectTime, onSubmit: this.onValueSubmit })))) : (React.createElement(React.Fragment, null,
                    this.onClose(),
                    React.createElement(BlindInput, { type: "text", onFocus: onToggle })))));
        }));
    }
    onClose() {
        clearSelection();
        setTimeout(() => {
            const { format, value } = this.props;
            const validDate = validateDate(this.state.valueText, format);
            const isValid = validDate
                ? isEnabled('day', validDate, this.props)
                : validDate;
            if (!isValid && value) {
                const formattedDate = dateFormat(value, format);
                if (this.state.valueText !== formattedDate) {
                    this.onChangeValueText(formattedDate);
                    return;
                }
            }
            if (!dateEqual(value, validDate)) {
                if (value) {
                    const formattedDate = dateFormat(value, format);
                    this.onChangeValueText(formattedDate);
                }
                else if (this.state.valueText !== undefined) {
                    this.onChangeValueText(undefined);
                }
            }
        }, 0);
        return null;
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
    emitChange(date, commit) {
        const { value, showConfirm, onChange } = this.props;
        if (!showConfirm) {
            commit = true;
        }
        if (dateEqual(value, date)) {
            return;
        }
        if (commit) {
            onChange(date);
        }
        this.setState({ allowValidation: Boolean(date) });
    }
    onChangeValueText(valueText, commit = false) {
        this.setState({ valueText }, () => {
            if (commit) {
                this.emitChange(undefined, true);
            }
        });
    }
    onValueSubmit() {
        if (this.onToggle) {
            this.onToggle();
        }
        clearSelection();
        this.valueTextDidUpdate(true);
    }
    onSelectDay(day) {
        const { value, format } = this.props;
        let date = new Date(day);
        if (value) {
            date = setDate(day, value.getHours(), value.getMinutes());
        }
        const valueText = dateFormat(date, format);
        this.setState({ date, valueText });
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
        const now = startOfDay(new Date());
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
        const { format } = this.props;
        const value = this.props.value || new Date('1970-01-01');
        if (!time) {
            this.emitChange(startOfDay(value), false);
        }
        else {
            const splitted = time.split(':');
            const newDate = setDate(value, parseInt(splitted[0], 10), parseInt(splitted[1], 10));
            const valueText = dateFormat(newDate, format);
            this.setState({ valueText }, () => this.emitChange(newDate, false));
        }
    }
}
/** @internal */
ReactTimebomb.defaultProps = {
    format: 'YYYY-MM-DD'
};
//# sourceMappingURL=index.js.map