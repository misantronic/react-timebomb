import * as React from 'react';
import { ReactTimebombProps, ReactTimebombState } from '../typings';
interface MenuTableProps {
    showTime: ReactTimebombState['showTime'];
    showConfirm: ReactTimebombProps['showConfirm'];
    showCalendarWeek: ReactTimebombProps['showCalendarWeek'];
    selectWeek: ReactTimebombProps['selectWeek'];
    selectRange: ReactTimebombProps['selectRange'];
    value: ReactTimebombProps['value'];
    minDate: ReactTimebombProps['minDate'];
    maxDate: ReactTimebombProps['maxDate'];
    date: ReactTimebombState['date'];
    selectedRange: ReactTimebombState['selectedRange'];
    mobile: ReactTimebombProps['mobile'];
    onSelectDay(date: Date): void;
    onSubmit(): void;
}
interface MenuTableState {
    hoverDay?: Date;
}
export declare class MenuTable extends React.PureComponent<MenuTableProps, MenuTableState> {
    private weekdayNames;
    private monthMatrixCache;
    private readonly monthMatrix;
    constructor(props: MenuTableProps);
    render(): JSX.Element;
    private getDate;
    private onSelectDay;
    private onDayMouseEnter;
    private onDayMouseLeave;
}
export {};
