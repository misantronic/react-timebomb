import * as React from 'react';
export interface ButtonProps {
    selected?: boolean;
    mobile?: boolean;
}
export declare const Button: (props: ButtonProps & React.ButtonHTMLAttributes<{}>) => JSX.Element;
export declare const SmallButton: import("styled-components").StyledComponent<(props: ButtonProps & React.ButtonHTMLAttributes<{}>) => JSX.Element, any, {}, never>;
export interface ArrowButtonProps {
    open?: boolean;
    disabled?: boolean;
    id?: string;
}
export declare const ArrowButton: (props: ArrowButtonProps) => JSX.Element;
