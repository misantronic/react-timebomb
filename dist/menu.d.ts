import * as React from 'react';
import { ReactTimebombState, ReactTimebombProps } from '.';
interface MenuProps {
    showTime: ReactTimebombState['showTime'];
    showConfirm: ReactTimebombProps['showConfirm'];
    showCalendarWeek: ReactTimebombProps['showCalendarWeek'];
    selectWeek: ReactTimebombProps['selectWeek'];
    value: ReactTimebombProps['value'];
    valueText: ReactTimebombState['valueText'];
    minDate: ReactTimebombProps['minDate'];
    maxDate: ReactTimebombProps['maxDate'];
    date: ReactTimebombState['date'];
    mode: ReactTimebombState['mode'];
    format: string;
    onToggle(): void;
    onSelectDay(date: Date): void;
    onSelectYear(date: Date): void;
    onSelectMonth(date: Date): void;
    onSelectTime(time: string): void;
    onSubmit(onToggle: () => void): void;
}
export declare class Menu extends React.PureComponent<MenuProps> {
    private readonly now;
    private readonly monthMatrix;
    render(): React.ReactNode;
    private renderMenuYear;
    private renderMenuMonths;
    private renderMonth;
    private renderDay;
    private renderConfirm;
    private onSelectDay;
    private onSelectMonth;
    private onSelectYear;
}
export {};
