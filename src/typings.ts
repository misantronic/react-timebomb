export interface ReactTimebombProps {
    value?: Date;
    format?: string;
    placeholder?: string;
    minDate?: Date;
    maxDate?: Date;
    onChange(date?: Date): void;
    onError?(error: ReactTimebombError, value: string): void;
}

export interface ReactTimebombState {
    valueText?: string;
    allowError?: boolean;
    date: Date;
    mode: 'year' | 'months' | 'month';
    showTime?: boolean;
}

export type ReactTimebombError = 'outOfRange' | 'invalidDate';
