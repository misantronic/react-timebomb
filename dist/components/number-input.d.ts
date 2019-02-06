import * as React from 'react';
import { FormatType } from '../typings';
interface NumberInputProps {
    date: Date;
    mode: FormatType;
    step?: number;
    onChange(date: Date, mode: FormatType): void;
    onSubmit(date: Date, mode: FormatType): void;
    onCancel(date: undefined, mode: FormatType): void;
}
interface NumberInputState {
    value?: any;
    focused?: boolean;
}
export declare class NumberInput extends React.PureComponent<NumberInputProps, NumberInputState> {
    private ref;
    private readonly renderedValue;
    constructor(props: NumberInputProps);
    static defaultProps: Partial<NumberInputProps>;
    componentDidMount(): void;
    componentDidUpdate(prevProps: NumberInputProps, prevState: NumberInputState): void;
    render(): JSX.Element;
    private manipulateDate;
    private getDateValue;
    private onFocusIn;
    private onFocusOut;
    private onChange;
    private onStepUp;
    private onStepDown;
    private onKeyUp;
}
export {};
