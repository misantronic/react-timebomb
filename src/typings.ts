export interface ReactTimebombProps {
    className?: string;
    value?: Date;
    format?: string;
    placeholder?: string;
    menuWidth?: number;
    minDate?: Date;
    maxDate?: Date;
    selectWeek?: boolean;
    showCalendarWeek?: boolean;
    showConfirm?: boolean;
    error?: boolean;
    onChange(...dates: (undefined | Date)[]): void;
    onError?(error: ReactTimebombError, value: string): void;
}

export interface ReactTimebombState {
    valueText?: string;
    allowValidation?: boolean;
    date: Date;
    mode: 'year' | 'months' | 'month';
    showTime?: boolean;
}

export type ReactTimebombError = 'outOfRange' | 'invalidDate';
