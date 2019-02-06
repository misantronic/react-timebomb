import { ArrowButtonProps } from './components/button';

export type ReactTimebombDate = Date | undefined | Date[];

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
    disabled?: boolean;
    error?: boolean;
    mobile?: boolean;
    arrowButtonComponent?: React.ComponentType<ArrowButtonProps>;
    timeStep?: number;
    onChange(...dates: (undefined | Date)[]): void;
    onError?(
        error: ReactTimebombError,
        ...value: ReactTimebombState['valueText'][]
    ): void;
    onOpen?(): void;
    onClose?(): void;
}

export interface ReactTimebombState {
    minDate?: Date;
    maxDate?: Date;
    valueText?: string | string[];
    allowValidation?: boolean;
    date: ReactTimebombDate;
    mode?: FormatType;
    showDate?: boolean;
    showTime?: boolean;
    selectedRange: number;
}

export type ReactTimebombError = 'outOfRange' | 'invalidDate';
export type FormatType =
    | 'day'
    | 'month'
    | 'year'
    | 'hour'
    | 'minute'
    | 'second';

export { ArrowButtonProps as ReactTimebombArrowButtonProps };
