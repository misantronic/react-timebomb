/// <reference types="react" />
import { ArrowButtonProps } from './arrow-button';
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
    disabled?: boolean;
    error?: boolean;
    arrowButtonComponent?: React.ComponentType<ArrowButtonProps>;
    onChange(...dates: (undefined | Date)[]): void;
    onError?(error: ReactTimebombError, ...value: ReactTimebombState['valueText'][]): void;
    onOpen?(): void;
    onClose?(): void;
}
export interface ReactTimebombState {
    minDate?: Date;
    maxDate?: Date;
    valueText?: string | string[];
    allowValidation?: boolean;
    date: ReactTimebombDate;
    mode: 'year' | 'months' | 'month';
    showDate?: boolean;
    showTime?: boolean;
    selectedRange: number;
}
export declare type ReactTimebombError = 'outOfRange' | 'invalidDate';
export { ArrowButtonProps as ReactTimebombArrowButtonProps };
