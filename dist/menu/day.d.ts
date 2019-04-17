import * as React from 'react';
import { MenuProps } from '.';
interface DayProps {
    day: Date;
    hoverDays: Date[];
    hover: boolean;
    value: MenuProps['value'];
    date: MenuProps['date'];
    selectRange: MenuProps['selectRange'];
    minDate: MenuProps['minDate'];
    maxDate: MenuProps['maxDate'];
    showTime: MenuProps['showTime'];
    onSelectDay: MenuProps['onSelectDay'];
    onMouseEnter(day: Date): void;
    onMouseLeave(day: Date): void;
}
export declare function Day(props: DayProps): JSX.Element;
interface WeekNumProps {
    day: Date;
    children: React.ReactNode;
    onClick(day: Date): void;
}
export declare function WeekNum(props: WeekNumProps): JSX.Element;
export {};
