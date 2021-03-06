/// <reference types="react" />
import { ReactTimebombProps, ReactTimebombState } from '../typings';
interface MenuTitleProps {
    date: ReactTimebombState['date'];
    minDate: ReactTimebombProps['minDate'];
    maxDate: ReactTimebombProps['maxDate'];
    mobile: ReactTimebombProps['mobile'];
    mode: ReactTimebombState['mode'];
    selectedRange: ReactTimebombState['selectedRange'];
    showTime: ReactTimebombState['showTime'];
    showDate: ReactTimebombState['showDate'];
    onPrevMonth(): void;
    onNextMonth(): void;
    onReset(): void;
    onMonth(): void;
    onYear(): void;
}
export declare function MenuTitle(props: MenuTitleProps): JSX.Element;
export {};
