import { bind } from 'lodash-decorators';
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
            <ReactTimebomb
                menuWidth={300}
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
        );
    }

    @bind
    private onChange(value?: Date) {
        console.log('onChange', { value });

        this.setState({ value });
    }

    @bind
    private onError(error: ReactTimebombError, value: string) {
        console.warn('onError', { error, value });
    }
}

render(
    <div>
        <DatepickerWrapper
            showConfirm
            showCalendarWeek
            // selectWeek
            format="DD.MM.YYYY"
            placeholder="Select date..."
            minDate={new Date('2017-04-14')}
            maxDate={new Date('2019-11-10')}
        />

        <br />

        <DatepickerWrapper
            format="DD.MM.YYYY HH:mm"
            placeholder="Select date & time..."
            minDate={new Date('2010-04-14')}
            maxDate={new Date('2019-12-10')}
        />
    </div>,
    document.getElementById('app')
);
