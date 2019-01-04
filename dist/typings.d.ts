export declare type ReactTimebombDate = Date | undefined | Date[];
export interface ReactTimebombProps {
    className?: string;
    value?: ReactTimebombDate;
    format?: string;
    placeholder?: string;
    menuWidth?: number;
    minDate?: Date;
    maxDate?: Date;
    selectWeek?: boolean;
    selectRange?: boolean;
    showCalendarWeek?: boolean;
    showConfirm?: boolean;
    error?: boolean;
    onChange(...dates: (undefined | Date)[]): void;
    onError?(error: ReactTimebombError, ...value: ReactTimebombState['valueText'][]): void;
}
export interface ReactTimebombState {
    valueText?: string | string[];
    allowValidation?: boolean;
    date: ReactTimebombDate;
    mode: 'year' | 'months' | 'month';
    showTime?: boolean;
    selectedRange: number;
}
export declare type ReactTimebombError = 'outOfRange' | 'invalidDate';
