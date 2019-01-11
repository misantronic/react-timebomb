import * as React from 'react';
import styled, { css } from 'styled-components';
import { ReactTimebombState, ReactTimebombProps } from '.';
import {
    isEnabled,
    validateDate,
    getMonthNames,
    getWeekOfYear,
    startOfWeek,
    addDays,
    startOfMonth,
    endOfWeek,
    getAttribute,
    isArray,
    dateEqual,
    getWeekdayNames
} from './utils';
import { Button } from './button';
import { Day, WeekNum } from './menu-day';
import { ReactTimebombDate } from './typings';

export interface MenuProps {
    showTime: ReactTimebombState['showTime'];
    showDate: ReactTimebombState['showDate'];
    showConfirm: ReactTimebombProps['showConfirm'];
    showCalendarWeek: ReactTimebombProps['showCalendarWeek'];
    selectWeek: ReactTimebombProps['selectWeek'];
    selectRange: ReactTimebombProps['selectRange'];
    value: ReactTimebombProps['value'];
    valueText: ReactTimebombState['valueText'];
    minDate: ReactTimebombProps['minDate'];
    maxDate: ReactTimebombProps['maxDate'];
    date: ReactTimebombState['date'];
    mode: ReactTimebombState['mode'];
    selectedRange: ReactTimebombState['selectedRange'];
    mobile: ReactTimebombProps['mobile'];
    format: string;
    onSelectDay(date: Date): void;
    onSelectYear(date: Date): void;
    onSelectMonth(date: Date): void;
    onSelectTime(time: string): void;
    onSubmit(): void;
}

interface MenuState {
    hoverDay?: Date;
}

interface TableProps {
    selectWeek?: boolean;
    mobile?: boolean;
}

const MonthAndYearContainer = styled.div`
    display: flex;
    height: ${(props: { mobile?: boolean }) =>
        props.mobile ? '100%' : '220px'};
`;

const MonthsContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: row;
    flex-wrap: wrap;
    align-self: flex-start;
    align-items: flex-start;
    padding: 10px;
    box-sizing: border-box;
    height: 100%;

    button {
        width: ${(props: { mobile?: boolean }) =>
            props.mobile ? 'calc(33% - 6px)' : '33%'};
        font-size: 16px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        min-height: 25%;
        border: none;
        margin: 0;
    }
`;

const MonthContainer = styled.div`
    flex: 1;
    padding: 0 0 10px;
    height: ${(props: { mobile?: boolean }) => (props.mobile ? '100' : 'auto')};
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
    height: 100%;
    font-size: inherit;
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
            width: 14.285714286%;
        }

        td {
            width: 14.285714286%;
        }
    }
