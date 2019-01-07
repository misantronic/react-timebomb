import * as React from 'react';
import { SmallButton } from './button';

export interface ArrowButtonProps {
    open?: boolean;
    disabled?: boolean;
}

export const ArrowButton = (props: ArrowButtonProps) => (
    <SmallButton
        className="react-timebomb-arrow"
        disabled={props.disabled}
        tabIndex={-1}
    >
        {props.open ? '▲' : '▼'}
    </SmallButton>
);
