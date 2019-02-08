import * as React from 'react';
import { ValueProps } from './value';
interface MultiValueProps {
    value: undefined | Date[];
    placeholder: ValueProps['placeholder'];
    open: ValueProps['open'];
    arrowButtonComponent: ValueProps['arrowButtonComponent'];
    arrowButtonId: ValueProps['arrowButtonId'];
    disabled: ValueProps['disabled'];
    onToggle(): void;
    onClear(): void;
}
export declare class ValueMulti extends React.PureComponent<MultiValueProps> {
    constructor(props: MultiValueProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    private renderValue;
    private onClear;
    private onKeyUp;
}
export {};
