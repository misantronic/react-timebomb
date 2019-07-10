/// <reference types="react" />
import { ReactTimebombProps, ReactTimebombState, FormatType } from '../typings';
interface MenuTimeProps {
    date: ReactTimebombState['date'];
    timeStep: ReactTimebombProps['timeStep'];
    topDivider?: boolean;
    format?: string;
    onChange(date: Date, mode: FormatType): void;
    onSubmit(date: Date, mode: FormatType): void;
    onCancel(date: undefined, mode: FormatType): void;
}
export declare function MenuTime(props: MenuTimeProps): JSX.Element | null;
export {};
