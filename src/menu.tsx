import * as React from 'react';
import styled, { css } from 'styled-components';
import { ReactTimebombState, ReactTimebombProps } from '.';
import {
    isEnabled,
    validateDate,
    isToday,
    getMonthNames,
    getWeekOfYear,
    startOfWeek,
    addDays,
    startOfMonth,
    endOfWeek,
    dateEqual
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
    onSelectDay(date: Date): void;
    onSelectYear(date: Date): void;
    onSelectMonth(date: Date): void;
    onSelectTime(time: string): void;
    onSubmit(): void;
}

interface StyledDayProps {
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

const MonthAndYearContainer = styled.div`
    display: flex;
    height: 220px;
`;

const MonthsContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: row;
    flex-wrap: wrap;
    align-self: flex-start;
    align-items: flex-start;
    padding: 10px;

    button {
        width: 33%;
        font-size: 16px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        min-height: 46px;
        border: none;
        margin: 0 0 4px;
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

interface DayProps extends MenuProps {
    day: Date;
}

class Day extends React.PureComponent<DayProps> {
    constructor(props: DayProps) {
        super(props);

        this.onSelectDay = this.onSelectDay.bind(this);
    }

    private get selected() {
        const { value, selectWeek, day } = this.props;

        if (selectWeek && value) {
            return getWeekOfYear(value) === getWeekOfYear(day);
        }

        return dateEqual(value, day);
    }

    public render() {
        const { day, date } = this.props;
        const current = day.getMonth() === date.getMonth();
        const enabled = isEnabled('day', day, this.props);
        const today = isToday(day);
        const selected = this.selected;

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

    private onSelectDay() {
        this.props.onSelectDay(this.props.day);
    }
}

export class Menu extends React.PureComponent<MenuProps> {
    private get now(): Date {
        return new Date();
    }

    private monthMatrixCache = new Map<string, (Date[])[]>();

    private get monthMatrix(): (Date[])[] {
        const { date } = this.props;
        const dateMonth = date.getMonth();
        const dateYear = date.getFullYear();

        // cache
        const cacheKey = `${dateMonth}-${dateYear}`;
        const cached = this.monthMatrixCache.get(cacheKey);

        if (cached) {
            return cached;
        }

        // generate
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

        this.monthMatrixCache.set(cacheKey, weeks);

        return weeks;
    }

    private get fullYears() {
        const { minDate, maxDate } = this.props;
        const year = this.props.date.getFullYear();

        if (minDate && !maxDate) {
            const currentYear = minDate.getFullYear();

            return Array(120)
                .fill(undefined)
                .map((_, i) => {
                    const date = new Date(minDate);

                    date.setFullYear(currentYear + i);

                    const enabled = isEnabled('year', date, this.props);
                    const selected = year === date.getFullYear();

                    return { date, enabled, selected };
                })
                .filter(obj => obj.enabled);
        } else if (!minDate && maxDate) {
            const currentYear = maxDate.getFullYear();

            return Array(120)
                .fill(undefined)
                .map((_, i) => {
                    const date = new Date(maxDate);

                    date.setFullYear(currentYear - i);

                    const enabled = isEnabled('year', date, this.props);
                    const selected = year === date.getFullYear();

                    return { date, enabled, selected };
                })
                .filter(obj => obj.enabled)
                .reverse();
        } else if (minDate && maxDate) {
            const minYear = minDate.getFullYear();
            const maxYear = maxDate.getFullYear();
            const array: {
                date: Date;
                enabled: boolean;
                selected: boolean;
            }[] = [];

            for (let i = maxYear; i >= minYear; i--) {
                const date = new Date(maxDate);

                date.setFullYear(i);

                const enabled = isEnabled('year', date, this.props);
                const selected = year === date.getFullYear();

                array.push({ date, enabled, selected });
            }

            return array.reverse();
        } else {
            const currentDate = this.now;
            const currentYear = currentDate.getFullYear();

            return Array(120)
                .fill(undefined)
                .map((_, i) => {
                    const date = new Date(currentDate);

                    date.setFullYear(currentYear - i);

                    const enabled = isEnabled('year', date, this.props);
                    const selected = year === date.getFullYear();

                    return { date, enabled, selected };
                })
                .filter(obj => obj.enabled)
                .reverse();
        }
    }

    constructor(props: MenuProps) {
        super(props);

        this.onSelectDay = this.onSelectDay.bind(this);
        this.onSelectMonth = this.onSelectMonth.bind(this);
        this.onSelectYear = this.onSelectYear.bind(this);
    }

    public render(): React.ReactNode {
        const { mode, showConfirm } = this.props;

        switch (mode) {
            case 'year':
            case 'months':
                return (
                    <MonthAndYearContainer>
                        {this.renderMenuMonths()}
                        {this.renderMenuYear()}
                    </MonthAndYearContainer>
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
        return (
            <YearContainer ref={this.onYearContainer} className="years">
                {this.fullYears
                    .map(({ date, selected }) => {
                        const fullYear = date.getFullYear();
                        const dateStr = date.toISOString();

                        return (
                            <Button
                                key={dateStr}
                                tabIndex={-1}
                                className={selected ? 'selected' : undefined}
                                selected={selected}
                                data-date={dateStr}
                                onClick={this.onSelectYear}
                            >
                                {fullYear}
                            </Button>
                        );
                    })
                    .reverse()}
            </YearContainer>
        );
    }

    private renderMenuMonths(): React.ReactNode {
        const { date, value } = this.props;
        const months = getMonthNames(true);
        const month = value && value.getMonth();
        const year = value && value.getFullYear();

        return (
            <MonthsContainer className="months">
                {months.map((str, i) => {
                    const newDate = new Date(date);

                    newDate.setMonth(i);

                    const enabled = isEnabled('month', newDate, this.props);
                    const selected =
                        month === newDate.getMonth() &&
                        year === newDate.getFullYear();

                    return (
                        <Button
                            key={str}
                            tabIndex={-1}
                            className={selected ? 'selected' : undefined}
                            selected={selected}
                            disabled={!enabled}
                            data-date={newDate.toISOString()}
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
        const { showCalendarWeek, selectWeek } = this.props;

        return (
            <Table
                className="month"
                selectWeek={selectWeek}
                cellSpacing={0}
                cellPadding={0}
            >
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
                    {this.monthMatrix.map(dates => {
                        const weekNum = getWeekOfYear(dates[0]);

                        return (
                            <tr key={weekNum}>
                                {showCalendarWeek && (
                                    <td className="calendar-week">{weekNum}</td>
                                )}
                                {dates.map(date => (
                                    <td
                                        className="day"
                                        key={date.toISOString()}
                                    >
                                        <Day
                                            {...this.props}
                                            day={date}
                                            onSelectDay={this.onSelectDay}
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

    private renderConfirm(): React.ReactNode {
        const { valueText, format } = this.props;
        const validDate = validateDate(valueText, format);
        const isValid = validDate
            ? isEnabled('day', validDate, this.props)
            : false;

        return (
            <Confirm>
                <Button
                    tabIndex={-1}
                    disabled={!isValid}
                    onClick={() => this.props.onSubmit()}
                >
                    Ok
                </Button>
            </Confirm>
        );
    }

    private onSelectDay(date: Date): void {
        const { onSelectDay, showConfirm, onSubmit } = this.props;

        onSelectDay(date);

        if (!showConfirm) {
            onSubmit();
        }
    }

    private onSelectMonth(e: React.MouseEvent<HTMLButtonElement>) {
        const date = new Date(e.currentTarget.getAttribute(
            'data-date'
        ) as string);

        setTimeout(() => this.props.onSelectMonth(date), 0);
    }

    private onSelectYear(e: React.MouseEvent<HTMLButtonElement>) {
        const date = new Date(e.currentTarget.getAttribute(
            'data-date'
        ) as string);

        setTimeout(() => this.props.onSelectYear(date), 0);
    }

    private onYearContainer(el: HTMLDivElement | null) {
        if (el) {
            const selected = el.querySelector('.selected');

            if (selected) {
                selected.scrollIntoView();
                el.scrollBy({ top: -10 });
            }
        }
    }
}
