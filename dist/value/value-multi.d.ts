/// <reference types="react" />
import { ValueProps } from './value';
interface MultiValueProps {
    value: undefined | Date[];
    placeholder: ValueProps['placeholder'];
    open: ValueProps['open'];
    arrowButtonComponent: ValueProps['arrowButtonComponent'];
    arrowButtonId: ValueProps['arrowButtonId'];
    clearComponent: ValueProps['clearComponent'];
    iconComponent: ValueProps['iconComponent'];
    disabled: ValueProps['disabled'];
    onToggle(): void;
    onClear(): void;
}
export declare function ValueMulti(props: MultiValueProps): JSX.Element;
export {};
