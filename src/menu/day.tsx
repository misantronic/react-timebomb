import * as React from 'react';
import {
    getWeekOfYear,
    dateEqual,
    isEnabled,
    isToday,
    isArray
} from '../utils';
import styled from 'styled-components';
import { MenuProps } from '.';

interface DayProps {
    day: Date;
    hoverDays: Date[];
    hover: boolean;
    value: MenuProps['value'];
    date: MenuProps['date'];
    selectRange: MenuProps['selectRange'];
    minDate: MenuProps['minDate'];
    maxDate: MenuProps['maxDate'];
    showTime: MenuProps['showTime'];
    onSelectDay: MenuProps['onSelectDay'];
    onMouseEnter(day: Date): void;
    onMouseLeave(day: Date): void;
}

interface StyledDayProps {
    selected?: boolean;
    disabled?: boolean;
    current: boolean;
    today: boolean;
    hover: boolean;
    hoverDays: Date[];
}

function getBackgroundColor(props: StyledDayProps) {
    if (props.selected) {
        return '#ddd';
    }

    if (props.hover) {
        return '#eee';
    }

    if (props.today) {
        return 'rgba(172, 206, 247, 0.4)';
    }

    return 'transparent';
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
    background-color: ${getBackgroundColor};
    font-weight: ${(props: StyledDayProps) =>
        props.selected ? 'bold' : 'normal'};
    pointer-events: ${(props: StyledDayProps) =>
        props.disabled ? 'none' : 'auto'};
    user-select: none;
    opacity: ${(props: StyledDayProps) => (props.disabled ? 0.3 : 1)};
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

    return (
        <StyledDay
            className={selected ? 'value selected' : 'value'}
            selected={selected}
            current={current}
            hoverDays={hoverDays}
            hover={hover}
            disabled={!enabled}
            today={today}
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
