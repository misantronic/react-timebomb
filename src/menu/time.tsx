import * as React from 'react';
import styled from 'styled-components';
import { ReactTimebombState } from '../typings';
import { isArray } from '../utils';
import { ReactTimebombProps } from 'src';
import { NumberInput } from '../number-input';

const Container = styled.div`
    padding: 10px;
    display: flex;
    align-items: center;
    margin: 0 auto;
    width: 150px;
`;

const Divider = styled.span`
    margin: 0 5px;
    font-weight: bold;
`;

interface MenuTimeProps {
    date: ReactTimebombState['date'];
    timeStep: ReactTimebombProps['timeStep'];
    onChange(date: Date): void;
}

export class MenuTime extends React.PureComponent<MenuTimeProps> {
    constructor(props: MenuTimeProps) {
        super(props);

        this.onChangeMins = this.onChangeMins.bind(this);
        this.onChangeHours = this.onChangeHours.bind(this);
    }

    public render() {
        const { date, timeStep, onChange } = this.props;

        if (isArray(date) || !date) {
            return null;
        }

        return (
            <Container className="react-timebomb-time">
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

    private onChangeMins(e: React.SyntheticEvent<HTMLInputElement>) {
        const { date } = this.props;
        const { value } = e.currentTarget;

        console.log({ value });

        if (date && !isArray(date)) {
            const newDate = new Date(date);

            newDate.setMinutes(parseInt(value || '0', 10));

            this.props.onChange(newDate);
        }
    }

    private onChangeHours(e: React.SyntheticEvent<HTMLInputElement>) {
        const { date } = this.props;
        const { value } = e.currentTarget;

        if (date && !isArray(date)) {
            const newDate = new Date(date);

            newDate.setHours(parseInt(value || '0', 10));

            this.props.onChange(newDate);
        }
    }
}
