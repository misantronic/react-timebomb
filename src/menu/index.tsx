import * as React from 'react';
import styled from 'styled-components';
import { ReactTimebombState } from '../';
import { Button } from '../components/button';
import { ReactTimebombDate, ReactTimebombMenuProps } from '../typings';
import {
    addDays,
    addMonths,
    endOfMonth,
    getAttribute,
    getMonthNames,
    isArray,
    isEnabled,
    startOfMonth,
    subtractDays,
    subtractMonths,
    validateDate
} from '../utils';
import { GestureDirection, GestureWrapper } from './mobile';
import { MenuTable } from './table';
import { MenuTime } from './time';

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
    height: 100%;
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

const MobileMenuTable = styled(MenuTable)`
    width: 33.3%;
`;

function getDate(
    date: ReactTimebombDate,
    selectedRange: ReactTimebombState['selectedRange']
) {
    return (isArray(date) ? date[selectedRange] : date)!;
}

function MenuMonths(props: ReactTimebombMenuProps) {
    const { value, mobile, selectedRange } = props;
    const [monthNames] = React.useState(getMonthNames(true));
    const valueDate = getDate(value, selectedRange);
    const date = getDate(props.date, selectedRange);
    const month = value && valueDate.getMonth();
    const year = value && valueDate.getFullYear();

    function onChangeMonth(e: React.MouseEvent<HTMLButtonElement>) {
        const date = new Date(getAttribute(e.currentTarget, 'data-date'));

        setTimeout(() => props.onChangeMonth(date), 0);
    }

    return (
        <MonthsContainer mobile={mobile} className="months">
            {monthNames.map((str, i) => {
                const newDate = new Date(date);

                newDate.setMonth(i);

                const enabled = isEnabled('month', newDate, props);
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
                        mobile={props.mobile}
                        data-date={newDate.toISOString()}
                        onClick={onChangeMonth}
                    >
                        {str}
                    </Button>
                );
            })}
        </MonthsContainer>
    );
}

function MenuYear(props: ReactTimebombMenuProps) {
    const { value, minDate, maxDate } = props;
    const yearContainerRef = React.createRef();

    React.useEffect(scrollToYear, [props.date]);

    function scrollToYear() {
        if (yearContainerRef?.current) {
            const selected = yearContainerRef.current.querySelector('.selected');

            if (selected) {
                selected.scrollIntoView({ block: 'nearest', inline: 'start' });
            }
        }
    }

    function getFullYears() {
        const valueDate = getDate(value, props.selectedRange);
        const year = getDate(props.date, props.selectedRange).getFullYear();

        const getDateConfig = (date: Date, newYear: number) => {
            date = new Date(date);
            date.setFullYear(newYear);

            const enabled = isEnabled('year', date, props);
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
            const now = new Date();
            const currentDate = valueDate > now ? valueDate : now;
            const currentYear = currentDate.getFullYear();

            return Array(120)
                .fill(undefined)
                .map((_, i) => {
                    const date = new Date(currentDate);

                    date.setFullYear(currentYear - i);

                    const enabled = isEnabled('year', date, props);
                    const selected = year === date.getFullYear();

                    return { date, enabled, selected };
                })
                .filter(obj => obj.enabled)
                .reverse();
        }
    }

    function onSelectYear(e: React.MouseEvent<HTMLButtonElement>) {
        const date = new Date(getAttribute(e.currentTarget, 'data-date'));

        setTimeout(() => props.onChangeYear(date), 0);
    }

    return (
        <YearContainer ref={yearContainerRef} className="years">
            {getFullYears()
                .map(({ date, selected }) => {
                    const fullYear = date.getFullYear();
                    const dateStr = date.toISOString();

                    return (
                        <Button
                            key={dateStr}
                            tabIndex={-1}
                            className={selected ? 'selected' : undefined}
                            selected={selected}
                            mobile={props.mobile}
                            data-date={dateStr}
                            onClick={onSelectYear}
                        >
                            {fullYear}
                        </Button>
                    );
                })
                .reverse()}
        </YearContainer>
    );
}

function MenuConfirm(props: ReactTimebombMenuProps) {
    const { valueText, format } = props;
    const validDate = validateDate(valueText, format);
    const isValid = validDate
        ? isArray(validDate)
            ? validDate.every(v => isEnabled('day', v, props))
            : isEnabled('day', validDate, props)
        : false;

    return (
        <Confirm>
            <Button
                tabIndex={-1}
                disabled={!isValid}
                mobile={props.mobile}
                onClick={() => props.onSubmit()}
            >
                Ok
            </Button>
        </Confirm>
    );
}

