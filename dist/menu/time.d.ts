import * as React from 'react';
import { ReactTimebombState } from '../typings';
import { ReactTimebombProps } from 'src';
interface MenuTimeProps {
    date: ReactTimebombState['date'];
    timeStep: ReactTimebombProps['timeStep'];
    onChange(date: Date): void;
}
export declare class MenuTime extends React.PureComponent<MenuTimeProps> {
    constructor(props: MenuTimeProps);
    render(): JSX.Element | null;
    private onChangeMins;
    private onChangeHours;
}
export {};
