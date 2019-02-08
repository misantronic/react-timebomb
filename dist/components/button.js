// @ts-ignore
import * as React from 'react';
import styled, { css } from 'styled-components';
const StyledButton = styled.button `
    margin-right: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 3px 6px;
    height: 21px;
    box-sizing: border-box;
    background: ${(props) => (props.selected ? '#ccc' : '#fff')};

    ${(props) => props.mobile
    ? css `
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
        background-color: ${(props) => props.selected ? '#ccc' : '#efefef'};
    }

    &:last-child {
        margin-right: 0;
    }
`;
export const Button = (props) => (React.createElement(StyledButton, Object.assign({ "data-react-timebomb-selectable": true, "data-role": "button", type: "button" }, props)));
export const SmallButton = styled(Button) `
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
export const ArrowButton = (props) => (React.createElement(SmallButton, { className: "react-timebomb-arrow", id: props.id, disabled: props.disabled, tabIndex: -1 }, props.open ? '▲' : '▼'));
//# sourceMappingURL=button.js.map