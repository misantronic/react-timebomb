import * as React from 'react';
import styled from 'styled-components';
import { ReactTimebombProps, ReactTimebombState } from './typings';
import { Button } from './button';
import {
    subtractDays,
    startOfMonth,
    endOfMonth,
    addDays,
    getMonthNames
} from './utils';

interface MenuTitleProps {
    date: ReactTimebombState['date'];
    minDate: ReactTimebombProps['minDate'];
    maxDate: ReactTimebombProps['maxDate'];
    mode: ReactTimebombState['mode'];
    selectedRange: ReactTimebombState['selectedRange'];
    onPrevMonth(): void;
    onNextMonth(): void;
    onReset(): void;
    onMonths(): void;
    onYear(): void;
}

const Container = styled.div`
    display: ${(props: { show: boolean }) => (props.show ? 'flex' : 'none')};
    align-items: center;
    width: 100%;
    padding: 10px 10px 15px;
    justify-content: space-between;
    min-height: 21px;
    box-sizing: border-box;
`;

export class MenuTitle extends React.PureComponent<MenuTitleProps> {
    private get prevDisabled(): boolean {
        const { minDate, date, selectedRange } = this.props;

        if (minDate && date) {
            const firstDate = Array.isArray(date) ? date[selectedRange] : date;

            return subtractDays(startOfMonth(firstDate), 1) < minDate;
        }

        return false;
    }

    private get nextDisabled(): boolean {
        const { maxDate, date } = this.props;

        if (maxDate && date) {
            const lastDate = Array.isArray(date) ? date[date.length - 1] : date;

            return addDays(endOfMonth(lastDate), 1) > maxDate;
        }

        return false;
    }

    public render(): React.ReactNode {
        const {
            date,
            mode,
            selectedRange,
            onNextMonth,
            onPrevMonth,
            onMonths,
            onReset,
            onYear
        } = this.props;
        const months = getMonthNames();
        const show = mode === 'month';
        const firstDate = (Array.isArray(date) ? date[selectedRange] : date)!;

        return (
            <Container show={show}>
                <div>
                    <Button tabIndex={-1} onClick={onMonths}>
                        <b>{months[firstDate.getMonth()]}</b>
                    </Button>
                    <Button tabIndex={-1} onClick={onYear}>
                        {firstDate.getFullYear()}
                    </Button>
                </div>
                <div>
                    <Button
                        tabIndex={-1}
                        disabled={this.prevDisabled}
                        onClick={onPrevMonth}
                    >
                        ◀
                    </Button>
                    <Button tabIndex={-1} onClick={onReset}>
                        ○
                    </Button>
                    <Button
                        tabIndex={-1}
                        disabled={this.nextDisabled}
                        onClick={onNextMonth}
                    >
                        ▶
                    </Button>
                </div>
            </Container>
        );
    }
}
