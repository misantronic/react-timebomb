import { bind } from 'lodash-decorators';
import * as React from 'react';
import { render } from 'react-dom';
import {
    ReactTimebomb,
    ReactTimebombProps,
    ReactTimebombError
} from '../../src';

interface DatepickerWrapperProps {
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
            value: undefined,
            format: 'DD.MM.YYYY'
        };
    }

    public render(): React.ReactNode {
        return (
            <div
                style={{ display: 'flex', alignItems: 'center', width: '100%' }}
            >
                <ReactTimebomb
                    {...this.props}
                    format={this.state.format}
                    value={this.state.value}
                    onChange={this.onChange}
                    onError={this.onError}
                />
                <label style={{ whiteSpace: 'nowrap', margin: 8 }}>
                    <input
                        type="checkbox"
                        onChange={e =>
                            this.setState({
                                format: e.currentTarget.checked
                                    ? 'DD.MM.YYYY HH:mm'
                                    : 'DD.MM.YYYY'
                            })
                        }
                    />{' '}
                    time
                </label>
            </div>
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
            placeholder="Select date..."
            minDate={new Date('2018-04-14')}
            maxDate={new Date('2018-11-10')}
        />
    </div>,
    document.getElementById('app')
);
