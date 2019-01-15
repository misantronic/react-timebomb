import * as React from 'react';
import { GestureState } from 'react-with-gesture';
export declare type GestureDirection = 'next' | 'prev';
interface MobileMenuTableWrapperWithGestureProps extends GestureState {
    children: React.ReactNode;
    onChangeMonth(direction: GestureDirection): void;
}
export declare class GestureWrapper extends React.PureComponent<{
    onChangeMonth(direction: GestureDirection): void;
}, {
    x?: string;
}> {
    constructor(props: any);
    componentDidUpdate(prevProps: MobileMenuTableWrapperWithGestureProps): void;
    render(): JSX.Element;
}
export {};
