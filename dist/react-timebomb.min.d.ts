import * as React from 'react';
import { ReactTimebombProps, ReactTimebombState, ReactTimebombError } from './typings';
export { ReactTimebombProps, ReactTimebombState, ReactTimebombError };
export declare class ReactTimebomb extends React.Component<ReactTimebombProps, ReactTimebombState> {
    private readonly className;
    constructor(props: any);
    componentDidUpdate(prevProps: ReactTimebombProps, prevState: ReactTimebombState): void;
    private valueTextDidUpdate;
    render(): React.ReactNode;
    private onClose;
    private emitError;
    private emitChange;
    private onChangeValueText;
    private onValueSubmit;
    private onSelectDay;
    private onModeYear;
    private onModeMonths;
    private onSelectMonth;
    private onSelectYear;
    private onToday;
    private onNextMonth;
    private onPrevMonth;
    private onSelectTime;
}
