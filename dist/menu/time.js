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
const Meridiem = styled_components_1.default.span `
    margin: 0 10px;
`;
function MenuTime(props) {
    const { date, timeStep, topDivider, onChange, onSubmit, onCancel } = props;
    const meridiem = utils_1.getMeridiem(props.format);
    if (utils_1.isArray(date) || !date) {
        return null;
    }
    return (React.createElement(Container, { topDivider: topDivider, className: "react-timebomb-time" },
        React.createElement(number_input_1.NumberInput, { date: date, step: 1, mode: "hour", mode24Hours: utils_1.is24HoursFormat(props.format), onChange: onChange, onSubmit: onSubmit, onCancel: onCancel }),
        React.createElement(Divider, { className: "divider" }, ":"),
        React.createElement(number_input_1.NumberInput, { date: date, step: timeStep, mode: "minute", onChange: onChange, onSubmit: onSubmit, onCancel: onCancel }),
        meridiem && (React.createElement(Meridiem, { className: "meridiem" }, utils_1.dateFormat(date, meridiem)))));
}
exports.MenuTime = MenuTime;
//# sourceMappingURL=time.js.map