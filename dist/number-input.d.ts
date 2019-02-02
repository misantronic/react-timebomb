import * as React from 'react';
import { FormatType } from './typings';
interface NumberInputProps {
    date: Date;
    mode: FormatType;
    step?: number;
    onChange(date: Date): void;
}
interface NumberInputState {
    value?: number;
}
export declare class NumberInput extends React.PureComponent<NumberInputProps, NumberInputState> {
    constructor(props: NumberInputProps);
    static defaultProps: Partial<NumberInputProps>;
    static getDerivedStateFromProps(prevProps: NumberInputProps): NumberInputState | undefined;
    render(): JSX.Element;
    private manipulateDate;
    private onChange;
    private onStepUp;
    private onStepDown;
}
export {};
