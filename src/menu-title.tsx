import * as React from 'react';
import styled from 'styled-components';
import { ReactTimebombProps } from './typings';
import { subtractDays, startOfMonth, endOfMonth, addDays } from './utils';

interface MenuTitleProps {
    date: Date;
    minDate: ReactTimebombProps['minDate'];
    maxDate: ReactTimebombProps['maxDate'];
    onPrevMonth(): void;
    onNextMonth(): void;
    onToday(): void;
    onMonths(): void;
    onYear(): void;
}

const Container = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 15px;
    justify-content: space-between;
`;

const Button = styled.button`
    margin-left: 5px;
    cursor: pointer;
`;

const monthFormat = new Intl.DateTimeFormat('de-DE', {
    month: 'short'
});

const yearFormat = new Intl.DateTimeFormat('de-DE', {
    year: 'numeric'
});

export class MenuTitle extends React.PureComponent<MenuTitleProps> {
    private get prevDisabled(): boolean {
        const { minDate, date } = this.props;

        if (minDate) {
            return subtractDays(startOfMonth(date), 1) < minDate;
        }

        return false;
    }

    private get nextDisabled(): boolean {
        const { maxDate, date } = this.props;

        if (maxDate) {
            return addDays(endOfMonth(date), 1) > maxDate;
        }

        return false;
    }

    public render(): React.ReactNode {
        const {
            date,
            onNextMonth,
            onPrevMonth,
            onToday,
            onMonths,
            onYear
        } = this.props;

        return (
            <Container>
                <div>
                    <button onClick={onMonths}>
                        <b>{monthFormat.format(date)}</b>
                    </button>
                    <Button onClick={onYear}>{yearFormat.format(date)}</Button>
                </div>
                <div style={{ display: 'flex' }}>
                    <Button disabled={this.prevDisabled} onClick={onPrevMonth}>
                        prev
                    </Button>
                    <Button onClick={onToday}>○</Button>
                    <Button disabled={this.nextDisabled} onClick={onNextMonth}>
                        next
                    </Button>
                </div>
            </Container>
        );
    }
}
