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
    private readonly current;
    private readonly enabled;
    private readonly today;
    componentDidMount(): void;
    componentDidUpdate(prevProps: DayProps): void;
    render(): JSX.Element;
    private updateState;
    private onSelectDay;
}
export {};
