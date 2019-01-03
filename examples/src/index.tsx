import * as React from 'react';
import { render } from 'react-dom';
import {
    ReactTimebomb,
    ReactTimebombProps,
    ReactTimebombError
} from '../../src';
import { ReactTimebombDate } from '../../src/typings';

interface DatepickerWrapperProps {
    selectWeek?: ReactTimebombProps['selectWeek'];
    showCalendarWeek?: ReactTimebombProps['showCalendarWeek'];
    showConfirm?: ReactTimebombProps['showConfirm'];
    selectRange?: ReactTimebombProps['selectRange'];
    format: ReactTimebombProps['format'];
    placeholder: ReactTimebombProps['placeholder'];
    minDate?: ReactTimebombProps['minDate'];
    maxDate?: ReactTimebombProps['maxDate'];
}

interface DatepickerWrapperState {
    value?: ReactTimebombDate;
    error?: boolean;
    format?: string;
}

class DatepickerWrapper extends React.PureComponent<
    DatepickerWrapperProps,
    DatepickerWrapperState
> {
    constructor(props: DatepickerWrapperProps) {
        super(props);

        this.state = {
            value: undefined
        };

        this.onChange = this.onChange.bind(this);
        this.onError = this.onError.bind(this);
    }

    public render(): React.ReactNode {
        const {
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
            <div style={{ width: 800, height: 36 }}>
                <ReactTimebomb
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
        <div style={{ display: 'flex', marginBottom: 40 }}>
            <DatepickerWrapper
                format="DD.MM.YYYY"
                placeholder="Select date..."
            />

            <div style={{ width: 40 }} />

            <DatepickerWrapper
                showConfirm
                format="DD.MM.YYYY"
                placeholder="Select date and confirm..."
            />
        </div>
        <div style={{ display: 'flex', marginBottom: 40 }}>
            <DatepickerWrapper
                format="DD.MM.YYYY"
                placeholder="Select date with min- and max-date..."
                minDate={new Date('2000-02-01')}
                maxDate={new Date('2004-10-10')}
            />
        </div>
        <div style={{ display: 'flex', marginBottom: 40 }}>
            <DatepickerWrapper
                showCalendarWeek
                selectWeek
                format="DD.MM.YYYY"
                placeholder="Select week..."
            />

            <div style={{ width: 40 }} />

            <DatepickerWrapper
                selectRange
                showConfirm
                format="DD.MM.YYYY"
                placeholder="Select range..."
            />
        </div>
        <div style={{ display: 'flex' }}>
            <DatepickerWrapper
                format="DD.MM.YYYY HH:mm"
                placeholder="Select date and time..."
            />
        </div>
    </div>,
    document.getElementById('app')
);
