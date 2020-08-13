import * as React from 'react';
export declare const ValueMulti: React.ForwardRefExoticComponent<Pick<import("../typings").ReactTimebombValueProps, "className" | "format" | "mode" | "onPaste" | "onSubmit" | "placeholder" | "disabled" | "open" | "onToggle" | "mobile" | "innerRef" | "minDate" | "maxDate" | "showDate" | "showTime" | "allowValidation" | "arrowButtonComponent" | "clearComponent" | "arrowButtonId" | "iconComponent" | "labelComponent" | "timeStep" | "hoverDate" | "selectRange" | "onChangeValueText" | "onChangeFormatGroup" | "onAllSelect" | "onClear"> & {
    value: Date[] | undefined;
    onValueSelect(date: Date, index: number): void;
} & React.RefAttributes<HTMLDivElement>>;
