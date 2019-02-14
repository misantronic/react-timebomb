import * as React from 'react';
import styled from 'styled-components';
import { ReactTimebombProps, ReactTimebombState } from '../typings';
import { Button } from '../components/button';
import {
    subtractDays,
    startOfMonth,
    endOfMonth,
    addDays,
    getMonthNames,
    isArray
} from '../utils';

interface MenuTitleProps {
    date: ReactTimebombState['date'];
    minDate: ReactTimebombProps['minDate'];
    maxDate: ReactTimebombProps['maxDate'];
    mobile: ReactTimebombProps['mobile'];
    mode: ReactTimebombState['mode'];
    selectedRange: ReactTimebombState['selectedRange'];
    showTime: ReactTimebombState['showTime'];
    showDate: ReactTimebombState['showDate'];
    onPrevMonth(): void;
    onNextMonth(): void;
    onReset(): void;
    onMonth(): void;
    onYear(): void;
}

const Container = styled.div`
    display: ${(props: { show: boolean }) => (props.show ? 'flex' : 'none')};
    align-items: center;
    width: 100%;
    padding: 10px;
    justify-content: space-between;
    box-sizing: border-box;
    white-space: nowrap;
`;

export function MenuTitle(props: MenuTitleProps) {
    const {
        mode,
        minDate,
        maxDate,
        mobile,
        showDate,
        selectedRange,
        onNextMonth,
        onPrevMonth,
        onMonth,
        onReset,
        onYear
    } = props;
    const [monthNames] = React.useState(getMonthNames());
    const show =
        (mode === 'day' ||
            mode === 'hour' ||
            mode === 'minute' ||
            mode === 'second') &&
        Boolean(showDate);
    const date = getDate();

    function prevDisabled(): boolean {
        if (minDate && props.date) {
            return subtractDays(startOfMonth(date), 1) < minDate;
        }

        return false;
    }

    function nextDisabled(): boolean {
        if (maxDate && props.date) {
            const lastDate = isArray(props.date)
                ? props.date[props.date.length - 1]
                : props.date;

            return addDays(endOfMonth(lastDate), 1) > maxDate;
        }

        return false;
    }

    function getDate() {
        return (isArray(props.date) ? props.date[selectedRange] : props.date)!;
    }

    return (
        <Container className="react-timebomb-menu-title" show={show}>
            <div>
                <Button
                    className="react-timebomb-button-month"
                    tabIndex={-1}
                    mobile={mobile}
                    onClick={onMonth}
                >
                    <b>{monthNames[date.getMonth()]}</b>
                </Button>
                <Button
                    className="react-timebomb-button-year"
                    tabIndex={-1}
                    mobile={mobile}
                    onClick={onYear}
                >
                    {date.getFullYear()}
                </Button>
            </div>
            <div>
                <Button
                    className="react-timebomb-button-month-prev"
                    tabIndex={-1}
                    disabled={prevDisabled()}
                    mobile={mobile}
                    onClick={onPrevMonth}
                >
                    ◀
                </Button>
                <Button
                    className="react-timebomb-button-month-reset"
                    tabIndex={-1}
                    mobile={mobile}
                    onClick={onReset}
                >
                    ○
                </Button>
                <Button
                    className="react-timebomb-button-month-next"
                    tabIndex={-1}
                    disabled={nextDisabled()}
                    mobile={mobile}
                    onClick={onNextMonth}
                >
                    ▶
                </Button>
            </div>
        </Container>
    );
}
