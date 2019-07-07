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
    dateEqual
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
    selectedRange: ReactTimebombState['selectedRange'];
    mobile: ReactTimebombProps['mobile'];
    onSelectDay(date: Date): void;
    onHoverDays?(dates: Date[]): void;
    onSubmit(): void;
}

const Table = styled.table`
    width: 100%;
    height: 186px;
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

export function MenuTable(props: MenuTableProps) {
    const {
        showCalendarWeek,
        selectRange,
        selectedRange,
        showConfirm,
        onSubmit
    } = props;
    const [hoverDays, setHoverDays] = React.useState<Date[]>([]);
    const [weekdayNames] = React.useState(getWeekdayNames());
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

                    return (
                        <tr key={weekNum}>
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
                            {dates.map(date => {
                                return (
                                    <td
                                        className="day"
                                        key={date.toISOString()}
                                    >
                                        <Day
                                            day={date}
                                            hoverDays={hoverDays}
                                            hover={hoverDays.some(day =>
                                                dateEqual(day, date)
                                            )}
                                            date={props.date}
                                            value={props.value}
                                            minDate={props.minDate}
                                            maxDate={props.maxDate}
                                            selectRange={props.selectRange}
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
