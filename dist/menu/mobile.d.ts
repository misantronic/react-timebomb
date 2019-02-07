import * as React from 'react';
import { GestureState } from 'react-with-gesture';
export declare type GestureDirection = 'next' | 'prev';
interface GestureWrapperProps extends GestureState {
    children: React.ReactNode;
    allowPrev: boolean;
    allowNext: boolean;
    onChangeMonth(direction: GestureDirection): void;
}
export declare class GestureWrapper extends React.PureComponent<{
    allowPrev: boolean;
    allowNext: boolean;
    onChangeMonth(direction: GestureDirection): void;
}, {
    x?: string;
    cooldown?: boolean;
}> {
    constructor(props: any);
    componentDidUpdate(prevProps: GestureWrapperProps): void;
    render(): JSX.Element;
}
export {};
