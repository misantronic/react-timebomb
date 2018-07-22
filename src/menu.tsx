import { bind } from 'lodash-decorators';
import * as React from 'react';
import styled, { css } from 'styled-components';
import { ReactTimebombState, ReactTimebombProps } from '.';
import {
    isDisabled,
    validateDate,
    isToday,
    getMonthNames,
    getWeekOfYear,
    startOfWeek,
    addDays,
    startOfMonth,
    endOfWeek
} from './utils';
import { Button } from './button';

interface MenuProps {
    showTime: ReactTimebombState['showTime'];
    showConfirm: ReactTimebombProps['showConfirm'];
    showCalendarWeek: ReactTimebombProps['showCalendarWeek'];
    selectWeek: ReactTimebombProps['selectWeek'];
    value: ReactTimebombProps['value'];
    valueText: ReactTimebombState['valueText'];
    minDate: ReactTimebombProps['minDate'];
    maxDate: ReactTimebombProps['maxDate'];
    date: ReactTimebombState['date'];
    mode: ReactTimebombState['mode'];
    format: string;
    onToggle(): void;
    onSelectDay(date: Date): void;
    onSelectYear(date: Date): void;
    onSelectMonth(date: Date): void;
    onSelectTime(time: string): void;
    onSubmit(onToggle: () => void): void;
}

interface DayProps {
    selected?: boolean;
    disabled?: boolean;
    current: boolean;
    today: boolean;
}

interface TableProps {
    selectWeek?: boolean;
}

const Flex = styled.div`
    display: flex;
    align-items: center;
`;

const MenuContainer = styled(Flex)`
    flex-direction: column;

    button {
        width: 100%;
    }
`;

const Confirm = styled.div`
    width: 100%;
    text-align: center;
    margin-top: 15px;

    button {
        padding: 3px 28px;
    }
`;

const Table = styled.table`
    margin-bottom: 5px;
    width: 100%;
    font-size: 13px;
    user-select: none;

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
        }
    }
`;

const Day = styled(Flex)`
    padding: 3px 2px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: ${(props: DayProps) => (props.current ? '#000' : '#aaa')};
    background-color: ${(props: DayProps) =>
        props.selected
            ? '#ddd'
            : props.today
                ? 'rgba(172, 206, 247, 0.4)'
                : 'transparent'};
    font-weight: ${(props: DayProps) => (props.selected ? 'bold' : 'normal')};
    pointer-events: ${(props: DayProps) => (props.disabled ? 'none' : 'auto')};
    user-select: none;
    opacity: ${(props: DayProps) => (props.disabled ? 0.3 : 1)};

    &:hover {
        background-color: ${(props: DayProps) =>
            props.selected ? '#ddd' : '#eee'};
    }
`;

export class Menu extends React.PureComponent<MenuProps> {
    private get now(): Date {
        return new Date();
    }

    private get monthMatrix(): (Date[])[] {
        const { date } = this.props;
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
    }

    public render(): React.ReactNode {
        const { mode, showConfirm } = this.props;

        switch (mode) {
            case 'year':
                return this.renderMenuYear();
            case 'months':
                return this.renderMenuMonths();
            case 'month':
                return (
                    <>
                        {this.renderMonth()}
                        {showConfirm && this.renderConfirm()}
                    </>
                );
        }
    }

    private renderMenuYear(): React.ReactNode {
        const { date: currentDate } = this.props;
        const currentYear = this.now.getFullYear();

        return (
            <MenuContainer>
                {Array(100)
                    .fill(undefined)
                    .map((_, i) => {
                        const newDate = new Date(currentDate);

                        newDate.setFullYear(currentYear - i);

                        const disabled = isDisabled(newDate, this.props);

                        return (
                            <Button
                                key={i}
                                tabIndex={-1}
                                style={{ margin: 5 }}
                                disabled={disabled}
                                onClick={() => {
                                    setTimeout(
                                        () => this.props.onSelectYear(newDate),
                                        0
                                    );
                                }}
                            >
                                {currentYear - i}
                            </Button>
                        );
                    })}
            </MenuContainer>
        );
    }

    private renderMenuMonths(): React.ReactNode {
        const { date } = this.props;
        const months = getMonthNames();

        return (
            <MenuContainer>
                {months.map((str, i) => {
                    const newDate = new Date(date);

                    newDate.setMonth(i);

                    const disabled = isDisabled(newDate, this.props);

                    return (
                        <Button
                            key={str}
                            tabIndex={-1}
                            style={{ margin: 5 }}
                            disabled={disabled}
                            onClick={() =>
                                setTimeout(
                                    () => this.props.onSelectMonth(newDate),
                                    0
                                )
                            }
                        >
                            {str}
                        </Button>
                    );
                })}
            </MenuContainer>
        );
    }

    private renderMonth(): React.ReactNode {
        const { monthMatrix } = this;
        const { showCalendarWeek, selectWeek } = this.props;

        return (
            <Table selectWeek={selectWeek} cellSpacing={0} cellPadding={0}>
                <thead>
                    <tr>
                        {showCalendarWeek && <th className="calendar-week" />}
                        <th>Mo</th>
                        <th>Di</th>
                        <th>Mi</th>
                        <th>Do</th>
                        <th>Fr</th>
                        <th>Sa</th>
                        <th>So</th>
                    </tr>
                </thead>
                <tbody>
                    {monthMatrix.map((dates, i) => (
                        <tr key={i}>
                            {showCalendarWeek && (
                                <td className="calendar-week">
                                    {getWeekOfYear(dates[0])}
                                </td>
                            )}
                            {dates.map((date, j) => (
                                <td className="day" key={j}>
                                    {this.renderDay(date)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    }

    private renderDay(day: Date): React.ReactNode {
        const num = day.getDate();
        const { value, date, selectWeek } = this.props;
        let selected =
            value &&
            day.getDate() === value.getDate() &&
            day.getMonth() === value.getMonth();
        const current = day.getMonth() === date.getMonth();
        const disabled = isDisabled(day, this.props);
        const today = isToday(day);

        if (selectWeek && value) {
            selected = getWeekOfYear(value) === getWeekOfYear(day);
        }

        return (
            <Day
                data-date={day.toString()}
                selected={selected}
                current={current}
                disabled={disabled}
                today={today}
                onClick={this.onSelectDay}
            >
                {num}
            </Day>
        );
    }

    private renderConfirm(): React.ReactNode {
        const { valueText, format } = this.props;
        const validDate = validateDate(valueText, format);

        return (
            <Confirm>
                <Button
                    tabIndex={-1}
                    disabled={validDate === null}
                    onClick={() => this.props.onSubmit(this.props.onToggle)}
                >
                    Ok
                </Button>
            </Confirm>
        );
    }

    @bind
    private onSelectDay(e: React.SyntheticEvent<HTMLDivElement>): void {
        const date = new Date(e.currentTarget.getAttribute('data-date')!);

        this.props.onSelectDay(date);
    }
}
