import * as React from 'react';
import { getWeekOfYear, dateEqual, isEnabled, isToday } from './utils';
import styled from 'styled-components';
import { MenuProps } from './menu';

interface DayProps {
    day: Date;
    value: MenuProps['value'];
    date: MenuProps['date'];
    selectWeek: MenuProps['selectWeek'];
    minDate: MenuProps['minDate'];
    maxDate: MenuProps['maxDate'];
    onSelectDay: MenuProps['onSelectDay'];
}

interface DayState {
    current: boolean;
    enabled: boolean;
    today: boolean;
    selected: boolean;
}

interface StyledDayProps {
    selected?: boolean;
    disabled?: boolean;
    current: boolean;
    today: boolean;
}

const Flex = styled.div`
    display: flex;
    align-items: center;
`;

const StyledDay = styled(Flex)`
    padding: 8px 2px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: ${(props: StyledDayProps) => (props.current ? 'inherit' : '#aaa')};
    background-color: ${(props: StyledDayProps) =>
        props.selected
            ? '#ddd'
            : props.today
            ? 'rgba(172, 206, 247, 0.4)'
            : 'transparent'};
    font-weight: ${(props: StyledDayProps) =>
        props.selected ? 'bold' : 'normal'};
    pointer-events: ${(props: StyledDayProps) =>
        props.disabled ? 'none' : 'auto'};
    user-select: none;
    opacity: ${(props: StyledDayProps) => (props.disabled ? 0.3 : 1)};

    &:hover {
        background-color: ${(props: StyledDayProps) =>
            props.selected ? '#ddd' : '#eee'};
    }
`;

export class Day extends React.PureComponent<DayProps, DayState> {
    constructor(props: DayProps) {
        super(props);

        this.state = {
            current: false,
            enabled: true,
            today: false,
            selected: false
        };

        this.onSelectDay = this.onSelectDay.bind(this);
    }

    private get selected() {
        const { value, selectWeek, day } = this.props;

        if (selectWeek && value) {
            return getWeekOfYear(value) === getWeekOfYear(day);
        }

        return dateEqual(value, day);
    }

    private get current() {
        return this.props.day.getMonth() === this.props.date.getMonth();
    }

    private get enabled() {
        return isEnabled('day', this.props.day, this.props);
    }

    private get today() {
        return isToday(this.props.day);
    }

    public componentDidMount() {
        this.updateState();
    }

    public componentDidUpdate(prevProps: DayProps) {
        this.updateState(prevProps);
    }

    public render() {
        const { day } = this.props;
        const { selected, current, enabled, today } = this.state;

        return (
            <StyledDay
                className={selected ? 'value selected' : 'value'}
                selected={selected}
                current={current}
                disabled={!enabled}
                today={today}
                onClick={this.onSelectDay}
            >
                {day.getDate()}
            </StyledDay>
        );
    }

    private updateState(prevProps: Partial<DayProps> = {}) {
        const { day, minDate, maxDate } = this.props;
        const dayChanged = !dateEqual(prevProps.day, day);
        const minMaxChanged =
            !dateEqual(prevProps.minDate, minDate) ||
            !dateEqual(prevProps.maxDate, maxDate);

        this.setState({
            current: this.current,
            enabled:
                dayChanged || minMaxChanged ? this.enabled : this.state.enabled,
            today: dayChanged ? this.today : this.state.today,
            selected: this.selected
        });
    }

    private onSelectDay() {
        this.props.onSelectDay(this.props.day);
    }
}
