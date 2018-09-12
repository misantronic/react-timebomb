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
    date: Date;
    minDate: ReactTimebombProps['minDate'];
    maxDate: ReactTimebombProps['maxDate'];
    mode: ReactTimebombState['mode'];
    onPrevMonth(): void;
    onNextMonth(): void;
    onToday(): void;
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
            mode,
            onNextMonth,
            onPrevMonth,
            onMonths,
            onYear
        } = this.props;
        const months = getMonthNames(true);
        const show = mode === 'month';

        return (
            <Container show={show}>
                <Button
                    tabIndex={-1}
                    disabled={this.prevDisabled}
                    onClick={onPrevMonth}
                >
                    ◀
                </Button>
                <div>
                    <Button tabIndex={-1} onClick={onMonths}>
                        <b>{months[date.getMonth()]}</b>
                    </Button>
                    <Button tabIndex={-1} onClick={onYear}>
                        {date.getFullYear()}
                    </Button>
                </div>
                <Button
                    tabIndex={-1}
                    disabled={this.nextDisabled}
                    onClick={onNextMonth}
                >
                    ▶
                </Button>
            </Container>
        );
    }
}
