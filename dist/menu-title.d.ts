import * as React from 'react';
import { ReactTimebombProps, ReactTimebombState } from './typings';
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
export declare class MenuTitle extends React.PureComponent<MenuTitleProps> {
    private readonly prevDisabled;
    private readonly nextDisabled;
    render(): React.ReactNode;
}
export {};
