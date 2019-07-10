import * as React from 'react';
import { render } from 'react-dom';
import {
    ReactTimebomb,
    ReactTimebombProps,
    ReactTimebombError
} from '../../src';
import { ReactTimebombDate, ReactTimebombValueProps } from '../../src/typings';
import styled from 'styled-components';

type DatepickerWrapperProps = Partial<ReactTimebombProps>;

interface DatepickerWrapperState {
    value?: ReactTimebombDate;
    error?: boolean;
    format?: string;
}

const Row = styled.div`
    display: flex;
    margin-bottom: 40px;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const Space = styled.div`
    width: 40px;
    height: 36px;
`;

class DatepickerWrapper extends React.PureComponent<
    DatepickerWrapperProps,
    DatepickerWrapperState
> {
    constructor(props: DatepickerWrapperProps) {
        super(props);

        this.state = {
            value: props.value
        };

        this.onChange = this.onChange.bind(this);
        this.onError = this.onError.bind(this);
    }

    public render(): React.ReactNode {
        return (
            <div style={{ width: '100%', height: 36 }}>
                <ReactTimebomb
                    {...this.props}
                    value={this.state.value}
                    error={this.state.error}
                    onChange={this.onChange}
                    onError={this.onError}
                />
            </div>
        );
    }

    private onChange(valueA: Date, valueB?: Date) {
        const dates: (Date | undefined)[] = [].slice.call(arguments);

        console.info('onChange', dates.map(date => date && date.toISOString()));

        let value: ReactTimebombDate = valueA;

        if (valueB) {
            value = [valueA, valueB];
        }

        this.setState({ value, error: false });
    }

    private onError(error: ReactTimebombError, value: string) {
        console.info('onError', { error, value });

        this.setState({ error: true });
    }
}

render(
    <div
        style={{ display: 'flex', flexDirection: 'column', marginBottom: 400 }}
    >
        <h1>General</h1>
        <Row>
            <DatepickerWrapper
                format="MM / DD / YYYY"
                placeholder="Select date..."
            />
            <Space />
            <DatepickerWrapper
                showConfirm
                format="DD.MM.YYYY"
                placeholder="Select date and confirm..."
            />
        </Row>
        <Row>
            <DatepickerWrapper
                format="DD.MM.YYYY"
                placeholder="Select date..."
                value={new Date('2018-01-07')}
            />
            <Space />
            <DatepickerWrapper
                format="DD.MM.YYYY"
                placeholder="Select date with min- and max-date..."
                minDate={new Date('2000-02-01')}
                maxDate={new Date('2004-10-10')}
            />
        </Row>
        <h1>Date + Time</h1>
        <Row>
            <DatepickerWrapper
                showConfirm
                format="DD.MM.YYYY HH:mm"
                timeStep={15}
                placeholder="Select date and time in 24h-format..."
            />
            <Space />
            <DatepickerWrapper
                showConfirm
                format="DD.MM.YYYY hh:mm A"
                timeStep={15}
                placeholder="Select date and time..."
            />
        </Row>
        <Row>
            <DatepickerWrapper
                format="HH:mm"
                timeStep={5}
                placeholder="Select time in 24h-format..."
            />
            <Space />
            <DatepickerWrapper
                format="hh:mm a"
                timeStep={5}
                placeholder="Select time..."
            />
        </Row>
        <h1>Misc</h1>
        <Row>
            <DatepickerWrapper
                format="DD.MM.YYYY"
                placeholder="Disabled datepicker..."
                disabled
            />
            <Space />
            <DatepickerWrapper
                format="DD.MM.YYYY"
                placeholder="Custom labelComponent..."
                labelComponent={(props: ReactTimebombValueProps) => (
                    <>{props.value ? props.value.toISOString() : ''}</>
                )}
            />
        </Row>
        <h1>Mobile</h1>
        <Row>
            <DatepickerWrapper
                mobile
                format="DD.MM.YYYY"
                placeholder="Mobile datepicker..."
                minDate={new Date('2019-01-20')}
                maxDate={new Date('2019-04-28')}
            />
        </Row>
        <h1>Ranges</h1>
        <Row>
            <DatepickerWrapper
                showCalendarWeek
                selectRange="week"
                format="DD.MM.YYYY"
                placeholder="Select week..."
            />
            <Space />
            <div style={{ flex: '0 0 260px' }}>
                <DatepickerWrapper
                    selectRange
                    format="DD.MM.YYYY"
                    placeholder="Select range..."
                />
            </div>
            <Space />
            <DatepickerWrapper
                selectRange={4}
                format="DD.MM.YYYY"
                placeholder="Select 4 day-range..."
            />
        </Row>
    </div>,
    document.getElementById('app')
);