`;

export class Menu extends React.PureComponent<MenuProps, MenuState> {
    private weekdayNames!: string[];
    private monthNames!: string[];

    private get now(): Date {
        return new Date();
    }

    private getDate(date: ReactTimebombDate) {
        return (isArray(date) ? date[this.props.selectedRange] : date)!;
    }

    private yearContainer: HTMLDivElement | null = null;
    private monthMatrixCache = new Map<string, (Date[])[]>();

    private get monthMatrix(): (Date[])[] {
        const date = this.getDate(this.props.date);
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
        const { value, minDate, maxDate } = this.props;
        const valueDate = this.getDate(value);
        const year = this.getDate(this.props.date).getFullYear();

        const getDateConfig = (date: Date, newYear: number) => {
            date = new Date(date);
            date.setFullYear(newYear);

            const enabled = isEnabled('year', date, this.props);
            const selected = year === newYear;

            if (value) {
                date.setSeconds(valueDate.getSeconds());
                date.setMinutes(valueDate.getMinutes());
                date.setHours(valueDate.getHours());
                date.setDate(valueDate.getDate());
                date.setMonth(valueDate.getMonth());
            }

            return { date, enabled, selected };
        };

        if (minDate && !maxDate) {
            const currentYear = minDate.getFullYear();

            return Array(120)
                .fill(undefined)
                .map((_, i) => getDateConfig(minDate, currentYear + i))
                .filter(obj => obj.enabled);
        } else if (!minDate && maxDate) {
            const currentYear = maxDate.getFullYear();

            return Array(120)
                .fill(undefined)
                .map((_, i) => getDateConfig(maxDate, currentYear - i))
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
                array.push(getDateConfig(maxDate, i));
            }

            return array.reverse();
        } else {
            const now = this.now;
            const currentDate = valueDate > now ? valueDate : now;
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

        this.state = {};

        this.onSelectDay = this.onSelectDay.bind(this);
        this.onSelectMonth = this.onSelectMonth.bind(this);
        this.onSelectYear = this.onSelectYear.bind(this);
        this.onYearContainer = this.onYearContainer.bind(this);
        this.onDayMouseEnter = this.onDayMouseEnter.bind(this);
        this.onDayMouseLeave = this.onDayMouseLeave.bind(this);

        this.weekdayNames = getWeekdayNames();
        this.monthNames = getMonthNames(true);
    }

    public componentDidUpdate(prevProps: MenuProps) {
        if (!dateEqual(prevProps.date, this.props.date)) {
            this.scrollToYear(64);
        }
    }

    public render(): React.ReactNode {
        const { mode, mobile, showDate, showConfirm } = this.props;

        if (showDate) {
            switch (mode) {
                case 'year':
                case 'month':
                    return (
                        <MonthAndYearContainer mobile={mobile}>
                            {this.renderMenuMonths()}
                            {this.renderMenuYear()}
                        </MonthAndYearContainer>
                    );
                case 'day':
                    return (
                        <MonthContainer mobile={mobile}>
                            {this.renderMonth()}
                            {showConfirm && this.renderConfirm()}
                        </MonthContainer>
                    );
            }
        }

        return null;
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
                                mobile={this.props.mobile}
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
        const { value, mobile } = this.props;
        const valueDate = this.getDate(value);
        const date = this.getDate(this.props.date);
        const month = value && valueDate.getMonth();
        const year = value && valueDate.getFullYear();

        return (
            <MonthsContainer mobile={mobile} className="months">
                {this.monthNames.map((str, i) => {
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
                            mobile={this.props.mobile}
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
        const { showCalendarWeek, selectWeek, mobile } = this.props;
        const { hoverDay } = this.state;
        const [sun, mon, tue, wed, thu, fri, sat] = this.weekdayNames;

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
                    {this.monthMatrix.map(dates => {
                        const weekNum = getWeekOfYear(dates[0]);

                        return (
                            <tr key={weekNum}>
                                {showCalendarWeek && (
                                    <td className="calendar-week">
                                        <WeekNum
                                            day={dates[0]}
                                            onClick={this.onSelectDay}
                                        >
                                            {weekNum}
                                        </WeekNum>
                                    </td>
                                )}
                                {dates.map(date => (
                                    <td
                                        className="day"
                                        key={date.toISOString()}
                                    >
                                        <Day
                                            day={date}
                                            hoverDay={hoverDay}
                                            date={this.props.date}
                                            value={this.props.value}
                                            minDate={this.props.minDate}
                                            maxDate={this.props.maxDate}
                                            selectWeek={this.props.selectWeek}
                                            selectRange={this.props.selectRange}
                                            showTime={this.props.showTime}
                                            onSelectDay={this.onSelectDay}
                                            onMouseEnter={this.onDayMouseEnter}
                                            onMouseLeave={this.onDayMouseLeave}
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
            ? isArray(validDate)
                ? validDate.every(v => isEnabled('day', v, this.props))
                : isEnabled('day', validDate, this.props)
            : false;

        return (
            <Confirm>
                <Button
                    tabIndex={-1}
                    disabled={!isValid}
                    mobile={this.props.mobile}
                    onClick={() => this.props.onSubmit()}
                >
                    Ok
                </Button>
            </Confirm>
        );
    }

    private scrollToYear = (() => {
        let timeout: NodeJS.Timeout;

        return (delay: number) => {
            clearTimeout(timeout);

            timeout = setTimeout(() => {
                if (this.yearContainer) {
                    const selected = this.yearContainer.querySelector(
                        '.selected'
                    );

                    if (selected) {
                        selected.scrollIntoView();
                        this.yearContainer.scrollBy({ top: -10 });
                    }
                }
            }, delay);
        };
    })();

    private onSelectDay(date: Date): void {
        const { onSelectDay, showConfirm, onSubmit } = this.props;

        onSelectDay(date);

        if (!showConfirm) {
            onSubmit();
        }
    }

    private onSelectMonth(e: React.MouseEvent<HTMLButtonElement>) {
        const date = new Date(getAttribute(e.currentTarget, 'data-date'));

        setTimeout(() => this.props.onSelectMonth(date), 0);
    }

    private onSelectYear(e: React.MouseEvent<HTMLButtonElement>) {
        const date = new Date(getAttribute(e.currentTarget, 'data-date'));

        setTimeout(() => this.props.onSelectYear(date), 0);
    }

    private onYearContainer(el: HTMLDivElement | null) {
        this.yearContainer = el;

        this.scrollToYear(0);
    }

    private onDayMouseEnter(day: Date) {
        if (this.props.selectRange) {
            this.setState({ hoverDay: day });
        }
    }

    private onDayMouseLeave() {
        if (this.props.selectRange) {
            this.setState({ hoverDay: undefined });
        }
    }
}
