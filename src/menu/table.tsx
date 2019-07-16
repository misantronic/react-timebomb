import * as React from 'react';
import {
    ReactTimebombProps,
    ReactTimebombState,
    ReactTimebombDate
} from '../typings';
import {
    startOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    getWeekdayNames,
    getWeekOfYear,
    isArray,
    dateEqual,
    isEnabled,
    isSameDay
} from '../utils';
import styled from 'styled-components';
import { WeekNum, Day } from './day';

interface MenuTableProps {
    className?: string;
    showTime: ReactTimebombState['showTime'];
    showConfirm: ReactTimebombProps['showConfirm'];
    showCalendarWeek: ReactTimebombProps['showCalendarWeek'];
    selectRange: ReactTimebombProps['selectRange'];
    value: ReactTimebombProps['value'];
    minDate: ReactTimebombProps['minDate'];
    maxDate: ReactTimebombProps['maxDate'];
    date: ReactTimebombState['date'];
    hoverDate?: ReactTimebombState['hoverDate'];
    selectedRange: ReactTimebombState['selectedRange'];
    mobile: ReactTimebombProps['mobile'];
    onSelectDay(date: Date): void;
    onHoverDays?(dates: Date[]): void;
    onSubmit(): void;
}

const Table = styled.table`
    width: 100%;
    height: 186px;
    table-layout: fixed;
    font-size: inherit;
    user-select: none;
    padding: 5px 10px;
    box-sizing: border-box;

    td.calendar-week {
        color: #aaa;
    }

    th.calendar-week {
        text-align: left;
        color: #aaa;
    }

    tr {
        th {
            padding: 3px 2px;
            width: 14.285714286%;
        }

        td {
            width: 14.285714286%;
        }
    }
`;

