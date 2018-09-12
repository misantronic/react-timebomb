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
    endOfWeek,
    endOfYear
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

const MonthsContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    padding: 10px;

    button {
        width: 33%;
        font-size: 16px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 3.13;
        border: none;
        margin: 0;
        padding: 0;
    }
`;

const MonthContainer = styled.div`
    padding: 0 0 10px;
`;

const YearContainer = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    border-left: solid 1px #e6e6e6;
    padding: 10px;
    flex: 0 0 90px;

    button {
        width: 100%;
        font-size: 16px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        border: none;
        padding: 6px 0;
        margin: 0 0 4px;
        min-height: 46px;
    }
`;

const Confirm = styled.div`
    width: 100%;
    text-align: center;
    padding: 10px 0 0;

    button {
        padding: 3px 28px;
    }
`;

const Table = styled.table`
    width: 100%;
    font-size: 13px;
    user-select: none;
    padding: 0 10px;
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
            case 'months':
                return (
                    <div style={{ display: 'flex' }}>
                        {this.renderMenuMonths()}
                        {this.renderMenuYear()}
                    </div>
                );
            case 'month':
                return (
                    <MonthContainer>
                        {this.renderMonth()}
                        {showConfirm && this.renderConfirm()}
                    </MonthContainer>
                );
        }
    }

    private renderMenuYear(): React.ReactNode {
        const { date: currentDate } = this.props;
        const currentYear = this.now.getFullYear();
        const year = currentDate.getFullYear();

        return (
            <YearContainer>
                {Array(100)
                    .fill(undefined)
                    .map((_, i) => {
                        const newDate = new Date(currentDate);

                        newDate.setFullYear(currentYear - i);

                        const disabled = isDisabled(
                            endOfYear(newDate),
                            this.props
                        );
                        const selected = year === newDate.getFullYear();

                        return (
                            <Button
                                key={i}
                                tabIndex={-1}
                                className={selected ? 'selected' : undefined}
                                selected={selected}
                                disabled={disabled}
                                data-date={newDate.toString()}
                                onClick={this.onSelectYear}
                            >
                                {currentYear - i}
                            </Button>
                        );
                    })}
            </YearContainer>
        );
    }

    private renderMenuMonths(): React.ReactNode {
        const { date, value } = this.props;
        const months = getMonthNames(true);
        const month = value && value.getMonth();
        const year = value && value.getFullYear();

        return (
            <MonthsContainer>
                {months.map((str, i) => {
                    const newDate = new Date(date);

                    newDate.setMonth(i);

                    const disabled = isDisabled(newDate, this.props);
                    const selected =
                        month === newDate.getMonth() &&
                        year === newDate.getFullYear();

                    return (
                        <Button
                            key={str}
                            tabIndex={-1}
                            className={selected ? 'selected' : undefined}
                            selected={selected}
                            disabled={disabled}
                            data-date={newDate.toString()}
                            onClick={this.onSelectMonth}
                        >
                            {str}
                        </Button>
                    );
                })}
            </MonthsContainer>
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
                className={selected ? 'selected' : undefined}
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

    @bind
    private onSelectMonth(e: React.MouseEvent<HTMLButtonElement>) {
        const date = new Date(e.currentTarget.getAttribute(
            'data-date'
        ) as string);

        setTimeout(() => this.props.onSelectMonth(date), 0);
    }

    @bind
    private onSelectYear(e: React.MouseEvent<HTMLButtonElement>) {
        const date = new Date(e.currentTarget.getAttribute(
            'data-date'
        ) as string);

        setTimeout(() => this.props.onSelectYear(date), 0);
    }
}
