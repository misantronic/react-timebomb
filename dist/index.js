import * as tslib_1 from "tslib";
import { bind } from 'lodash-decorators';
import * as React from 'react';
import styled from 'styled-components';
import { Select } from 'react-slct';
import { Menu } from './menu';
import { MenuTitle } from './menu-title';
import { Value } from './value';
import { isUndefined, startOfDay, isDisabled, dateFormat, validateDate, setDate, clearSelection, endOfDay } from './utils';
const DEFAULT_FORMAT = 'YYYY-MM-DD';
const Container = styled.div `
    width: 100%;
    position: relative;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;
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
    opacity: 0;
`;
export class ReactTimebomb extends React.Component {
    constructor(props) {
        super(props);
        const { value, format = DEFAULT_FORMAT } = this.props;
        this.state = {
            allowValidation: false,
            mode: 'month',
            valueText: value ? dateFormat(value, format) : undefined,
            date: value || startOfDay(new Date())
        };
    }
    static getDerivedStateFromProps(props) {
        return {
            showTime: Boolean(props.format && /H|h|m|k|a|S|s/.test(props.format))
        };
    }
    componentDidUpdate(prevProps, prevState) {
        const { valueText } = this.state;
        const { value, format = DEFAULT_FORMAT } = this.props;
        if (prevProps.format !== format) {
            this.setState({
                valueText: value ? dateFormat(value, format) : undefined
            });
        }
        if (prevState.valueText !== valueText) {
            this.valueTextDidUpdate();
        }
    }
    valueTextDidUpdate() {
        const { valueText, allowValidation } = this.state;
        const { format = DEFAULT_FORMAT } = this.props;
        const validDate = validateDate(valueText, format);
        if (validDate) {
            this.setState({ allowValidation: true }, () => {
                const disabled = isDisabled(validDate, this.props);
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
        else if (!isUndefined(valueText) && allowValidation) {
            this.emitChange(undefined);
        }
    }
    render() {
        const { value, placeholder, menuWidth, showConfirm, showCalendarWeek, selectWeek, format = DEFAULT_FORMAT } = this.props;
        const { showTime, valueText, allowValidation, mode } = this.state;
        const menuHeight = 260;
        const minDate = this.props.minDate
            ? startOfDay(this.props.minDate)
            : undefined;
        const maxDate = this.props.maxDate
            ? endOfDay(this.props.maxDate)
            : undefined;
        return (React.createElement(Select, { value: value, placeholder: placeholder }, ({ placeholder, open, onToggle, onRef, MenuContainer }) => (React.createElement(Container, { ref: onRef, className: "react-timebomb" },
            open ? (React.createElement(MenuContainer, { menuWidth: menuWidth, menuHeight: menuHeight },
                React.createElement(MenuWrapper, { menuHeight: menuHeight },
                    React.createElement(MenuTitle, { mode: mode, date: this.state.date, minDate: minDate, maxDate: maxDate, onMonths: this.onModeMonths, onYear: this.onModeYear, onNextMonth: this.onNextMonth, onPrevMonth: this.onPrevMonth, onToday: this.onToday }),
                    React.createElement(Menu, { showTime: showTime, showConfirm: showConfirm, showCalendarWeek: showCalendarWeek, selectWeek: selectWeek, date: this.state.date, value: value, valueText: valueText, format: format, mode: mode, minDate: minDate, maxDate: maxDate, onSelectDay: this.onSelectDay, onSelectMonth: this.onSelectMonth, onSelectYear: this.onSelectYear, onSelectTime: this.onSelectTime, onToggle: onToggle, onSubmit: this.onValueSubmit })))) : (React.createElement(React.Fragment, null,
                this.onClose(),
                React.createElement(BlindInput, { type: "text", onFocus: onToggle }))),
            React.createElement(Value, { placeholder: open ? undefined : placeholder, format: format, value: value, valueText: valueText, minDate: minDate, maxDate: maxDate, allowValidation: allowValidation, open: open, onChangeValueText: this.onChangeValueText, onToggle: onToggle, onSubmit: this.onValueSubmit })))));
    }
    onClose() {
        clearSelection();
        setTimeout(() => {
            const { format = DEFAULT_FORMAT } = this.props;
            const validDate = validateDate(this.state.valueText, format);
            const isValid = validDate
                ? !isDisabled(validDate, this.props)
                : validDate;
            if (!isValid && this.props.value) {
                const formattedDate = dateFormat(this.props.value, format);
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
        clearSelection();
    }
    onSelectDay(day) {
        const { value, format = DEFAULT_FORMAT } = this.props;
        let date = new Date(day);
        if (value) {
            date = setDate(day, value.getHours(), value.getMinutes());
        }
        const valueText = dateFormat(date, format);
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
        const { format = DEFAULT_FORMAT } = this.props;
        const value = this.props.value || new Date('1970-01-01');
        if (!time) {
            this.emitChange(startOfDay(value));
        }
        else {
            const splitted = time.split(':');
            const newDate = setDate(value, parseInt(splitted[0], 10), parseInt(splitted[1], 10));
            const valueText = dateFormat(newDate, format);
            this.setState({ valueText }, () => this.emitChange(newDate));
        }
    }
}
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], ReactTimebomb.prototype, "onChangeValueText", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Function]),
    tslib_1.__metadata("design:returntype", void 0)
], ReactTimebomb.prototype, "onValueSubmit", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Date]),
    tslib_1.__metadata("design:returntype", void 0)
], ReactTimebomb.prototype, "onSelectDay", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], ReactTimebomb.prototype, "onModeYear", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], ReactTimebomb.prototype, "onModeMonths", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Date]),
    tslib_1.__metadata("design:returntype", void 0)
], ReactTimebomb.prototype, "onSelectMonth", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Date]),
    tslib_1.__metadata("design:returntype", void 0)
], ReactTimebomb.prototype, "onSelectYear", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], ReactTimebomb.prototype, "onToday", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], ReactTimebomb.prototype, "onNextMonth", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], ReactTimebomb.prototype, "onPrevMonth", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], ReactTimebomb.prototype, "onSelectTime", null);
//# sourceMappingURL=index.js.map