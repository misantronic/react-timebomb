import * as React from 'react';
import styled from 'styled-components';
import { ReactTimebombProps, ReactTimebombState, FormatType } from '../typings';
import { isArray, dateFormat, getMeridiem, is24HoursFormat } from '../utils';
import { NumberInput } from '../components/number-input';

const Container = styled.div`
    padding: 0;
    display: flex;
    align-items: center;
    margin: 0 auto;
    width: 100%;
    border-top: ${(props: { topDivider?: boolean }) =>
        props.topDivider ? '1px solid #ccc' : 'none'};

    &:not(:last-child) {
        border-bottom: 1px solid #ccc;
    }
`;

const Divider = styled.span`
    margin: 0 5px;
    font-weight: bold;
`;

const Meridiem = styled.span`
    margin: 0 10px;
`;

interface MenuTimeProps {
    date: ReactTimebombState['date'];
    timeStep: ReactTimebombProps['timeStep'];
    topDivider?: boolean;
    format?: string;
    onChange(date: Date, mode: FormatType): void;
    onSubmit(date: Date, mode: FormatType): void;
    onCancel(date: undefined, mode: FormatType): void;
}

export function MenuTime(props: MenuTimeProps) {
    const { date, timeStep, topDivider, onChange, onSubmit, onCancel } = props;
    const meridiem = getMeridiem(props.format);

    if (isArray(date) || !date) {
        return null;
    }

    return (
        <Container topDivider={topDivider} className="react-timebomb-time">
            <NumberInput
                date={date}
                step={1}
                mode="hour"
                mode24Hours={is24HoursFormat(props.format)}
                onChange={onChange}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
            <Divider className="divider">:</Divider>
            <NumberInput
                date={date}
                step={timeStep}
                mode="minute"
                onChange={onChange}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
            {meridiem && (
                <Meridiem className="meridiem">
                    {dateFormat(date, meridiem)}
                </Meridiem>
            )}
        </Container>
    );
}
