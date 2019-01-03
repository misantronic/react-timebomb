import * as React from 'react';
import { ValueProps } from './value';
interface MultiValueProps {
    value: undefined | Date[];
    placeholder: ValueProps['placeholder'];
    open: ValueProps['open'];
    onToggle(): void;
    onClear(): void;
}
export declare class ValueMulti extends React.PureComponent<MultiValueProps> {
    constructor(props: MultiValueProps);
    render(): JSX.Element;
    private renderValue;
    private onClear;
}
export {};
