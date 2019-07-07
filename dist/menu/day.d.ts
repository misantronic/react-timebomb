import * as React from 'react';
import { ReactTimebombMenuProps } from '../typings';
interface DayProps {
    day: Date;
    hoverDays: Date[];
    hover: boolean;
    value: ReactTimebombMenuProps['value'];
    date: ReactTimebombMenuProps['date'];
    selectRange: ReactTimebombMenuProps['selectRange'];
    minDate: ReactTimebombMenuProps['minDate'];
    maxDate: ReactTimebombMenuProps['maxDate'];
    showTime: ReactTimebombMenuProps['showTime'];
    onSelectDay: ReactTimebombMenuProps['onSelectDay'];
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
