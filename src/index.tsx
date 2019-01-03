import * as React from 'react';
import styled from 'styled-components';
import { Select } from 'react-slct';
import { Menu } from './menu';
import { MenuTitle } from './menu-title';
import { Value } from './value';
import {
    isUndefined,
    startOfDay,
    isEnabled,
    dateFormat,
    validateDate,
    setDate,
    clearSelection,
    endOfDay,
    isBefore,
    isAfter,
    dateEqual,
    startOfWeek,
    endOfWeek
} from './utils';
import {
    ReactTimebombProps,
    ReactTimebombState,
    ReactTimebombError,
    ReactTimebombDate
} from './typings';
import { ValueMulti } from './value-multi';

export { ReactTimebombProps, ReactTimebombState, ReactTimebombError };

const Container = styled.div`
    width: 100%;
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
    left: 0;
    top: 0;
    opacity: 0;
    pointer-events: none;
`;

export class ReactTimebomb extends React.Component<
    ReactTimebombProps,
    ReactTimebombState
> {
    public static MENU_WIDTH = 320;
    public static MENU_HEIGHT = 320;

    private onToggle?: () => void;

    /** @internal */
    public static getDerivedStateFromProps(
        props: ReactTimebombProps
    ): Partial<ReactTimebombState> | null {
        return {
            showTime: Boolean(/H|h|m|k|a|S|s/.test(props.format!))
        };
    }

    /** @internal */
    public static defaultProps: Partial<ReactTimebombProps> = {
        format: 'YYYY-MM-DD'
    };

    private get className() {
        const classNames = ['react-timebomb'];

        if (this.props.className) {
            classNames.push(this.props.className);
        }

        if (this.props.error) {
            classNames.push('error');
        }

        return classNames.join(' ');
    }

    private get defaultDateValue() {
        const { value, minDate, maxDate } = this.props;

        if (value) {
            return value;
        }

        let date = new Date();

        if (maxDate && isBefore(maxDate, date)) {
            date = maxDate;
        } else if (minDate && isAfter(minDate, date)) {
            date = minDate;
        }

        return startOfDay(date);
    }

    private get initialState(): ReactTimebombState {
        return {
            allowValidation: false,
            mode: 'month',
            valueText: this.props.value
                ? dateFormat(this.props.value, this.props.format!)
                : undefined,
            date: this.defaultDateValue
        };
    }

    constructor(props: ReactTimebombProps) {
        super(props);

        const { minDate, maxDate, selectRange, showConfirm } = props;

        if (minDate && maxDate && isBefore(maxDate, minDate)) {
            throw new Error('minDate must appear before maxDate');
        }

        if (selectRange && !showConfirm) {
            throw new Error(
                'when using `selectRange` please also set `showConfirm`'
            );
        }

        this.state = this.initialState;

        this.onChangeValueText = this.onChangeValueText.bind(this);
        this.onValueSubmit = this.onValueSubmit.bind(this);
        this.onSelectDay = this.onSelectDay.bind(this);
        this.onModeYear = this.onModeYear.bind(this);
        this.onModeMonths = this.onModeMonths.bind(this);
        this.onSelectMonth = this.onSelectMonth.bind(this);
        this.onSelectYear = this.onSelectYear.bind(this);
        this.onReset = this.onReset.bind(this);
        this.onNextMonth = this.onNextMonth.bind(this);
        this.onPrevMonth = this.onPrevMonth.bind(this);
        this.onSelectTime = this.onSelectTime.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onClear = this.onClear.bind(this);
    }

    public componentDidUpdate(
        prevProps: ReactTimebombProps,
        prevState: ReactTimebombState
    ): void {
        const { valueText } = this.state;
        const { value, format } = this.props;

        if (prevProps.format !== format) {
            this.setState({
                valueText: value ? dateFormat(value, format!) : undefined
            });
        }

        if (prevState.valueText !== valueText) {
            this.valueTextDidUpdate(false);
        }
    }

    private valueTextDidUpdate(commit: boolean): void {
        const { valueText, allowValidation } = this.state;
        const { format } = this.props;
        const validDate = validateDate(valueText, format!);

        if (validDate) {
            this.setState({ allowValidation: true }, () => {
                const enabled = Array.isArray(validDate)
                    ? validDate.every(d => isEnabled('day', d, this.props))
                    : isEnabled('day', validDate, this.props);

                if (enabled) {
                    this.setState({ date: validDate }, () =>
                        this.emitChange(validDate, commit)
                    );
                } else {
                    this.emitError('outOfRange', valueText!);
                }
            });
        } else if (valueText) {
            this.emitError('invalidDate', valueText);
        } else if (!isUndefined(valueText) && allowValidation) {
            this.emitChange(undefined, commit);
        }
    }

    public render(): React.ReactNode {
        const {
            placeholder,
            menuWidth,
            showConfirm,
            showCalendarWeek,
            selectWeek,
            format,
            error
        } = this.props;
        const { showTime, valueText, mode } = this.state;
        const menuHeight = ReactTimebomb.MENU_HEIGHT;
        const minDate = this.props.minDate
            ? startOfDay(this.props.minDate)
            : undefined;
        const maxDate = this.props.maxDate
            ? endOfDay(this.props.maxDate)
            : undefined;
        const value = valueText
            ? validateDate(valueText, format!)
            : this.props.value;

        return (
            <Select<ReactTimebombDate>
                value={value}
                placeholder={placeholder}
                error={error}
                onClose={this.onClose}
            >
                {({ placeholder, open, onToggle, onRef, MenuContainer }) => {
                    this.onToggle = onToggle;

                    return (
                        <Container ref={onRef} className={this.className}>
                            {this.renderValue(value, placeholder, open)}
                            {open ? (
                                <MenuContainer
                                    menuWidth={Math.max(
                                        ReactTimebomb.MENU_WIDTH,
                                        menuWidth || 0
                                    )}
                                    menuHeight={menuHeight}
                                >
                                    <MenuWrapper
                                        className="react-timebomb-menu"
                                        menuHeight={menuHeight}
                                    >
                                        <MenuTitle
                                            mode={mode}
                                            date={this.state.date}
                                            minDate={minDate}
                                            maxDate={maxDate}
                                            onMonths={this.onModeMonths}
                                            onYear={this.onModeYear}
                                            onNextMonth={this.onNextMonth}
                                            onPrevMonth={this.onPrevMonth}
                                            onReset={this.onReset}
                                        />
                                        <Menu
                                            showTime={showTime}
                                            showConfirm={showConfirm}
                                            showCalendarWeek={showCalendarWeek}
                                            selectWeek={selectWeek}
                                            date={this.state.date}
                                            value={value}
                                            valueText={valueText}
                                            format={format!}
                                            mode={mode}
                                            minDate={minDate}
                                            maxDate={maxDate}
                                            onSelectDay={this.onSelectDay}
                                            onSelectMonth={this.onSelectMonth}
                                            onSelectYear={this.onSelectYear}
                                            onSelectTime={this.onSelectTime}
                                            onSubmit={this.onValueSubmit}
                                        />
                                    </MenuWrapper>
                                </MenuContainer>
                            ) : (
                                <BlindInput type="text" onFocus={onToggle} />
                            )}
                        </Container>
                    );
                }}
            </Select>
        );
    }

    private renderValue(
        value: ReactTimebombDate,
        placeholder?: string,
        open?: boolean
    ) {
        placeholder = open ? undefined : placeholder;

        const { minDate, maxDate, format, selectRange } = this.props;
        const { allowValidation } = this.state;

        if (selectRange || Array.isArray(value)) {
            const multiValue = value
                ? Array.isArray(value)
                    ? value
                    : [value]
                : undefined;

            return (
                <ValueMulti
                    onClear={this.onClear}
                    onToggle={this.onToggle!}
                    open={open}
                    placeholder={placeholder}
                    value={multiValue}
                />
            );
        }

        return (
            <Value
                placeholder={placeholder}
                format={format!}
                value={value}
                minDate={minDate}
                maxDate={maxDate}
                allowValidation={allowValidation}
                open={open}
                onClear={this.onClear}
                onChangeValueText={this.onChangeValueText}
                onToggle={this.onToggle!}
                onSubmit={this.onValueSubmit}
            />
        );
    }

    private onClose() {
        clearSelection();

        setTimeout(() => {
            clearSelection();

            this.setState(this.initialState);
        }, 16);
    }

    private emitError(
        error: ReactTimebombError,
        value: ReactTimebombState['valueText']
    ): void {
        if (this.state.allowValidation) {
            this.setState({ allowValidation: false }, () => {
                if (this.props.onError) {
                    this.props.onError(error, value);
                }
            });
        }
    }

    private emitChange(date: ReactTimebombDate, commit: boolean): void {
        const { value, showConfirm, onChange } = this.props;

        if (!showConfirm) {
            commit = true;
        }

        if (dateEqual(value, date)) {
            return;
        }

        if (commit) {
            if (Array.isArray(date)) {
                onChange(...date);
            } else {
                onChange(date);
            }
        }

        this.setState({ allowValidation: Boolean(date) });
    }

    private onClear() {
        this.setState({ valueText: undefined }, () => {
            this.emitChange(undefined, true);
        });
    }

    private onChangeValueText(valueText: string | undefined): void {
        this.setState({ valueText });
    }

    private onValueSubmit(): void {
        if (this.onToggle) {
            this.onToggle();
        }
        clearSelection();

        this.valueTextDidUpdate(true);
    }

    private onSelectDay(day: Date): void {
        const { value, format, selectWeek, selectRange } = this.props;

        const valueDate =
            value instanceof Date
                ? value
                : Array.isArray(value)
                ? value[0]
                : undefined;

        if (selectWeek) {
            const date = [startOfWeek(day), endOfWeek(day)];
            const valueText = dateFormat(date, format!);

            this.setState({ date, valueText });
        } else {
            const date = setDate(
                day,
                valueDate ? valueDate.getHours() : 0,
                valueDate ? valueDate.getMinutes() : 0
            );

            if (selectRange) {
                const dateArr =
                    Array.isArray(this.state.date) &&
                    this.state.date.length === 1
                        ? [...this.state.date, date]
                        : [date];

                dateArr.sort((a, b) => a.getTime() - b.getTime());

                const valueText = dateFormat(dateArr, format!);

                this.setState({ date, valueText });
            } else {
                const valueText = dateFormat(date, format!);

                this.setState({ date, valueText });
            }
        }
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

    private onReset(): void {
        this.setState({ date: this.defaultDateValue });
    }

    private onNextMonth(): void {
        const currentDate = Array.isArray(this.state.date)
            ? this.state.date[0]
            : this.state.date;
        const date = new Date(currentDate!);

        date.setMonth(date.getMonth() + 1);

        this.setState({ date });
    }

    private onPrevMonth(): void {
        const currentDate = Array.isArray(this.state.date)
            ? this.state.date[0]
            : this.state.date;
        const date = new Date(currentDate!);

        date.setMonth(date.getMonth() - 1);

        this.setState({ date });
    }

    private onSelectTime(time: string): void {
        const { format } = this.props;
        let value = this.props.value || new Date('1970-01-01');

        if (!time) {
            if (Array.isArray(value)) {
                value = value.map(v => startOfDay(v));
            }

            this.emitChange(value, false);
        } else {
            const splitted = time.split(':');
            const newDate = Array.isArray(value)
                ? value.map(d =>
                      setDate(
                          d,
                          parseInt(splitted[0], 10),
                          parseInt(splitted[1], 10)
                      )
                  )
                : setDate(
                      value,
                      parseInt(splitted[0], 10),
                      parseInt(splitted[1], 10)
                  );

            const valueText = dateFormat(newDate, format!);

            this.setState({ valueText }, () => this.emitChange(newDate, false));
        }
    }
}
