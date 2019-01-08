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
    mode: ReactTimebombState['mode'];
    allowValidation: ReactTimebombState['allowValidation'];
    arrowButtonComponent: ReactTimebombProps['arrowButtonComponent'];
    disabled: ReactTimebombProps['disabled'];
    onToggle(): void;
    onChangeValueText(valueText?: string, commit?: boolean): void;
    onChangeFormatGroup(formatGroup: string): void;
    onAllSelect(): void;
    onSubmit(): void;
    onClear(): void;
}
interface ValueState {
    allSelected?: boolean;
}
export declare const Flex: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const Container: import("styled-components").StyledComponent<"div", any, {
    disabled?: boolean | undefined;
}, never>;
export declare const ClearButton: import("styled-components").StyledComponent<(props: {
    selected?: boolean | undefined;
} & React.ButtonHTMLAttributes<{}>) => JSX.Element, any, {}, never>;
export declare const Placeholder: import("styled-components").StyledComponent<"span", any, {}, never>;
export declare const Icon: import("styled-components").StyledComponent<"span", any, {
    icon: string;
}, never>;
export declare class Value extends React.PureComponent<ValueProps, ValueState> {
    private inputs;
    private readonly formatGroups;
    private readonly focused;
    private readonly iconClass;
    private readonly icon;
    constructor(props: ValueProps);
    componentDidUpdate(prevProps: ValueProps): void;
    componentDidMount(): void;
    render(): React.ReactNode;
    private renderValue;
    private selectText;
    private onSearchRef;
    private onKeyDown;
    private onKeyUp;
    private onClick;
    private onDblClick;
    private onFocus;
    private onBlur;
    private onChange;
    private onClear;
    private onToggle;
}
export {};
