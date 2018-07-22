import * as React from 'react';
import styled from 'styled-components';

export const Button = styled.button`
    margin-right: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 3px 6px;
    min-height: 21px;
    box-sizing: border-box;

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
        background-color: #efefef;
    }

    &:last-child {
        margin-right: 0;
    }
`;
