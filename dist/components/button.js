"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const styled_components_1 = require("styled-components");
const StyledButton = styled_components_1.default.button `
    margin-right: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 3px 6px;
    height: 21px;
    box-sizing: border-box;
    background: ${(props) => (props.selected ? '#ccc' : '#fff')};

    ${(props) => props.mobile
    ? styled_components_1.css `
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
exports.Button = (props) => (React.createElement(StyledButton, Object.assign({ "data-react-timebomb-selectable": true, "data-role": "button", type: "button" }, props)));
exports.SmallButton = styled_components_1.default(exports.Button) `
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
exports.ArrowButton = (props) => (React.createElement(exports.SmallButton, { className: "react-timebomb-arrow", id: props.id, disabled: props.disabled, tabIndex: -1, onClick: props.onClick }, props.open ? '▲' : '▼'));
//# sourceMappingURL=button.js.map