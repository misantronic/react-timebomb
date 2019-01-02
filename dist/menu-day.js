import * as React from 'react';
import { getWeekOfYear, dateEqual, isEnabled, isToday } from './utils';
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
    }
    get selected() {
        const { value, selectWeek, day } = this.props;
        if (selectWeek && value) {
            return getWeekOfYear(value) === getWeekOfYear(day);
        }
        return dateEqual(value, day);
    }
    get current() {
        return this.props.day.getMonth() === this.props.date.getMonth();
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
        return (React.createElement(StyledDay, { className: selected ? 'value selected' : 'value', selected: selected, current: current, disabled: !enabled, today: today, onClick: this.onSelectDay }, day.getDate()));
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
}
//# sourceMappingURL=menu-day.js.map