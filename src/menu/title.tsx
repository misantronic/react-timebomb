import * as React from 'react';
import styled from 'styled-components';
import { ReactTimebombProps, ReactTimebombState } from '../typings';
import { Button } from '../button';
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

export class MenuTitle extends React.PureComponent<MenuTitleProps> {
    private monthNames!: string[];

    private get prevDisabled(): boolean {
        const { minDate, date } = this.props;

        if (minDate && date) {
            return subtractDays(startOfMonth(this.date), 1) < minDate;
        }

        return false;
    }

    private get nextDisabled(): boolean {
        const { maxDate, date } = this.props;

        if (maxDate && date) {
            const lastDate = isArray(date) ? date[date.length - 1] : date;

            return addDays(endOfMonth(lastDate), 1) > maxDate;
        }

        return false;
    }

    private get date() {
        const { date, selectedRange } = this.props;

        return (isArray(date) ? date[selectedRange] : date)!;
    }

    constructor(props: MenuTitleProps) {
        super(props);

        this.monthNames = getMonthNames();
    }

    public render(): React.ReactNode {
        const {
            mode,
            showDate,
            onNextMonth,
            onPrevMonth,
            onMonth,
            onReset,
            onYear
        } = this.props;
        const show =
            (mode === 'day' ||
                mode === 'hour' ||
                mode === 'minute' ||
                mode === 'second') &&
            Boolean(showDate);
        const date = this.date;

        return (
            <Container className="react-timebomb-menu-title" show={show}>
                <div>
                    <Button
                        className="react-timebomb-button-month"
                        tabIndex={-1}
                        mobile={this.props.mobile}
                        onClick={onMonth}
                    >
                        <b>{this.monthNames[date.getMonth()]}</b>
                    </Button>
                    <Button
                        className="react-timebomb-button-year"
                        tabIndex={-1}
                        mobile={this.props.mobile}
                        onClick={onYear}
                    >
                        {date.getFullYear()}
                    </Button>
                </div>
                <div>
                    <Button
                        className="react-timebomb-button-month-prev"
                        tabIndex={-1}
                        disabled={this.prevDisabled}
                        mobile={this.props.mobile}
                        onClick={onPrevMonth}
                    >
                        ◀
                    </Button>
                    <Button
                        className="react-timebomb-button-month-reset"
                        tabIndex={-1}
                        mobile={this.props.mobile}
                        onClick={onReset}
                    >
                        ○
                    </Button>
                    <Button
                        className="react-timebomb-button-month-next"
                        tabIndex={-1}
                        disabled={this.nextDisabled}
                        mobile={this.props.mobile}
                        onClick={onNextMonth}
                    >
                        ▶
                    </Button>
                </div>
            </Container>
        );
    }
}
