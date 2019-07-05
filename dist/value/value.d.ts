import * as React from 'react';
import { ClearComponentProps, ReactTimebombValueProps } from '../typings';
export declare const Flex: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const Container: import("styled-components").StyledComponent<"div", any, {
    disabled?: boolean | undefined;
}, never>;
export declare const ClearButton: import("styled-components").StyledComponent<(props: import("../components/button").ButtonProps & React.ButtonHTMLAttributes<{}>) => JSX.Element, any, {}, never>;
export declare const Placeholder: import("styled-components").StyledComponent<"span", any, {}, never>;
export declare const Icon: import("styled-components").StyledComponent<"span", any, {
    icon: string;
}, never>;
export declare const DefaultClearComponent: (props: ClearComponentProps) => JSX.Element;
export declare const Value: React.ForwardRefExoticComponent<ReactTimebombValueProps & React.RefAttributes<HTMLDivElement>>;
