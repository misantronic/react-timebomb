import * as React from 'react';
import { getWeekOfYear, dateEqual, isEnabled, isToday, isArray } from '../utils';
import styled from 'styled-components';
const Flex = styled.div `
    display: flex;
    align-items: center;
`;
const StyledDay = styled(Flex) `
    padding: 8px 2px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: ${(props) => (props.current ? 'inherit' : '#aaa')};
    background-color: ${(props) => props.selected
    ? '#ddd'
    : props.today
        ? 'rgba(172, 206, 247, 0.4)'
        : 'transparent'};
    font-weight: ${(props) => props.selected ? 'bold' : 'normal'};
    pointer-events: ${(props) => props.disabled ? 'none' : 'auto'};
    user-select: none;
    opacity: ${(props) => (props.disabled ? 0.3 : 1)};

    &:hover {
        background-color: ${(props) => props.selected ? '#ddd' : '#eee'};
    }
`;
export class Day extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            current: false,
            enabled: true,
            today: false,
            selected: false
        };
        this.onSelectDay = this.onSelectDay.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }
    get selected() {
        const { value, selectWeek, selectRange, hoverDay, day } = this.props;
        if (value) {
            if (selectWeek) {
                const dayWeekOfYear = getWeekOfYear(day);
                if (isArray(value)) {
                    return value.some(v => getWeekOfYear(v) === dayWeekOfYear);
                }
                return getWeekOfYear(value) === dayWeekOfYear;
            }
            if (selectRange && isArray(value)) {
                const [minDate, maxDate] = value;
                if (value.length === 1 && hoverDay) {
                    return isEnabled('day', day, {
                        minDate: minDate < hoverDay ? minDate : hoverDay,
                        maxDate: minDate > hoverDay ? minDate : hoverDay
                    });
                }
                if (value.length === 2) {
                    return isEnabled('day', day, {
                        minDate,
                        maxDate
                    });
                }
            }
        }
        return dateEqual(value, day, this.props.showTime);
    }
    get current() {
        const { day, date } = this.props;
        const dayMonth = day.getMonth();
        if (isArray(date)) {
            return date.some(d => d.getMonth() === dayMonth);
        }
        if (date) {
            return dayMonth === date.getMonth();
        }
        return false;
    }
    get enabled() {
        return isEnabled('day', this.props.day, this.props);
    }
    get today() {
        return isToday(this.props.day);
    }
    componentDidMount() {
        this.updateState();
    }
    componentDidUpdate(prevProps) {
        this.updateState(prevProps);
    }
    render() {
        const { day } = this.props;
        const { selected, current, enabled, today } = this.state;
        return (React.createElement(StyledDay, { className: selected ? 'value selected' : 'value', selected: selected, current: current, disabled: !enabled, today: today, onClick: this.onSelectDay, onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave }, day.getDate()));
    }
    updateState(prevProps = {}) {
        const { day, minDate, maxDate } = this.props;
        const dayChanged = !dateEqual(prevProps.day, day);
        const minMaxChanged = !dateEqual(prevProps.minDate, minDate) ||
            !dateEqual(prevProps.maxDate, maxDate);
        this.setState({
            current: this.current,
            enabled: dayChanged || minMaxChanged ? this.enabled : this.state.enabled,
            today: dayChanged ? this.today : this.state.today,
            selected: this.selected
        });
    }
    onSelectDay() {
        this.props.onSelectDay(this.props.day);
    }
    onMouseEnter() {
        this.props.onMouseEnter(this.props.day);
    }
    onMouseLeave() {
        this.props.onMouseLeave(this.props.day);
    }
}
export class WeekNum extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    render() {
        return React.createElement("div", { onClick: this.onClick }, this.props.children);
    }
    onClick() {
        this.props.onClick(this.props.day);
    }
}
//# sourceMappingURL=day.js.map