import * as React from 'react';
import { ReactTimebombProps } from './typings';
interface ValueProps {
    open?: boolean;
    value?: Date;
    valueText?: string;
    format: string;
    placeholder: ReactTimebombProps['placeholder'];
    minDate: ReactTimebombProps['minDate'];
    maxDate: ReactTimebombProps['maxDate'];
    allowValidation?: boolean;
    onToggle(): void;
    onChangeValueText(valueText: string): void;
    onSubmit(onToggle: () => void): void;
}
export declare class Value extends React.PureComponent<ValueProps> {
    private searchInputs;
    private readonly formatGroups;
    private readonly focused;
    constructor(props: ValueProps);
    componentDidUpdate(prevProps: ValueProps): void;
    render(): React.ReactNode;
    private renderValue;
    private selectText;
    private onSearchRef;
    private onKeyDown;
    private onKeyUp;
    private onFocus;
    private onChange;
    private onClear;
    private onToggle;
}
export {};
