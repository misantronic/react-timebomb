import { bind } from 'lodash-decorators';
import * as React from 'react';
import styled from 'styled-components';
import { Select } from 'react-slct';
import { Menu } from './menu';
import { MenuTitle } from './menu-title';
import { Value } from './value';
import {
    isUndefined,
    startOfDay,
    isDisabled,
    dateFormat,
    validateDate
} from './utils';
import {
    ReactTimebombProps,
    ReactTimebombState,
    ReactTimebombError
} from './typings';

export { ReactTimebombProps, ReactTimebombState, ReactTimebombError };

const Container = styled.div`
    width: 100%;
    position: relative;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;
`;

const MenuWrapper = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    border: 1px solid #ccc;
    box-sizing: border-box;
    padding: 10px;
    background: white;
    z-index: 1;
    max-height: ${(props: { menuHeight: number }) => props.menuHeight};
    overflow: auto;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;
`;

const DEFAULT_FORMAT = 'YYYY-MM-DD';

export class ReactTimebomb extends React.Component<
    ReactTimebombProps,
    ReactTimebombState
> {
    private dateInput?: HTMLSpanElement;

    public static getDerivedStateFromProps(
        props: ReactTimebombProps
    ): Partial<ReactTimebombState> | null {
        return {
            showTime: Boolean(
                props.format && /H|h|m|k|a|S|s/.test(props.format)
            )
        };
    }

    private get dateValue() {
        const { value, format = DEFAULT_FORMAT } = this.props;
        const { valueText } = this.state;

        return !isUndefined(valueText)
            ? valueText
            : value
                ? dateFormat(value, format)
                : '';
    }

    constructor(props) {
        super(props);

        const { value, format = DEFAULT_FORMAT } = this.props;

        this.state = {
            mode: 'month',
            valueText: value ? dateFormat(value, format) : undefined,
            date: value || startOfDay(new Date())
        };
    }

    public componentDidUpdate(
        prevProps: ReactTimebombProps,
        prevState: ReactTimebombState
    ): void {
        const { valueText } = this.state;
        const { value, format = DEFAULT_FORMAT } = this.props;

        if (prevProps.value !== value) {
            this.setDateInputValue();
        }

        if (prevProps.format !== format) {
            this.setState({
                valueText: value ? dateFormat(value, format) : undefined
            });
        }

        if (prevState.valueText !== valueText) {
            this.valueTextDidUpdate();
        }
    }

    private valueTextDidUpdate(): void {
        const { valueText } = this.state;
        const { format = DEFAULT_FORMAT } = this.props;
        const validDate = validateDate(valueText, format);

        if (validDate) {
            const disabled = isDisabled(validDate, this.props);

            if (disabled) {
                this.throwError('outOfRange', valueText!);
            } else {
                this.setState({ date: validDate }, () =>
                    this.emitChange(validDate)
                );
            }
        } else if (valueText) {
            this.throwError('invalidDate', valueText);
        } else if (!isUndefined(valueText)) {
            this.emitChange(undefined);
        }
    }

    public render(): React.ReactNode {
        const { minDate, maxDate, value, format = DEFAULT_FORMAT } = this.props;
        const { showTime, valueText } = this.state;
        const placeholder = valueText ? undefined : this.props.placeholder;
        const menuHeight = 250;

        return (
            <Select<Date> value={value} placeholder={placeholder}>
                {({ placeholder, open, onToggle, MenuContainer }) => (
                    <Container className="react-timebomb">
                        {open && (
                            <MenuContainer menuHeight={menuHeight}>
                                <MenuWrapper menuHeight={menuHeight}>
                                    <MenuTitle
                                        date={this.state.date}
                                        minDate={minDate}
                                        maxDate={maxDate}
                                        onMonths={this.onModeMonths}
                                        onYear={this.onModeYear}
                                        onNextMonth={this.onNextMonth}
                                        onPrevMonth={this.onPrevMonth}
                                        onToday={this.onToday}
                                    />
                                    <Menu
                                        showTime={showTime}
                                        date={this.state.date}
                                        value={value as Date | undefined}
                                        mode={this.state.mode}
                                        minDate={minDate}
                                        maxDate={maxDate}
                                        onToggle={onToggle}
                                        onSelectDay={this.onSelectDay}
                                        onSelectMonth={this.onSelectMonth}
                                        onSelectYear={this.onSelectYear}
                                        onSelectTime={this.onSelectTime}
                                    />
                                </MenuWrapper>
                            </MenuContainer>
                        )}
                        <Value
                            placeholder={placeholder}
                            format={format}
                            value={value}
                            valueText={valueText}
                            open={open}
                            onToggle={onToggle}
                            onRef={this.onValueRef}
                            onChangeValueText={this.onChangeValueText}
                            onSubmit={onToggle}
                        />
                    </Container>
                )}
            </Select>
        );
    }

    private throwError(error: ReactTimebombError, value: string): void {
        if (this.props.onError && this.state.allowError) {
            this.props.onError(error, value);
        }
    }

    private emitChange(date?: Date): void {
        this.props.onChange(date);

        this.setState({ allowError: Boolean(date) });
    }

    private setDateInputValue(): void {
        const { dateInput, dateValue } = this;

        if (dateInput && dateInput.innerText !== dateValue) {
            dateInput.innerText = dateValue;
        }
    }

    @bind
    private onChangeValueText(valueText: string): void {
        this.setState({ valueText });
    }

    @bind
    private onValueRef(el?: HTMLSpanElement): void {
        this.dateInput = el;
    }

    @bind
    private onSelectDay(date: Date): void {
        const { value } = this.props;

        if (value) {
            date.setHours(value.getHours(), value.getMinutes());
        }

        this.setState({ date, valueText: undefined }, () =>
            this.emitChange(date)
        );
    }

    @bind
    private onModeYear() {
        this.setState({ mode: 'year' });
    }

    @bind
    private onModeMonths() {
        this.setState({ mode: 'months' });
    }

    @bind
    private onSelectMonth(date: Date) {
        this.setState({ date, mode: 'month' });
    }

    @bind
    private onSelectYear(date: Date) {
        this.setState({ date, mode: 'months' });
    }

    @bind
    private onToday(): void {
        const now = startOfDay(new Date());

        this.setState({ date: now });
    }

    @bind
    private onNextMonth(): void {
        const date = new Date(this.state.date);

        date.setMonth(date.getMonth() + 1);

        this.setState({ date });
    }

    @bind
    private onPrevMonth(): void {
        const date = new Date(this.state.date);

        date.setMonth(date.getMonth() - 1);

        this.setState({ date });
    }

    @bind
    private onSelectTime(time: string): void {
        const value = this.props.value || new Date('1970-01-01');

        if (!time) {
            this.emitChange(startOfDay(value));
        } else {
            const splitted = time.split(':');
            const newDate = new Date(value);

            newDate.setHours(
                parseInt(splitted[0], 10),
                parseInt(splitted[1], 10)
            );

            this.setState({ valueText: undefined }, () =>
                this.emitChange(newDate)
            );
        }
    }
}
