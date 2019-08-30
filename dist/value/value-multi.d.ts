import * as React from 'react';
export declare const ValueMulti: React.ForwardRefExoticComponent<Pick<import("../typings").ReactTimebombValueProps, "disabled" | "className" | "placeholder" | "onPaste" | "onSubmit" | "format" | "mode" | "open" | "mobile" | "innerRef" | "minDate" | "maxDate" | "showDate" | "showTime" | "allowValidation" | "arrowButtonComponent" | "clearComponent" | "arrowButtonId" | "iconComponent" | "labelComponent" | "timeStep" | "hoverDate" | "selectRange" | "onToggle" | "onChangeValueText" | "onChangeFormatGroup" | "onAllSelect" | "onClear"> & {
    value: Date[] | undefined;
    onValueSelect(date: Date, index: number): void;
} & React.RefAttributes<HTMLDivElement>>;
