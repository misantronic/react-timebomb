import * as React from 'react';
import styled from 'styled-components';
import { isArray } from '../utils';
import { NumberInput } from '../components/number-input';
const Container = styled.div `
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
const Divider = styled.span `
    margin: 0 5px;
    font-weight: bold;
`;
export class MenuTime extends React.PureComponent {
    render() {
        const { date, timeStep, topDivider, onChange, onSubmit, onCancel } = this.props;
        if (isArray(date) || !date) {
            return null;
        }
        return (React.createElement(Container, { topDivider: topDivider, className: "react-timebomb-time" },
            React.createElement(NumberInput, { date: date, step: 1, mode: "hour", onChange: onChange, onSubmit: onSubmit, onCancel: onCancel }),
            React.createElement(Divider, { className: "divider" }, ":"),
            React.createElement(NumberInput, { date: date, step: timeStep, mode: "minute", onChange: onChange, onSubmit: onSubmit, onCancel: onCancel })));
    }
}
//# sourceMappingURL=time.js.map