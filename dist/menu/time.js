import * as React from 'react';
import styled from 'styled-components';
import { isArray } from '../utils';
import { NumberInput } from '../number-input';
const Container = styled.div `
    padding: 0;
    display: flex;
    align-items: center;
    margin: 0 auto;
    width: 100%;
    border-top: ${(props) => props.topDivider ? '1px solid #ccc' : 'none'};
`;
const Divider = styled.span `
    margin: 0 5px;
    font-weight: bold;
`;
export class MenuTime extends React.PureComponent {
    render() {
        const { date, timeStep, topDivider, onChange } = this.props;
        if (isArray(date) || !date) {
            return null;
        }
        return (React.createElement(Container, { topDivider: topDivider, className: "react-timebomb-time" },
            React.createElement(NumberInput, { date: date, step: 1, mode: "hour", onChange: onChange }),
            React.createElement(Divider, { className: "divider" }, ":"),
            React.createElement(NumberInput, { date: date, step: timeStep, mode: "minute", onChange: onChange })));
    }
}
//# sourceMappingURL=time.js.map