/// <reference types="react" />
import { FormatType } from '../typings';
interface NumberInputProps {
    date: Date;
    mode: FormatType;
    step?: number;
    onChange(date: Date, mode: FormatType): void;
    onSubmit(date: Date, mode: FormatType): void;
    onCancel(date: undefined, mode: FormatType): void;
}
export declare function NumberInput(props: NumberInputProps): JSX.Element;
export {};
