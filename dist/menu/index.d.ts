import * as React from 'react';
import { ReactTimebombState, ReactTimebombProps } from '../';
import { FormatType } from '../typings';
export interface MenuProps {
    showTime: ReactTimebombState['showTime'];
    showDate: ReactTimebombState['showDate'];
    showConfirm: ReactTimebombProps['showConfirm'];
    showCalendarWeek: ReactTimebombProps['showCalendarWeek'];
    selectWeek: ReactTimebombProps['selectWeek'];
    selectRange: ReactTimebombProps['selectRange'];
    value: ReactTimebombProps['value'];
    valueText: ReactTimebombState['valueText'];
    minDate: ReactTimebombProps['minDate'];
    maxDate: ReactTimebombProps['maxDate'];
    date: ReactTimebombState['date'];
    mode: ReactTimebombState['mode'];
    timeStep: ReactTimebombProps['timeStep'];
    selectedRange: ReactTimebombState['selectedRange'];
    mobile: ReactTimebombProps['mobile'];
    format: string;
    onSelectDay(date: Date): void;
    onSelectYear(date: Date): void;
    onSelectMonth(date: Date): void;
    onSelectTime(date: Date, mode: FormatType): void;
    onSubmitTime(date: Date | undefined, mode: FormatType): void;
    onSubmit(): void;
}
export declare class Menu extends React.PureComponent<MenuProps> {
    private monthNames;
    private readonly now;
    private getDate;
    private yearContainer;
    private readonly fullYears;
    constructor(props: MenuProps);
    componentDidUpdate(prevProps: MenuProps): void;
    render(): React.ReactNode;
    private renderMenuYear;
    private renderMenuMonths;
    private renderMonth;
    private renderTime;
    private renderConfirm;
    private scrollToYear;
    private onSelectMonth;
    private onSelectYear;
    private onYearContainer;
    private onChangeMonth;
}