function getSelected(config: {
    day: Date;
    value: ReactTimebombDate;
    selectRange: ReactTimebombProps['selectRange'];
    hoverDays: Date[];
    showTime?: boolean;
}) {
    const { day, value, hoverDays, showTime, selectRange } = config;

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

export function MenuTable(props: MenuTableProps) {
    const {
        value,
        showCalendarWeek,
        selectRange,
        selectedRange,
        showConfirm,
        hoverDate,
        showTime,
        onSubmit
    } = props;
    const [hoverDays, setHoverDays] = React.useState<Date[]>(
        getDefaultHoverDays()
    );
    const [selectedDates, setSelectedDates] = React.useState<Date[]>([]);
    const { current: weekdayNames } = React.useRef(getWeekdayNames());
    const [sun, mon, tue, wed, thu, fri, sat] = weekdayNames;
    const className = ['month', props.className]
        .filter(c => Boolean(c))
        .join(' ');

    const monthMatrix = React.useMemo(() => {
        const date = getDate(props.date);
        const dateMonth = date.getMonth();
        const dateYear = date.getFullYear();
        const weeks: (Date)[][] = [];

        let base = startOfMonth(date);
        let week = 0;

        while (
            startOfWeek(base).getMonth() === dateMonth ||
            endOfWeek(base).getMonth() === dateMonth
        ) {
            const weekStart = startOfWeek(
                new Date(dateYear, dateMonth, week++ * 7 + 1)
            );

            weeks.push([
                weekStart,
                addDays(weekStart, 1),
                addDays(weekStart, 2),
                addDays(weekStart, 3),
                addDays(weekStart, 4),
                addDays(weekStart, 5),
                addDays(weekStart, 6)
            ]);

            base = addDays(base, 7);
        }

        return weeks;
    }, [getCacheKey()]);

    React.useEffect(() => {
        if (props.onHoverDays) {
            props.onHoverDays(hoverDays);
        }
    }, [hoverDays]);

    React.useEffect(() => {
        setSelectedDates(
            monthMatrix.reduce((memo, dates) => {
                memo.push(
                    ...dates.filter(day =>
                        getSelected({
                            day,
                            value,
                            selectRange,
                            hoverDays,
                            showTime
                        })
                    )
                );

                return memo;
            }, [])
        );
    }, [monthMatrix, hoverDays]);

    function getDefaultHoverDays() {
        if (!hoverDate) {
            return [];
        }

        if (isArray(value)) {
            return [value[0], hoverDate];
        }

        return [];
    }

    function getCacheKey() {
        const date = getDate(props.date);
        const dateMonth = date.getMonth();
        const dateYear = date.getFullYear();

        // cache
        return `${dateMonth}-${dateYear}`;
    }

    function getDate(date: ReactTimebombDate) {
        return (isArray(date) ? date[selectedRange] : date)!;
    }

    function onSelectDay(date: Date): void {
        props.onSelectDay(date);

        if (!showConfirm && !selectRange) {
            onSubmit();
        }
    }

    function onDayMouseEnter(day: Date) {
        if (typeof selectRange === 'number') {
            const days = Array(selectRange)
                .fill(null)
                .map((_, i) => addDays(day, i));

            setHoverDays(days);
        } else if (selectRange === 'week') {
            const firstDay = startOfWeek(day);
            const days = Array(7)
                .fill(null)
                .map((_, i) => addDays(firstDay, i));

            setHoverDays(days);
        } else {
            setHoverDays([day]);
        }
    }

    function onDayMouseLeave() {
        setHoverDays([]);
    }

    return (
        <Table className={className} cellSpacing={0} cellPadding={0}>
            <thead>
                <tr>
                    {showCalendarWeek && <th className="calendar-week" />}
                    <th>{mon}</th>
                    <th>{tue}</th>
                    <th>{wed}</th>
                    <th>{thu}</th>
                    <th>{fri}</th>
                    <th>{sat}</th>
                    <th>{sun}</th>
                </tr>
            </thead>
            <tbody>
                {monthMatrix.map(dates => {
                    const weekNum = getWeekOfYear(dates[0]);
                    const selected = dates.some(day =>
                        selectedDates.some(d => isSameDay(d, day))
                    );
                    const selectedStart = dates.some(day =>
                        dateEqual(selectedDates[0], day)
                    );
                    const selectedEnd = dates.some(day =>
                        dateEqual(selectedDates[selectedDates.length - 1], day)
                    );

                    const className = [
                        'day',
                        selected && 'selected',
                        selectedStart && 'selected-start',
                        selectedEnd && 'selected-end'
                    ]
                        .filter(c => c)
                        .join(' ');

                    return (
                        <tr key={weekNum} className={className}>
                            {showCalendarWeek && (
                                <td className="calendar-week">
                                    <WeekNum
                                        day={dates[0]}
                                        onClick={onSelectDay}
                                    >
                                        {weekNum}
                                    </WeekNum>
                                </td>
                            )}
                            {dates.map(day => {
                                const hover = hoverDays.some(hoverDay =>
                                    dateEqual(hoverDay, day)
                                );
                                const selected = selectedDates.some(d =>
                                    isSameDay(d, day)
                                );
                                const selectedStart = dateEqual(
                                    selectedDates[0],
                                    day
                                );
                                const selectedEnd = dateEqual(
                                    selectedDates[selectedDates.length - 1],
                                    day
                                );
                                const className = [
                                    'day',
                                    selected && 'selected',
                                    selectedStart && 'selected-start',
                                    selectedEnd && 'selected-end'
                                ]
                                    .filter(c => c)
                                    .join(' ');

                                return (
                                    <td
                                        key={day.toISOString()}
                                        className={className}
                                    >
                                        <Day
                                            day={day}
                                            hover={hover}
                                            selected={selected}
                                            selectedStart={selectedStart}
                                            selectedEnd={selectedEnd}
                                            date={props.date}
                                            minDate={props.minDate}
                                            maxDate={props.maxDate}
                                            showTime={props.showTime}
                                            onSelectDay={onSelectDay}
                                            onMouseEnter={onDayMouseEnter}
                                            onMouseLeave={onDayMouseLeave}
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
}
