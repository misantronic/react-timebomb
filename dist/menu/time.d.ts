import * as React from 'react';
import { ReactTimebombState, FormatType } from '../typings';
import { ReactTimebombProps } from 'src';
interface MenuTimeProps {
    date: ReactTimebombState['date'];
    timeStep: ReactTimebombProps['timeStep'];
    topDivider?: boolean;
    onChange(date: Date, mode: FormatType): void;
    onSubmit(date: Date, mode: FormatType): void;
    onCancel(date: undefined, mode: FormatType): void;
}
export declare class MenuTime extends React.PureComponent<MenuTimeProps> {
    render(): JSX.Element | null;
}
export {};
