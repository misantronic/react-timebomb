import * as React from 'react';
import styled from 'styled-components';
import { ReactTimebombProps } from './typings';
import { Button } from './button';
import {
    subtractDays,
    startOfMonth,
    endOfMonth,
    addDays,
    getMonthNames
} from './utils';

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
    min-height: 21px;
`;

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
        const months = getMonthNames(true);

        return (
            <Container>
                <div>
                    <Button tabIndex={-1} onClick={onMonths}>
                        <b>{months[date.getMonth()]}</b>
                    </Button>
                    <Button tabIndex={-1} onClick={onYear}>
                        {date.getFullYear()}
                    </Button>
                </div>
                <div style={{ display: 'flex' }}>
                    <Button
                        tabIndex={-1}
                        disabled={this.prevDisabled}
                        onClick={onPrevMonth}
                    >
                        ◀
                    </Button>
                    <Button tabIndex={-1} onClick={onToday}>
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
