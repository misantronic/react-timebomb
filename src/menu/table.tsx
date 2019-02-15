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
    isArray
} from '../utils';
import styled, { css } from 'styled-components';
import { WeekNum, Day } from './day';

interface MenuTableProps {
    showTime: ReactTimebombState['showTime'];
    showConfirm: ReactTimebombProps['showConfirm'];
    showCalendarWeek: ReactTimebombProps['showCalendarWeek'];
    selectWeek: ReactTimebombProps['selectWeek'];
    selectRange: ReactTimebombProps['selectRange'];
    value: ReactTimebombProps['value'];
    minDate: ReactTimebombProps['minDate'];
    maxDate: ReactTimebombProps['maxDate'];
    date: ReactTimebombState['date'];
    selectedRange: ReactTimebombState['selectedRange'];
    mobile: ReactTimebombProps['mobile'];
    onSelectDay(date: Date): void;
    onSubmit(): void;
}

interface TableProps {
    selectWeek?: boolean;
    mobile?: boolean;
}

const Table = styled.table`
    width: 100%;
    height: 100%;
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
        ${(props: TableProps) =>
            props.selectWeek
                ? css`
                      &:hover {
                          cursor: pointer;

                          td.day {
                              background-color: #eee;
                          }
                      }
                  `
                : ''};

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
        selectWeek,
        mobile,
        showConfirm,
        onSubmit
    } = props;
    const [hoverDay, setHoverDay] = React.useState<Date | undefined>(undefined);
    const [weekdayNames] = React.useState(getWeekdayNames());
    const [sun, mon, tue, wed, thu, fri, sat] = weekdayNames;

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

        if (!showConfirm) {
            onSubmit();
        }
    }

    function onDayMouseEnter(day: Date) {
        if (selectRange) {
            setHoverDay(day);
        }
    }

    function onDayMouseLeave() {
        if (selectRange) {
            setHoverDay(undefined);
        }
    }

    return (
        <Table
            className="month"
            selectWeek={selectWeek}
            mobile={mobile}
            cellSpacing={0}
            cellPadding={0}
        >
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
                            {dates.map(date => (
                                <td className="day" key={date.toISOString()}>
                                    <Day
                                        day={date}
                                        hoverDay={hoverDay}
                                        date={props.date}
                                        value={props.value}
                                        minDate={props.minDate}
                                        maxDate={props.maxDate}
                                        selectWeek={props.selectWeek}
                                        selectRange={props.selectRange}
                                        showTime={props.showTime}
                                        onSelectDay={onSelectDay}
                                        onMouseEnter={onDayMouseEnter}
                                        onMouseLeave={onDayMouseLeave}
                                    />
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
}
