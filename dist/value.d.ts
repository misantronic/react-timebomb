import * as React from 'react';
import { ReactTimebombProps } from './typings';
export interface ValueProps {
    open?: boolean;
    value?: Date;
    format: string;
    placeholder: ReactTimebombProps['placeholder'];
    minDate: ReactTimebombProps['minDate'];
    maxDate: ReactTimebombProps['maxDate'];
    allowValidation?: boolean;
    onToggle(): void;
    onChangeValueText(valueText?: string, commit?: boolean): void;
    onSubmit(): void;
    onClear(): void;
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
    private onBlur;
    private onChange;
    private onClear;
    private onToggle;
}
