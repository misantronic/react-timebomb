// @ts-ignore
import * as React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps {
    selected?: boolean;
    mobile?: boolean;
}

const StyledButton = styled.button`
    margin-right: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 3px 6px;
    min-height: 21px;
    box-sizing: border-box;
    background: ${(props: ButtonProps) => (props.selected ? '#ccc' : '#fff')};

    ${(props: ButtonProps) =>
        props.mobile
            ? css`
                  font-size: 16px;
                  margin-right: 6px;
                  padding: 6px 12px;
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
    line-height: 1;

    &:hover:not(:disabled) {
        color: #333;
    }

    &:focus {
        outline: none;
    }
`;
