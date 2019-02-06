import * as React from 'react';
import styled from 'styled-components';
import { ReactTimebombState, FormatType } from '../typings';
import { isArray } from '../utils';
import { ReactTimebombProps } from 'src';
import { NumberInput } from '../components/number-input';

const Container = styled.div`
    padding: 0;
    display: flex;
    align-items: center;
    margin: 0 auto;
    width: 100%;
    border-top: ${(props: { topDivider?: boolean }) =>
        props.topDivider ? '1px solid #ccc' : 'none'};
`;

const Divider = styled.span`
    margin: 0 5px;
    font-weight: bold;
`;

interface MenuTimeProps {
    date: ReactTimebombState['date'];
    timeStep: ReactTimebombProps['timeStep'];
    topDivider?: boolean;
    onChange(date: Date, mode: FormatType): void;
}

export class MenuTime extends React.PureComponent<MenuTimeProps> {
    public render() {
        const { date, timeStep, topDivider, onChange } = this.props;

        if (isArray(date) || !date) {
            return null;
        }

        return (
            <Container topDivider={topDivider} className="react-timebomb-time">
                <NumberInput
                    date={date}
                    step={1}
                    mode="hour"
                    onChange={onChange}
                />
                <Divider className="divider">:</Divider>
                <NumberInput
                    date={date}
                    step={timeStep}
                    mode="minute"
                    onChange={onChange}
                />
            </Container>
        );
    }
}
