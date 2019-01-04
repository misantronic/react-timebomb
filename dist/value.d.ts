import * as React from 'react';
import { ReactTimebombProps, ReactTimebombState } from './typings';
export interface ValueProps {
    open?: boolean;
    value?: Date;
    format: string;
    placeholder: ReactTimebombProps['placeholder'];
    minDate: ReactTimebombProps['minDate'];
    maxDate: ReactTimebombProps['maxDate'];
    showDate: ReactTimebombState['showDate'];
    showTime: ReactTimebombState['showTime'];
    allowValidation: ReactTimebombState['allowValidation'];
    onToggle(): void;
    onChangeValueText(valueText?: string, commit?: boolean): void;
    onSubmit(): void;
    onClear(): void;
}
interface ValueState {
    currentFormatGroup?: string;
}
export declare const Flex: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const Container: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const ArrowButton: import("styled-components").StyledComponent<(props: {
    selected?: boolean | undefined;
} & React.ButtonHTMLAttributes<{}>) => JSX.Element, any, {}, never>;
export declare const ClearButton: import("styled-components").StyledComponent<(props: {
    selected?: boolean | undefined;
} & React.ButtonHTMLAttributes<{}>) => JSX.Element, any, {}, never>;
export declare const Placeholder: import("styled-components").StyledComponent<"span", any, {}, never>;
export declare const Icon: import("styled-components").StyledComponent<"span", any, {}, never>;
export declare class Value extends React.PureComponent<ValueProps, ValueState> {
    private searchInputs;
    private readonly formatGroups;
    private readonly focused;
    private readonly iconClass;
    private readonly icon;
    constructor(props: ValueProps);
    componentDidUpdate(prevProps: ValueProps): void;
    render(): React.ReactNode;
    private renderValue;
    private selectText;
    private onSearchRef;
    private onKeyDown;
    private onKeyUp;
    private onClick;
    private onFocus;
    private onBlur;
    private onChange;
    private onClear;
    private onToggle;
}
export {};
