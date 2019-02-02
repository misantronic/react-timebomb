import * as React from 'react';
import { ReactTimebombProps, ReactTimebombState } from '../typings';
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
export declare class MenuTitle extends React.PureComponent<MenuTitleProps> {
    private monthNames;
    private readonly prevDisabled;
    private readonly nextDisabled;
    private readonly date;
    constructor(props: MenuTitleProps);
    render(): React.ReactNode;
}
export {};
