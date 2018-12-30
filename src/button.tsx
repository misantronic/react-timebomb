// @ts-ignore
import * as React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
    margin-right: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 3px 6px;
    min-height: 21px;
    box-sizing: border-box;
    background: ${(props: { selected?: boolean }) =>
        props.selected ? '#ccc' : '#fff'};

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
        background-color: ${(props: { selected?: boolean }) =>
            props.selected ? '#ccc' : '#efefef'};
    }

    &:last-child {
        margin-right: 0;
    }
`;

export const Button = (
    props: { selected?: boolean } & React.ButtonHTMLAttributes<{}>
) => (
    <StyledButton
        data-react-timebomb-selectable
        data-role="button"
        {...props}
    />
);
