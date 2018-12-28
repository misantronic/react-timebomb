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
    validateDate,
    setDate,
    clearSelection,
    endOfDay
} from './utils';
import {
    ReactTimebombProps,
    ReactTimebombState,
    ReactTimebombError
} from './typings';

export { ReactTimebombProps, ReactTimebombState, ReactTimebombError };

const DEFAULT_FORMAT = 'YYYY-MM-DD';

const Container = styled.div`
    width: 100%;
    position: relative;
    position: relative;
`;

const MenuWrapper = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    border: 1px solid #ccc;
    box-sizing: border-box;
    padding: 0;
    background: white;
    z-index: 1;
    max-height: ${(props: { menuHeight: number }) => props.menuHeight}px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;
`;

const BlindInput = styled.input`
    position: absolute;
    opacity: 0;
`;

export class ReactTimebomb extends React.Component<
    ReactTimebombProps,
    ReactTimebombState
> {
    /** @internal */
    public static getDerivedStateFromProps(
        props: ReactTimebombProps
    ): Partial<ReactTimebombState> | null {
        return {
            showTime: Boolean(
                props.format && /H|h|m|k|a|S|s/.test(props.format)
            )
        };
    }

    private get className() {
        const classNames = ['react-timebomb'];

        if (this.props.className) {
            classNames.push(this.props.className);
        }

        return classNames.join(' ');
    }

    constructor(props) {
        super(props);

        const { value, format = DEFAULT_FORMAT } = this.props;

        this.state = {
            allowValidation: false,
            mode: 'month',
            valueText: value ? dateFormat(value, format) : undefined,
            date: value || startOfDay(new Date())
        };

        this.onChangeValueText = this.onChangeValueText.bind(this);
        this.onValueSubmit = this.onValueSubmit.bind(this);
        this.onSelectDay = this.onSelectDay.bind(this);
        this.onModeYear = this.onModeYear.bind(this);
        this.onModeMonths = this.onModeMonths.bind(this);
        this.onSelectMonth = this.onSelectMonth.bind(this);
        this.onSelectYear = this.onSelectYear.bind(this);
        this.onToday = this.onToday.bind(this);
        this.onNextMonth = this.onNextMonth.bind(this);
        this.onPrevMonth = this.onPrevMonth.bind(this);
        this.onSelectTime = this.onSelectTime.bind(this);
    }

    public componentDidUpdate(
        prevProps: ReactTimebombProps,
        prevState: ReactTimebombState
    ): void {
        const { valueText } = this.state;
        const { value, format = DEFAULT_FORMAT } = this.props;

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
        const { valueText, allowValidation } = this.state;
        const { format = DEFAULT_FORMAT } = this.props;
        const validDate = validateDate(valueText, format);

        if (validDate) {
            this.setState({ allowValidation: true }, () => {
                const disabled = isDisabled(validDate, this.props);

                if (disabled) {
                    this.emitError('outOfRange', valueText!);
                } else {
                    this.setState({ date: validDate }, () =>
                        this.emitChange(validDate)
                    );
                }
            });
        } else if (valueText) {
            this.emitError('invalidDate', valueText);
        } else if (!isUndefined(valueText) && allowValidation) {
            this.emitChange(undefined);
        }
    }

    public render(): React.ReactNode {
        const {
            value,
            placeholder,
            menuWidth,
            showConfirm,
            showCalendarWeek,
            selectWeek,
            format = DEFAULT_FORMAT
        } = this.props;
        const { showTime, valueText, allowValidation, mode } = this.state;
        const menuHeight = 320;
        const minDate = this.props.minDate
            ? startOfDay(this.props.minDate)
            : undefined;
        const maxDate = this.props.maxDate
            ? endOfDay(this.props.maxDate)
            : undefined;

        return (
            <Select<Date> value={value} placeholder={placeholder}>
                {({ placeholder, open, onToggle, onRef, MenuContainer }) => (
                    <Container ref={onRef as any} className={this.className}>
                        {open ? (
                            <MenuContainer
                                menuWidth={menuWidth}
                                menuHeight={menuHeight}
                            >
                                <MenuWrapper menuHeight={menuHeight}>
                                    <MenuTitle
                                        mode={mode}
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
                                        showConfirm={showConfirm}
                                        showCalendarWeek={showCalendarWeek}
                                        selectWeek={selectWeek}
                                        date={this.state.date}
                                        value={value}
                                        valueText={valueText}
                                        format={format}
                                        mode={mode}
                                        minDate={minDate}
                                        maxDate={maxDate}
                                        onSelectDay={this.onSelectDay}
                                        onSelectMonth={this.onSelectMonth}
                                        onSelectYear={this.onSelectYear}
                                        onSelectTime={this.onSelectTime}
                                        onToggle={onToggle}
                                        onSubmit={this.onValueSubmit}
                                    />
                                </MenuWrapper>
                            </MenuContainer>
                        ) : (
                            <>
                                {this.onClose()}
                                <BlindInput type="text" onFocus={onToggle} />
                            </>
                        )}
                        <Value
                            placeholder={open ? undefined : placeholder}
                            format={format}
                            value={value}
                            valueText={valueText}
                            minDate={minDate}
                            maxDate={maxDate}
                            allowValidation={allowValidation}
                            open={open}
                            onChangeValueText={this.onChangeValueText}
                            onToggle={onToggle}
                            onSubmit={this.onValueSubmit}
                        />
                    </Container>
                )}
            </Select>
        );
    }

    private onClose(): null {
        clearSelection();

        setTimeout(() => {
            const { format = DEFAULT_FORMAT } = this.props;
            const validDate = validateDate(this.state.valueText, format);
            const isValid = validDate
                ? !isDisabled(validDate, this.props)
                : validDate;

            if (!isValid && this.props.value) {
                const formattedDate = dateFormat(this.props.value, format);

                if (this.state.valueText !== formattedDate) {
                    this.setState({ valueText: formattedDate });
                }
            }
        }, 0);

        return null;
    }

    private emitError(error: ReactTimebombError, value: string): void {
        if (this.props.onError && this.state.allowValidation) {
            this.props.onError(error, value);
        }
    }

    private emitChange(date?: Date): void {
        const { value } = this.props;

        if (value && date && value.getTime() === date.getTime()) {
            return;
        }

        this.props.onChange(date);

        this.setState({ allowValidation: Boolean(date) });
    }

    private onChangeValueText(valueText: string): void {
        this.setState({ valueText });
    }

    private onValueSubmit(onToggle: () => void): void {
        onToggle();
        clearSelection();
    }

    private onSelectDay(day: Date): void {
        const { value, format = DEFAULT_FORMAT } = this.props;
        let date = new Date(day);

        if (value) {
            date = setDate(day, value.getHours(), value.getMinutes());
        }

        const valueText = dateFormat(date, format);

        this.setState({ date, valueText }, () => this.emitChange(date));
    }

    private onModeYear() {
        this.setState({ mode: 'year' });
    }

    private onModeMonths() {
        this.setState({ mode: 'months' });
    }

    private onSelectMonth(date: Date) {
        this.setState({ date, mode: 'month' });
    }

    private onSelectYear(date: Date) {
        this.setState({ date, mode: 'months' });
    }

    private onToday(): void {
        const now = startOfDay(new Date());

        this.setState({ date: now });
    }

    private onNextMonth(): void {
        const date = new Date(this.state.date);

        date.setMonth(date.getMonth() + 1);

        this.setState({ date });
    }

    private onPrevMonth(): void {
        const date = new Date(this.state.date);

        date.setMonth(date.getMonth() - 1);

        this.setState({ date });
    }

    private onSelectTime(time: string): void {
        const { format = DEFAULT_FORMAT } = this.props;
        const value = this.props.value || new Date('1970-01-01');

        if (!time) {
            this.emitChange(startOfDay(value));
        } else {
            const splitted = time.split(':');
            const newDate = setDate(
                value,
                parseInt(splitted[0], 10),
                parseInt(splitted[1], 10)
            );

            const valueText = dateFormat(newDate, format);

            this.setState({ valueText }, () => this.emitChange(newDate));
        }
    }
}
