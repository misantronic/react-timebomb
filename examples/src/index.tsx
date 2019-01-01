import * as React from 'react';
import { render } from 'react-dom';
import {
    ReactTimebomb,
    ReactTimebombProps,
    ReactTimebombError
} from '../../src';

interface DatepickerWrapperProps {
    selectWeek?: ReactTimebombProps['selectWeek'];
    showCalendarWeek?: ReactTimebombProps['showCalendarWeek'];
    showConfirm?: ReactTimebombProps['showConfirm'];
    format: ReactTimebombProps['format'];
    placeholder: ReactTimebombProps['placeholder'];
    minDate?: ReactTimebombProps['minDate'];
    maxDate?: ReactTimebombProps['maxDate'];
}

interface DatepickerWrapperState {
    value?: Date;
    format?: string;
}

class DatepickerWrapper extends React.PureComponent<
    DatepickerWrapperProps,
    DatepickerWrapperState
> {
    constructor(props) {
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
            selectWeek
        } = this.props;

        return (
            <div style={{ width: 300, height: 36 }}>
                <ReactTimebomb
                    showConfirm={showConfirm}
                    showCalendarWeek={showCalendarWeek}
                    selectWeek={selectWeek}
                    placeholder={placeholder}
                    minDate={minDate}
                    maxDate={maxDate}
                    format={format}
                    value={this.state.value}
                    onChange={this.onChange}
                    onError={this.onError}
                />
            </div>
        );
    }

    private onChange(value?: Date) {
        console.info('onChange', value);

        this.setState({ value });
    }

    private onError(error: ReactTimebombError, value: string) {
        console.info('onError', { error, value });
    }
}

render(
    <div style={{ display: 'flex' }}>
        <DatepickerWrapper
            // showConfirm
            // showCalendarWeek
            // selectWeek
            format="DD.MM.YYYY"
            placeholder="Select date..."
            minDate={new Date('2000-02-01')}
            maxDate={new Date('2004-10-10')}
        />

        <div style={{ width: 40 }} />

        <DatepickerWrapper
            showConfirm
            format="DD.MM.YYYY"
            placeholder="Select date and confirm..."
            minDate={new Date('2000-02-01')}
            maxDate={new Date('2022-10-10')}
        />

        {/* <DatepickerWrapper
            format="DD.MM.YYYY HH:mm"
            placeholder="Select date & time..."
            minDate={new Date('2010-04-14')}
            maxDate={new Date('2019-12-10')}
        /> */}
    </div>,
    document.getElementById('app')
);
