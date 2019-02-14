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

export function Day(props: DayProps) {
    const {
        day,
        date,
        value,
        selectWeek,
        selectRange,
        hoverDay,
        minDate,
        maxDate
    } = props;
    const [current, setCurrent] = React.useState(false);
    const [enabled, setEnabled] = React.useState(true);
    const [selected, setSelected] = React.useState(false);
    const [today, setToday] = React.useState(false);

    React.useEffect(() => {
        setCurrent(getCurrent());
        setSelected(getSelected());
    });

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

        return dateEqual(value, day, props.showTime);
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