function MonthWrapper(props: ReactTimebombMenuProps) {
    const { minDate, maxDate, mobile } = props;

    function allowPrev() {
        let date = props.date;

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

    function allowNext() {
        let date = props.date;

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

    function onChangeMonth(direction: GestureDirection) {
        const { onChangeMonth } = props;
        const date = getDate(props.date, props.selectedRange);

        switch (direction) {
            case 'next':
                onChangeMonth(addMonths(date, 1));
                break;
            case 'prev':
                onChangeMonth(subtractMonths(date, 1));
                break;
        }
    }

    if (mobile) {
        return (
            <GestureWrapper
                allowNext={allowNext()}
                allowPrev={allowPrev()}
                onChangeMonth={onChangeMonth}
            >
                <MobileMenuTable
                    date={subtractMonths(
                        getDate(props.date, props.selectedRange),
                        1
                    )}
                    minDate={props.minDate}
                    maxDate={props.maxDate}
                    mobile={props.mobile}
                    selectRange={props.selectRange}
                    selectedRange={props.selectedRange}
                    showCalendarWeek={props.showCalendarWeek}
                    showConfirm={props.showConfirm}
                    showTime={props.showTime}
                    value={subtractMonths(
                        getDate(props.value, props.selectedRange),
                        1
                    )}
                    onSubmit={props.onSubmit}
                    onSelectDay={props.onSelectDay}
                />
                <MobileMenuTable
                    date={props.date}
                    minDate={props.minDate}
                    maxDate={props.maxDate}
                    mobile={props.mobile}
                    selectRange={props.selectRange}
                    selectedRange={props.selectedRange}
                    showCalendarWeek={props.showCalendarWeek}
                    showConfirm={props.showConfirm}
                    showTime={props.showTime}
                    value={props.value}
                    onSubmit={props.onSubmit}
                    onSelectDay={props.onSelectDay}
                />
                <MobileMenuTable
                    date={addMonths(
                        getDate(props.date, props.selectedRange),
                        1
                    )}
                    minDate={props.minDate}
                    maxDate={props.maxDate}
                    mobile={props.mobile}
                    selectRange={props.selectRange}
                    selectedRange={props.selectedRange}
                    showCalendarWeek={props.showCalendarWeek}
                    showConfirm={props.showConfirm}
                    showTime={props.showTime}
                    value={addMonths(
                        getDate(props.value, props.selectedRange),
                        1
                    )}
                    onSubmit={props.onSubmit}
                    onSelectDay={props.onSelectDay}
                />
            </GestureWrapper>
        );
    }

    return (
        <MenuTable
            date={props.date}
            minDate={props.minDate}
            maxDate={props.maxDate}
            mobile={props.mobile}
            selectRange={props.selectRange}
            selectedRange={props.selectedRange}
            showCalendarWeek={props.showCalendarWeek}
            showConfirm={props.showConfirm}
            showTime={props.showTime}
            value={props.value}
            hoverDate={props.hoverDate}
            onSubmit={props.onSubmit}
            onSelectDay={props.onSelectDay}
            onHoverDays={props.onHoverDays}
        />
    );
}

export function Menu(props: ReactTimebombMenuProps) {
    const { mode, mobile, showDate, showConfirm, showTime } = props;
    const ConfirmComponent = props.confirmComponent || MenuConfirm;

    if (showDate || showTime) {
        switch (mode) {
            case 'year':
            case 'month':
                return (
                    <MonthAndYearContainer mobile={mobile}>
                        <MenuMonths {...props} />
                        <MenuYear {...props} />
                    </MonthAndYearContainer>
                );
            case 'day':
            case 'hour':
            case 'minute':
            case 'second':
                return (
                    <MonthContainer>
                        {showDate && <MonthWrapper {...props} />}
                        {showTime && (
                            <MenuTime
                                date={props.date}
                                timeStep={props.timeStep}
                                topDivider={props.showDate}
                                format={props.format}
                                onChange={props.onSelectTime}
                                onSubmit={props.onSubmitTime}
                                onCancel={props.onSubmitTime}
                            />
                        )}
                        {showConfirm && <ConfirmComponent {...props} />}
                    </MonthContainer>
                );
        }
    }

    return null;
}
