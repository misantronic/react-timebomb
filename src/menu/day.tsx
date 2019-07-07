import * as React from 'react';
import {
    getWeekOfYear,
    dateEqual,
    isEnabled,
    isToday,
    isArray
} from '../utils';
import styled from 'styled-components';
import { ReactTimebombMenuProps } from '../typings';

interface DayProps {
    day: Date;
    hoverDays: Date[];
    hover: boolean;
    value: ReactTimebombMenuProps['value'];
    date: ReactTimebombMenuProps['date'];
    selectRange: ReactTimebombMenuProps['selectRange'];
    minDate: ReactTimebombMenuProps['minDate'];
    maxDate: ReactTimebombMenuProps['maxDate'];
    showTime: ReactTimebombMenuProps['showTime'];
    onSelectDay: ReactTimebombMenuProps['onSelectDay'];
    onMouseEnter(day: Date): void;
    onMouseLeave(day: Date): void;
}

interface StyledDayProps {
    selected?: boolean;
    disabled?: boolean;
    current: boolean;
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
    background-color: transparent;
    font-weight: ${(props: StyledDayProps) =>
        props.selected ? 'bold' : 'normal'};
    pointer-events: ${(props: StyledDayProps) =>
        props.disabled ? 'none' : 'auto'};
    user-select: none;
    opacity: ${(props: StyledDayProps) => (props.disabled ? 0.3 : 1)};

    &.today {
        background-color: rgba(172, 206, 247, 0.4);
    }

    &.hover {
        background-color: #eee;
    }

    &.selected {
        background-color: #ddd;
    }
`;

export function Day(props: DayProps) {
    const {
        day,
        date,
        value,
        selectRange,
        hover,
        hoverDays,
        minDate,
        maxDate,
        showTime
    } = props;
    const [enabled, setEnabled] = React.useState(true);
    const [today, setToday] = React.useState(false);
    const current = React.useMemo(getCurrent, [date, day, showTime]);
    const selected = React.useMemo(getSelected, [
        day,
        value,
        selectRange,
        hoverDays
    ]);

    React.useEffect(() => {
        setToday(isToday(day));
    }, [day.getTime()]);

    React.useEffect(() => {
        setEnabled(isEnabled('day', day, props));
    }, [
        minDate ? minDate.getTime() : minDate,
        maxDate ? maxDate.getTime() : maxDate
    ]);

    function getSelected() {
        if (value) {
            if (selectRange === 'week') {
                const dayWeekOfYear = getWeekOfYear(day);

                if (isArray(value)) {
                    return value.some(v => getWeekOfYear(v) === dayWeekOfYear);
                }

                return getWeekOfYear(value) === dayWeekOfYear;
            }

            if (selectRange && isArray(value)) {
                const [minDate, maxDate] = value;

                if (value.length === 1 && hoverDays.length) {
                    const firstHover = hoverDays[0];
                    const lastHover = hoverDays[hoverDays.length - 1];

                    return isEnabled('day', day, {
                        minDate: minDate < firstHover ? minDate : firstHover,
                        maxDate: minDate > lastHover ? minDate : lastHover
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

        return dateEqual(value, day, showTime);
    }

    function getCurrent() {
        const dayMonth = day.getMonth();

        if (isArray(date)) {
            return date.some(d => d.getMonth() === dayMonth);
        }

        if (date) {
            return dayMonth === date.getMonth();
        }

        return false;
    }

    function onSelectDay() {
        props.onSelectDay(day);
    }

    function onMouseEnter() {
        props.onMouseEnter(day);
    }

    function onMouseLeave() {
        props.onMouseLeave(day);
    }

    function getClassNames() {
        const classes = ['value'];

        if (selected) {
            classes.push('selected');
        }

        if (today) {
            classes.push('today');
        }

        if (hover) {
            classes.push('hover');
        }

        return classes.join(' ');
    }

    return (
        <StyledDay
            className={getClassNames()}
            selected={selected}
            current={current}
            disabled={!enabled}
            onClick={onSelectDay}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {day.getDate()}
        </StyledDay>
    );
}

interface WeekNumProps {
    day: Date;
    children: React.ReactNode;
    onClick(day: Date): void;
}

export function WeekNum(props: WeekNumProps) {
    function onClick() {
        props.onClick(props.day);
    }

    return <div onClick={onClick}>{props.children}</div>;
}
