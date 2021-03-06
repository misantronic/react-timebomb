import * as React from 'react';
import styled, { css } from 'styled-components';

export interface ButtonProps {
    selected?: boolean;
    mobile?: boolean;
}

const StyledButton = styled.button`
    margin-right: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 3px 6px;
    height: 21px;
    line-height: 1;
    box-sizing: border-box;
    background: ${(props: ButtonProps) => (props.selected ? '#ccc' : '#fff')};

    ${(props: ButtonProps) =>
        props.mobile
            ? css`
                  font-size: 16px;
                  margin-right: 6px;
                  padding: 6px 12px;
                  height: auto;
                  min-height: 21px;
              `
            : ''}

    &:focus {
        outline: none;
    }

    &:disabled {
        cursor: not-allowed;
    }

    &:not(:disabled) {
        cursor: pointer;
    }

    &:not(:disabled):hover {
        background-color: ${(props: ButtonProps) =>
            props.selected ? '#ccc' : '#efefef'};
    }

    &:last-child {
        margin-right: 0;
    }
`;

export const Button = (props: ButtonProps & React.ButtonHTMLAttributes<{}>) => (
    <StyledButton
        data-react-timebomb-selectable
        data-role="button"
        type="button"
        {...props}
    />
);

export const SmallButton = styled(Button)`
    font-size: 13px;
    color: #ccc;
    cursor: pointer;
    border: none;

    &:hover:not(:disabled) {
        color: #333;
    }

    &:focus {
        outline: none;
    }
`;

export interface ArrowButtonProps {
    open?: boolean;
    disabled?: boolean;
    id?: string;
    onClick?(): void;
}

export const ArrowButton = (props: ArrowButtonProps) => (
    <SmallButton
        className="react-timebomb-arrow"
        id={props.id}
        disabled={props.disabled}
        tabIndex={-1}
        onClick={props.onClick}
    >
        {props.open ? '▲' : '▼'}
    </SmallButton>
);
