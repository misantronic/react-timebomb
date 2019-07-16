/// <reference types="react" />
import { ReactTimebombProps, ReactTimebombState } from '../typings';
interface MenuTableProps {
    className?: string;
    showTime: ReactTimebombState['showTime'];
    showConfirm: ReactTimebombProps['showConfirm'];
    showCalendarWeek: ReactTimebombProps['showCalendarWeek'];
    selectRange: ReactTimebombProps['selectRange'];
    value: ReactTimebombProps['value'];
    minDate: ReactTimebombProps['minDate'];
    maxDate: ReactTimebombProps['maxDate'];
    date: ReactTimebombState['date'];
    hoverDate: ReactTimebombState['hoverDate'];
    selectedRange: ReactTimebombState['selectedRange'];
    mobile: ReactTimebombProps['mobile'];
    onSelectDay(date: Date): void;
    onHoverDays?(dates: Date[]): void;
    onSubmit(): void;
}
export declare function MenuTable(props: MenuTableProps): JSX.Element;
export {};
