import * as React from 'react';
import { MenuProps } from './menu';
interface DayProps {
    day: Date;
    value: MenuProps['value'];
    date: MenuProps['date'];
    selectWeek: MenuProps['selectWeek'];
    minDate: MenuProps['minDate'];
    maxDate: MenuProps['maxDate'];
    onSelectDay: MenuProps['onSelectDay'];
}
interface DayState {
    current: boolean;
    enabled: boolean;
    today: boolean;
    selected: boolean;
}
export declare class Day extends React.PureComponent<DayProps, DayState> {
    constructor(props: DayProps);
    private readonly selected;
    componentDidMount(): void;
    componentDidUpdate(_prevProps: DayProps): void;
    render(): JSX.Element;
    private updateCache;
    private onSelectDay;
}
export {};
