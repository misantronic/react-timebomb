import { bind } from 'lodash-decorators';
import * as React from 'react';
import styled from 'styled-components';
import { ReactTimebombState, ReactTimebombProps } from '.';
import { isDisabled, validateDate } from './utils';

interface MenuProps {
    showTime: ReactTimebombState['showTime'];
    showConfirm: ReactTimebombProps['showConfirm'];
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
}

const Flex = styled.div`
    display: flex;
    align-items: center;
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
`;

const Day = styled(Flex)`
    padding: 2px 0;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: ${(props: DayProps) => (props.current ? '#000' : '#aaa')};
    background-color: ${(props: DayProps) =>
        props.selected ? '#ddd' : 'transparent'};
    font-weight: ${(props: DayProps) => (props.selected ? 'bold' : 'normal')};
    pointer-events: ${(props: DayProps) => (props.disabled ? 'none' : 'auto')};
    user-select: none;
    opacity: ${(props: DayProps) => (props.disabled ? 0.3 : 1)};

    &:hover {
        background-color: ${(props: DayProps) =>
            props.selected ? '#ddd' : '#eee'};
    }
`;

function daysInMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getWeek(date: Date) {
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    return Math.ceil((date.getDate() + firstDay) / 7);
}

function getNextDay(week: (Date | null)[], index: number) {
    for (let i = index; i <= week.length; i++) {
        const date = week[i];

        if (date) {
            return new Date(date.getTime() - 1000 * 60 * 60 * 24 * (i - index));
        }
    }

    return null;
}

function getPrevDay(week: (Date | null)[], index: number) {
    for (let i = week.length - 1; i >= 0; i--) {
        const date = week[i];

        if (date) {
            return new Date(date.getTime() - 1000 * 60 * 60 * 24 * (i - index));
        }
    }

    return null;
}

export class Menu extends React.PureComponent<MenuProps> {
    private get monthMatrix(): (Date[])[] {
        const { date } = this.props;
        const maxDays = daysInMonth(date);

        const monthDays: ((Date | null)[])[] = Array(maxDays)
            .fill(undefined)
            .reduce((arr, _, i) => {
                const currDate = new Date(date);
                currDate.setDate(i + 1);

                const weekIndex = getWeek(currDate) - 1;

                if (!arr[weekIndex]) arr[weekIndex] = Array(7).fill(null);
                arr[weekIndex][currDate.getDay()] = currDate;

                return arr;
            }, []);

        return monthDays.map(week => {
            return week.map(
                (day, i) => day || getNextDay(week, i)! || getPrevDay(week, i)!
            );
        });
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
        const currentYear = new Date().getFullYear();

        return (
            <Flex style={{ flexWrap: 'wrap' }}>
                {Array(100)
                    .fill(undefined)
                    .map((_, i) => {
                        const newDate = new Date(currentDate);

                        newDate.setFullYear(currentYear - i);

                        const disabled = isDisabled(newDate, this.props);

                        return (
                            <button
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
                            </button>
                        );
                    })}
            </Flex>
        );
    }

    private renderMenuMonths(): React.ReactNode {
        const { date } = this.props;

        return (
            <Flex style={{ flexWrap: 'wrap' }}>
                {[
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'Mai',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Okt',
                    'Nov',
                    'Dez'
                ].map((str, i) => {
                    const newDate = new Date(date);

                    newDate.setMonth(i);

                    const disabled = isDisabled(newDate, this.props);

                    return (
                        <button
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
                        </button>
                    );
                })}
            </Flex>
        );
    }

    private renderMonth(): React.ReactNode {
        const { monthMatrix } = this;

        return (
            <Table>
                <thead>
                    <tr>
                        <th>So</th>
                        <th>Mo</th>
                        <th>Di</th>
                        <th>Mi</th>
                        <th>Do</th>
                        <th>Fr</th>
                        <th>Sa</th>
                    </tr>
                </thead>
                <tbody>
                    {monthMatrix.map((dates, i) => (
                        <tr key={i}>
                            {dates.map((date, j) => (
                                <td key={j}>{this.renderDay(date)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    }

    private renderDay(day: Date): React.ReactNode {
        const num = day.getDate();
        const { value, date } = this.props;
        const selected =
            value &&
            day.getDate() === value.getDate() &&
            day.getMonth() === value.getMonth();
        const current = day.getMonth() === date.getMonth();
        const disabled = isDisabled(day, this.props);

        return (
            <Day
                data-date={day.toString()}
                selected={selected}
                current={current}
                disabled={disabled}
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
                <button
                    tabIndex={-1}
                    disabled={validDate === null}
                    onClick={() => this.props.onSubmit(this.props.onToggle)}
                >
                    Ok
                </button>
            </Confirm>
        );
    }

    @bind
    private onSelectDay(e: React.SyntheticEvent<HTMLDivElement>): void {
        const date = new Date(e.currentTarget.getAttribute('data-date')!);

        this.props.onSelectDay(date);
    }
}
