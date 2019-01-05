import * as React from 'react';
import { ReactTimebombProps, ReactTimebombState } from './typings';
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
export declare class MenuTitle extends React.PureComponent<MenuTitleProps> {
    private readonly prevDisabled;
    private readonly nextDisabled;
    private readonly date;
    render(): React.ReactNode;
}
export {};
