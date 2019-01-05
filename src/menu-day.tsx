import * as React from 'react';
import { getWeekOfYear, dateEqual, isEnabled, isToday, isArray } from './utils';
import styled from 'styled-components';
import { MenuProps } from './menu';

interface DayProps {
    day: Date;
    hoverDay?: Date;
    value: MenuProps['value'];
    date: MenuProps['date'];
    selectWeek: MenuProps['selectWeek'];
    selectRange: MenuProps['selectRange'];
    minDate: MenuProps['minDate'];
    maxDate: MenuProps['maxDate'];
    showTime: MenuProps['showTime'];
    onSelectDay: MenuProps['onSelectDay'];
    onMouseEnter(day: Date): void;
    onMouseLeave(day: Date): void;
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
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    private get selected() {
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

    private get current() {
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
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
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

    private onMouseEnter() {
        this.props.onMouseEnter(this.props.day);
    }

    private onMouseLeave() {
        this.props.onMouseLeave(this.props.day);
    }
}

interface WeekNumProps {
    day: Date;
    onClick(day: Date): void;
}

export class WeekNum extends React.PureComponent<WeekNumProps> {
    constructor(props: WeekNumProps) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    public render() {
        return <div onClick={this.onClick}>{this.props.children}</div>;
    }

    private onClick() {
        this.props.onClick(this.props.day);
    }
}
