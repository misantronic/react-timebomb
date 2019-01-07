import * as React from 'react';
import { render } from 'react-dom';
import {
    ReactTimebomb,
    ReactTimebombProps,
    ReactTimebombError
} from '../../src';
import { ReactTimebombDate } from '../../src/typings';
import styled from 'styled-components';

interface DatepickerWrapperProps {
    value?: ReactTimebombProps['value'];
    selectWeek?: ReactTimebombProps['selectWeek'];
    showCalendarWeek?: ReactTimebombProps['showCalendarWeek'];
    showConfirm?: ReactTimebombProps['showConfirm'];
    selectRange?: ReactTimebombProps['selectRange'];
    format: ReactTimebombProps['format'];
    placeholder?: ReactTimebombProps['placeholder'];
    minDate?: ReactTimebombProps['minDate'];
    maxDate?: ReactTimebombProps['maxDate'];
    disabled?: ReactTimebombProps['disabled'];
}

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
        const {
            disabled,
            placeholder,
            minDate,
            maxDate,
            format,
            showConfirm,
            showCalendarWeek,
            selectWeek,
            selectRange
        } = this.props;

        return (
            <div style={{ width: '100%', height: 36 }}>
                <ReactTimebomb
                    disabled={disabled}
                    selectRange={selectRange}
                    showConfirm={showConfirm}
                    showCalendarWeek={showCalendarWeek}
                    selectWeek={selectWeek}
                    placeholder={placeholder}
                    minDate={minDate}
                    maxDate={maxDate}
                    format={format}
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
    <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Row>
            <DatepickerWrapper
                format="DD.MM.YYYY"
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
        <Row>
            <DatepickerWrapper
                showCalendarWeek
                selectWeek
                format="DD.MM.YYYY"
                placeholder="Select week..."
            />
            <Space />
            <DatepickerWrapper
                selectRange
                showConfirm
                format="DD.MM.YYYY"
                placeholder="Select range..."
            />
        </Row>
        <Row>
            <DatepickerWrapper
                format="DD.MM.YYYY HH:mm"
                placeholder="Select date and time..."
            />
            <Space />
            <DatepickerWrapper format="HH:mm" placeholder="Select time..." />
        </Row>
        <Row>
            <DatepickerWrapper
                format="DD.MM.YYYY"
                value={new Date()}
                disabled
            />
        </Row>
    </div>,
    document.getElementById('app')
);
