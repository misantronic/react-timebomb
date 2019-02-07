import * as React from 'react';
import styled from 'styled-components';
import { isEnabled, validateDate, getMonthNames, getAttribute, isArray, dateEqual, addMonths, subtractMonths, startOfMonth, subtractDays, addDays, endOfMonth } from '../utils';
import { Button } from '../components/button';
import { MenuTable } from './table';
import { GestureWrapper } from './mobile';
import { MenuTime } from './time';
const MonthAndYearContainer = styled.div `
    display: flex;
    height: ${(props) => props.mobile ? '100%' : '220px'};
`;
const MonthsContainer = styled.div `
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
const MonthContainer = styled.div `
    flex: 1;
    padding: 0;
    height: ${(props) => (props.mobile ? '100' : 'auto')};
    overflow: hidden;
`;
const YearContainer = styled.div `
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
const Confirm = styled.div `
    width: 100%;
    text-align: center;
    padding: 10px 0;

    button {
        padding: 3px 28px;
    }
`;
export class Menu extends React.PureComponent {
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
        this.monthNames = getMonthNames(true);
    }
    get now() {
        return new Date();
    }
    getDate(date) {
        return (isArray(date) ? date[this.props.selectedRange] : date);
    }
    get fullYears() {
        const { value, minDate, maxDate } = this.props;
        const valueDate = this.getDate(value);
        const year = this.getDate(this.props.date).getFullYear();
        const getDateConfig = (date, newYear) => {
            date = new Date(date);
            date.setFullYear(newYear);
            const enabled = isEnabled('year', date, this.props);
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
                const enabled = isEnabled('year', date, this.props);
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
        if (isArray(date)) {
            date = date[0];
        }
        if (date) {
            if (subtractDays(startOfMonth(date), 1) < minDate) {
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
        if (isArray(date)) {
            date = date[0];
        }
        if (date) {
            if (addDays(endOfMonth(date), 1) > maxDate) {
                return false;
            }
        }
        return true;
    }
    componentDidUpdate(prevProps) {
        if (!dateEqual(prevProps.date, this.props.date)) {
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
            return (React.createElement(Button, { key: dateStr, tabIndex: -1, className: selected ? 'selected' : undefined, selected: selected, mobile: this.props.mobile, "data-date": dateStr, onClick: this.onSelectYear }, fullYear));
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
            const enabled = isEnabled('month', newDate, this.props);
            const selected = month === newDate.getMonth() &&
                year === newDate.getFullYear();
            return (React.createElement(Button, { key: str, tabIndex: -1, className: selected ? 'selected' : undefined, selected: selected, disabled: !enabled, mobile: this.props.mobile, "data-date": newDate.toISOString(), onClick: this.onSelectMonth }, str));
        })));
    }
    renderMonth() {
        const { mobile } = this.props;
        if (mobile) {
            return (React.createElement(GestureWrapper, { allowNext: this.allowNext, allowPrev: this.allowPrev, onChangeMonth: this.onChangeMonth },
                React.createElement(MenuTable, { date: subtractMonths(this.getDate(this.props.date), 1), minDate: this.props.minDate, maxDate: this.props.maxDate, mobile: this.props.mobile, selectRange: this.props.selectRange, selectedRange: this.props.selectedRange, selectWeek: this.props.selectWeek, showCalendarWeek: this.props.showCalendarWeek, showConfirm: this.props.showConfirm, showTime: this.props.showTime, value: subtractMonths(this.getDate(this.props.value), 1), onSubmit: this.props.onSubmit, onSelectDay: this.props.onSelectDay }),
                React.createElement(MenuTable, { date: this.props.date, minDate: this.props.minDate, maxDate: this.props.maxDate, mobile: this.props.mobile, selectRange: this.props.selectRange, selectedRange: this.props.selectedRange, selectWeek: this.props.selectWeek, showCalendarWeek: this.props.showCalendarWeek, showConfirm: this.props.showConfirm, showTime: this.props.showTime, value: this.props.value, onSubmit: this.props.onSubmit, onSelectDay: this.props.onSelectDay }),
                React.createElement(MenuTable, { date: addMonths(this.getDate(this.props.date), 1), minDate: this.props.minDate, maxDate: this.props.maxDate, mobile: this.props.mobile, selectRange: this.props.selectRange, selectedRange: this.props.selectedRange, selectWeek: this.props.selectWeek, showCalendarWeek: this.props.showCalendarWeek, showConfirm: this.props.showConfirm, showTime: this.props.showTime, value: addMonths(this.getDate(this.props.value), 1), onSubmit: this.props.onSubmit, onSelectDay: this.props.onSelectDay })));
        }
        return (React.createElement(MenuTable, { date: this.props.date, minDate: this.props.minDate, maxDate: this.props.maxDate, mobile: this.props.mobile, selectRange: this.props.selectRange, selectedRange: this.props.selectedRange, selectWeek: this.props.selectWeek, showCalendarWeek: this.props.showCalendarWeek, showConfirm: this.props.showConfirm, showTime: this.props.showTime, value: this.props.value, onSubmit: this.props.onSubmit, onSelectDay: this.props.onSelectDay }));
    }
    renderTime() {
        return (React.createElement(MenuTime, { date: this.props.date, timeStep: this.props.timeStep, topDivider: this.props.showDate, onChange: this.props.onSelectTime, onSubmit: this.props.onSubmitTime, onCancel: this.props.onSubmitTime }));
    }
    renderConfirm() {
        const { valueText, format } = this.props;
        const validDate = validateDate(valueText, format);
        const isValid = validDate
            ? isArray(validDate)
                ? validDate.every(v => isEnabled('day', v, this.props))
                : isEnabled('day', validDate, this.props)
            : false;
        return (React.createElement(Confirm, null,
            React.createElement(Button, { tabIndex: -1, disabled: !isValid, mobile: this.props.mobile, onClick: () => this.props.onSubmit() }, "Ok")));
    }
    onSelectMonth(e) {
        const date = new Date(getAttribute(e.currentTarget, 'data-date'));
        setTimeout(() => this.props.onSelectMonth(date), 0);
    }
    onSelectYear(e) {
        const date = new Date(getAttribute(e.currentTarget, 'data-date'));
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
                onChangeMonth(addMonths(date, 1));
                break;
            case 'prev':
                onChangeMonth(subtractMonths(date, 1));
                break;
        }
    }
}
//# sourceMappingURL=index.js.map