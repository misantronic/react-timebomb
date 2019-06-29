import { ReactTimebombState, ReactTimebombProps } from '../';
import { FormatType } from '../typings';
export interface MenuProps {
    showTime: ReactTimebombState['showTime'];
    showDate: ReactTimebombState['showDate'];
    showConfirm: ReactTimebombProps['showConfirm'];
    showCalendarWeek: ReactTimebombProps['showCalendarWeek'];
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
    /** month was selected, value will change to `date` */
    onSelectMonth(date: Date): void;
    /** month was selected but value will not change to `date` */
    onChangeMonth(date: Date): void;
    onSelectTime(date: Date, mode: FormatType): void;
    onSubmitTime(date: Date | undefined, mode: FormatType): void;
    onSubmit(): void;
}
export declare function Menu(props: MenuProps): JSX.Element | null;
