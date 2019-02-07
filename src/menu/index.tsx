import * as React from 'react';
import styled from 'styled-components';
import { ReactTimebombState, ReactTimebombProps } from '../';
import {
    isEnabled,
    validateDate,
    getMonthNames,
    getAttribute,
    isArray,
    dateEqual,
    addMonths,
    subtractMonths,
    startOfMonth,
    subtractDays,
    addDays,
    endOfMonth
} from '../utils';
import { Button } from '../components/button';
import { ReactTimebombDate, FormatType } from '../typings';
import { MenuTable } from './table';
import { GestureWrapper, GestureDirection } from './mobile';
import { MenuTime } from './time';

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
    timeStep: ReactTimebombProps['timeStep'];
    selectedRange: ReactTimebombState['selectedRange'];
    mobile: ReactTimebombProps['mobile'];
    format: string;
    onSelectDay(date: Date): void;
    onSelectYear(date: Date): void;
    /** month was selected, value will change to `date` */
    onSelectMonth(date: Date): void;
    /** month was selected but value will not change to `date` */
    onChangeMonth(date: Date): void;
    onSelectTime(date: Date, mode: FormatType): void;
    onSubmitTime(date: Date | undefined, mode: FormatType): void;
    onSubmit(): void;
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
    padding: 0;
    height: ${(props: { mobile?: boolean }) => (props.mobile ? '100' : 'auto')};
    overflow: hidden;
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
    padding: 10px 0;

    button {
        padding: 3px 28px;
    }
`;

export class Menu extends React.PureComponent<MenuProps> {
    private monthNames!: string[];

    private get now(): Date {
        return new Date();
    }

    private getDate(date: ReactTimebombDate) {
        return (isArray(date) ? date[this.props.selectedRange] : date)!;
    }

    private yearContainer: HTMLDivElement | null = null;

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

    private get allowPrev() {
        const { minDate } = this.props;
        let date = this.props.date;

        if (!minDate) {
            return true;
        }

        if (isArray(date)) {
            date = date[0];
        }

        if (date) {
            if (subtractDays(startOfMonth(date), 1) < minDate) {
                return false;
            }
        }

        return true;
    }

    private get allowNext() {
        const { maxDate } = this.props;
        let date = this.props.date;

        if (!maxDate) {
            return true;
        }

        if (isArray(date)) {
            date = date[0];
        }

        if (date) {
            if (addDays(endOfMonth(date), 1) > maxDate) {
                return false;
            }
        }

        return true;
    }

    constructor(props: MenuProps) {
        super(props);

        this.state = {};

        this.onSelectMonth = this.onSelectMonth.bind(this);
        this.onSelectYear = this.onSelectYear.bind(this);
        this.onYearContainer = this.onYearContainer.bind(this);
        this.onChangeMonth = this.onChangeMonth.bind(this);

        this.monthNames = getMonthNames(true);
    }

    public componentDidUpdate(prevProps: MenuProps) {
        if (!dateEqual(prevProps.date, this.props.date)) {
            this.scrollToYear(64);
        }
    }

    public render(): React.ReactNode {
        const { mode, mobile, showDate, showConfirm, showTime } = this.props;

        if (showDate || showTime) {
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
                case 'hour':
                case 'minute':
                case 'second':
                    return (
                        <MonthContainer mobile={mobile}>
                            {showDate && this.renderMonth()}
                            {showTime && this.renderTime()}
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
        const { mobile } = this.props;

        if (mobile) {
            return (
                <GestureWrapper
                    allowNext={this.allowNext}
                    allowPrev={this.allowPrev}
                    onChangeMonth={this.onChangeMonth}
                >
                    <MenuTable
                        date={subtractMonths(this.getDate(this.props.date), 1)}
                        minDate={this.props.minDate}
                        maxDate={this.props.maxDate}
                        mobile={this.props.mobile}
                        selectRange={this.props.selectRange}
                        selectedRange={this.props.selectedRange}
                        selectWeek={this.props.selectWeek}
                        showCalendarWeek={this.props.showCalendarWeek}
                        showConfirm={this.props.showConfirm}
                        showTime={this.props.showTime}
                        value={subtractMonths(
                            this.getDate(this.props.value),
                            1
                        )}
                        onSubmit={this.props.onSubmit}
                        onSelectDay={this.props.onSelectDay}
                    />
                    <MenuTable
                        date={this.props.date}
                        minDate={this.props.minDate}
                        maxDate={this.props.maxDate}
                        mobile={this.props.mobile}
                        selectRange={this.props.selectRange}
                        selectedRange={this.props.selectedRange}
                        selectWeek={this.props.selectWeek}
                        showCalendarWeek={this.props.showCalendarWeek}
                        showConfirm={this.props.showConfirm}
                        showTime={this.props.showTime}
                        value={this.props.value}
                        onSubmit={this.props.onSubmit}
                        onSelectDay={this.props.onSelectDay}
                    />
                    <MenuTable
                        date={addMonths(this.getDate(this.props.date), 1)}
                        minDate={this.props.minDate}
                        maxDate={this.props.maxDate}
                        mobile={this.props.mobile}
                        selectRange={this.props.selectRange}
                        selectedRange={this.props.selectedRange}
                        selectWeek={this.props.selectWeek}
                        showCalendarWeek={this.props.showCalendarWeek}
                        showConfirm={this.props.showConfirm}
                        showTime={this.props.showTime}
                        value={addMonths(this.getDate(this.props.value), 1)}
                        onSubmit={this.props.onSubmit}
                        onSelectDay={this.props.onSelectDay}
                    />
                </GestureWrapper>
            );
        }

        return (
            <MenuTable
                date={this.props.date}
                minDate={this.props.minDate}
                maxDate={this.props.maxDate}
                mobile={this.props.mobile}
                selectRange={this.props.selectRange}
                selectedRange={this.props.selectedRange}
                selectWeek={this.props.selectWeek}
                showCalendarWeek={this.props.showCalendarWeek}
                showConfirm={this.props.showConfirm}
                showTime={this.props.showTime}
                value={this.props.value}
                onSubmit={this.props.onSubmit}
                onSelectDay={this.props.onSelectDay}
            />
        );
    }

    private renderTime(): React.ReactNode {
        return (
            <MenuTime
                date={this.props.date}
                timeStep={this.props.timeStep}
                topDivider={this.props.showDate}
                onChange={this.props.onSelectTime}
                onSubmit={this.props.onSubmitTime}
                onCancel={this.props.onSubmitTime}
            />
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

                        if (this.yearContainer.scrollBy) {
                            this.yearContainer.scrollBy({ top: -10 });
                        }
                    }
                }
            }, delay);
        };
    })();

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

    private onChangeMonth(direction: GestureDirection) {
        const { onChangeMonth } = this.props;
        const date = this.getDate(this.props.date);

        switch (direction) {
            case 'next':
                onChangeMonth(addMonths(date, 1));
                break;
            case 'prev':
                onChangeMonth(subtractMonths(date, 1));
                break;
        }
    }
}
