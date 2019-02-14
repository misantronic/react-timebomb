"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const styled_components_1 = require("styled-components");
const utils_1 = require("../utils");
const number_input_1 = require("../components/number-input");
const Container = styled_components_1.default.div `
    padding: 0;
    display: flex;
    align-items: center;
    margin: 0 auto;
    width: 100%;
    border-top: ${(props) => props.topDivider ? '1px solid #ccc' : 'none'};

    &:not(:last-child) {
        border-bottom: 1px solid #ccc;
    }
`;
const Divider = styled_components_1.default.span `
    margin: 0 5px;
    font-weight: bold;
`;
class MenuTime extends React.PureComponent {
    render() {
        const { date, timeStep, topDivider, onChange, onSubmit, onCancel } = this.props;
        if (utils_1.isArray(date) || !date) {
            return null;
        }
        return (React.createElement(Container, { topDivider: topDivider, className: "react-timebomb-time" },
            React.createElement(number_input_1.NumberInput, { date: date, step: 1, mode: "hour", onChange: onChange, onSubmit: onSubmit, onCancel: onCancel }),
            React.createElement(Divider, { className: "divider" }, ":"),
            React.createElement(number_input_1.NumberInput, { date: date, step: timeStep, mode: "minute", onChange: onChange, onSubmit: onSubmit, onCancel: onCancel })));
    }
}
exports.MenuTime = MenuTime;
//# sourceMappingURL=time.js.map