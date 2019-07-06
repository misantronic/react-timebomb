import { ArrowButtonProps } from './components/button';

export type ReactTimebombDate = undefined | Date | Date[];

type ReactComponent<P = {}> =
    | React.ComponentClass<P>
    | React.StatelessComponent<P>;

export interface ReactTimebombProps {
    className?: string;
    value?: ReactTimebombDate;
    format?: string;
    placeholder?: string;
    menuWidth?: number;
    minDate?: Date;
    maxDate?: Date;
    selectRange?: 'week' | number | boolean;
    showCalendarWeek?: boolean;
    showConfirm?: boolean;
    disabled?: boolean;
    error?: any;
    mobile?: boolean;
    arrowButtonId?: string;
    arrowButtonComponent?: ReactComponent<ArrowButtonProps>;
    clearComponent?: ReactComponent<ClearComponentProps>;
    iconComponent?: ReactComponent<IconProps> | null;
    labelComponent?: ReactComponent<
        ReactTimebombValueProps | ReactTimebombMultiValueProps
    >;
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
    preventClose?: boolean;
    selectedRange: number;
    menuHeight?: 'auto';
    hoverDate?: Date;
}

export type ReactTimebombError = 'outOfRange' | 'invalidDate';
export type FormatType =
    | 'day'
    | 'month'
    | 'year'
    | 'hour'
    | 'minute'
    | 'second';

export interface ReactTimebombValueProps {
    className?: string;
    innerRef?: React.Ref<HTMLDivElement>;
    open?: boolean;
    value?: Date;
    format: string;
    placeholder: ReactTimebombProps['placeholder'];
    minDate: ReactTimebombProps['minDate'];
    maxDate: ReactTimebombProps['maxDate'];
    showDate: ReactTimebombState['showDate'];
    showTime: ReactTimebombState['showTime'];
    mode: ReactTimebombState['mode'];
    allowValidation: ReactTimebombState['allowValidation'];
    arrowButtonComponent: ReactTimebombProps['arrowButtonComponent'];
    clearComponent: ReactTimebombProps['clearComponent'];
    arrowButtonId: ReactTimebombProps['arrowButtonId'];
    iconComponent: ReactTimebombProps['iconComponent'];
    labelComponent: ReactTimebombProps['labelComponent'];
    disabled: ReactTimebombProps['disabled'];
    mobile: ReactTimebombProps['mobile'];
    timeStep: ReactTimebombProps['timeStep'];
    hoverDate: ReactTimebombState['hoverDate'];
    onToggle(): void;
    onChangeValueText(valueText?: string, commit?: boolean): void;
    onChangeFormatGroup(formatGroup: string): void;
    onAllSelect(): void;
    onSubmit(): void;
    onClear(): void;
}

export type ReactTimebombMultiValueProps = Omit<
    ReactTimebombValueProps,
    'value'
> & {
    value: undefined | Date[];
};

export interface IconProps {
    showDate?: boolean;
    showTime?: boolean;
}

export interface ClearComponentProps {
    disabled?: boolean;
    onClick(e: React.MouseEvent<HTMLButtonElement>): void;
}

export { ClearComponentProps as ReactTimebombClearComponentProps };
export { ArrowButtonProps as ReactTimebombArrowButtonProps };
