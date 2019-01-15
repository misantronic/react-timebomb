import * as React from 'react';
import { MenuProps } from '.';
interface DayProps {
    day: Date;
    hoverDay?: Date;
    value: MenuProps['value'];
    date: MenuProps['date'];
    selectWeek: MenuProps['selectWeek'];
    selectRange: MenuProps['selectRange'];
    minDate: MenuProps['minDate'];
    maxDate: MenuProps['maxDate'];
    showTime: MenuProps['showTime'];
    onSelectDay: MenuProps['onSelectDay'];
    onMouseEnter(day: Date): void;
    onMouseLeave(day: Date): void;
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
    private onMouseEnter;
    private onMouseLeave;
}
interface WeekNumProps {
    day: Date;
    onClick(day: Date): void;
}
export declare class WeekNum extends React.PureComponent<WeekNumProps> {
    constructor(props: WeekNumProps);
    render(): JSX.Element;
    private onClick;
}
export {};
