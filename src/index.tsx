import * as React from 'react';
import styled, { css } from 'styled-components';
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
    endOfWeek,
    sortDates,
    isDateFormat,
    isTimeFormat,
    isArray,
    getFormatType
} from './utils';
import {
    ReactTimebombProps,
    ReactTimebombState,
    ReactTimebombError,
    ReactTimebombDate,
    ReactTimebombArrowButtonProps
} from './typings';
import { ValueMulti } from './value-multi';
import { MenuContainerProps } from 'react-slct/dist/typings';

export {
    ReactTimebombProps,
    ReactTimebombState,
    ReactTimebombError,
    ReactTimebombDate,
    ReactTimebombArrowButtonProps
};

interface MenuWrapperProps {
    menuHeight: number;
    mobile?: boolean;
}

const Container = styled.div`
    width: 100%;
    height: 100%;
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
    height: 100%;
    max-height: ${(props: MenuWrapperProps) => props.menuHeight}px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;

    * {
        box-sizing: border-box;
    }

    ${(props: MenuWrapperProps) =>
        props.mobile
            ? css`
                  position: fixed;
                  left: 50% !important;
                  top: 50% !important;
                  max-width: 96%;
                  width: 360px !important;
                  height: 320px !important;
                  margin-left: -180px;
                  margin-top: -160px;
                  max-height: 100%;
                  font-size: 16px;
                  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);

                  @media (max-width: 360px) {
                      width: 100% !important;
                      left: 0 !important;
                      margin-left: 0;
                      max-width: 100%;
                  }
              `
            : ''}
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
    private MobileMenuContainer?: React.ComponentClass<MenuContainerProps, any>;

    /** @internal */
    public static getDerivedStateFromProps(
        props: ReactTimebombProps
    ): Partial<ReactTimebombState> | null {
        const format = props.format!;
        const { minDate, maxDate } = props;

        return {
            minDate: minDate ? startOfDay(minDate) : undefined,
            maxDate: maxDate ? endOfDay(maxDate) : undefined,
            showTime: isTimeFormat(format),
            showDate: isDateFormat(format)
        };
    }

    /** @internal */
    public static defaultProps: Partial<ReactTimebombProps> = {
        format: 'YYYY-MM-DD'
    };

    private getMobileMenuContainer(
        MenuContainer: React.ComponentClass<MenuContainerProps, any>
    ) {
        if (!this.MobileMenuContainer) {
            this.MobileMenuContainer = styled(MenuContainer)`
                position: fixed;
                left: 0 !important;
                top: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: rgba(0, 0, 0, 0.12);
                transform: none;
            ` as any;
        }

        return this.MobileMenuContainer!;
    }

    private get className() {
        const classNames = ['react-timebomb'];

        if (this.props.className) {
            classNames.push(this.props.className);
        }

        if (this.props.error) {
            classNames.push('error');
        }

        if (this.props.disabled) {
            classNames.push('disabled');
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
            mode: 'day',
            valueText: this.props.value
                ? dateFormat(this.props.value, this.props.format!)
                : undefined,
            date: this.defaultDateValue,
            selectedRange: 0
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
        this.onModeDay = this.onModeDay.bind(this);
        this.onModeYear = this.onModeYear.bind(this);
        this.onModeMonth = this.onModeMonth.bind(this);
        this.onSelectMonth = this.onSelectMonth.bind(this);
        this.onSelectYear = this.onSelectYear.bind(this);
        this.onReset = this.onReset.bind(this);
        this.onNextMonth = this.onNextMonth.bind(this);
        this.onPrevMonth = this.onPrevMonth.bind(this);
        this.onSelectTime = this.onSelectTime.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onChangeFormatGroup = this.onChangeFormatGroup.bind(this);
        this.onMobileMenuContainerClick = this.onMobileMenuContainerClick.bind(
            this
        );
    }

    public componentDidUpdate(
        prevProps: ReactTimebombProps,
        prevState: ReactTimebombState
    ): void {
        const { valueText } = this.state;
        const { value, format } = this.props;

        if (prevProps.format !== format || prevProps.value !== value) {
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
                const enabled = isArray(validDate)
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
            showConfirm,
            showCalendarWeek,
            selectWeek,
            selectRange,
            format,
            error,
            disabled,
            mobile,
            onOpen
        } = this.props;
        const {
            showDate,
            showTime,
            valueText,
            mode,
            selectedRange,
            minDate,
            maxDate
        } = this.state;
        const value = valueText
            ? validateDate(valueText, format!)
            : this.props.value;
        const menuWidth = Math.max(
            ReactTimebomb.MENU_WIDTH,
            this.props.menuWidth || 0
        );
        const menuHeight = ReactTimebomb.MENU_HEIGHT;

        return (
            <Select<ReactTimebombDate>
                value={value}
                placeholder={placeholder}
                error={error}
                onOpen={onOpen}
                onClose={this.onClose}
            >
                {({ placeholder, open, onToggle, onRef, MenuContainer }) => {
                    const showMenu = open && showDate && !disabled;

                    this.onToggle = onToggle;

                    if (mobile) {
                        MenuContainer = this.getMobileMenuContainer(
                            MenuContainer
                        );
                    }

                    return (
                        <Container ref={onRef} className={this.className}>
                            {this.renderValue(value, placeholder, open)}
                            {showMenu ? (
                                <MenuContainer
                                    menuWidth={menuWidth}
                                    menuHeight={menuHeight}
                                    onClick={
                                        mobile
                                            ? this.onMobileMenuContainerClick
                                            : undefined
                                    }
                                >
                                    <MenuWrapper
                                        className="react-timebomb-menu"
                                        menuHeight={menuHeight}
                                        mobile={mobile}
                                    >
                                        <MenuTitle
                                            mode={mode}
                                            mobile={mobile}
                                            date={this.state.date}
                                            minDate={minDate}
                                            maxDate={maxDate}
                                            selectedRange={selectedRange}
                                            onMonth={this.onModeMonth}
                                            onYear={this.onModeYear}
                                            onNextMonth={this.onNextMonth}
                                            onPrevMonth={this.onPrevMonth}
                                            onReset={this.onReset}
                                        />
                                        <Menu
                                            showTime={showTime}
                                            showDate={showDate}
                                            showConfirm={showConfirm}
                                            showCalendarWeek={showCalendarWeek}
                                            selectWeek={selectWeek}
                                            selectRange={selectRange}
                                            date={this.state.date}
                                            value={value}
                                            valueText={valueText}
                                            format={format!}
                                            mode={mode}
                                            mobile={mobile}
                                            minDate={minDate}
                                            maxDate={maxDate}
                                            selectedRange={selectedRange}
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

        const {
            minDate,
            maxDate,
            disabled,
            format,
            selectRange,
            mobile,
            arrowButtonComponent
        } = this.props;
        const { showDate, showTime, allowValidation, mode } = this.state;

        if (selectRange || isArray(value)) {
            const multiValue = value
                ? isArray(value)
                    ? value
                    : [value]
                : undefined;

            return (
                <ValueMulti
                    open={open}
                    disabled={disabled}
                    placeholder={placeholder}
                    value={multiValue}
                    arrowButtonComponent={arrowButtonComponent}
                    onClear={this.onClear}
                    onToggle={this.onToggle!}
                />
            );
        }

        return (
            <Value
                mode={mode}
                disabled={disabled}
                mobile={mobile}
                placeholder={placeholder}
                format={format!}
                value={value}
                minDate={minDate}
                maxDate={maxDate}
                allowValidation={allowValidation}
                open={open}
                showDate={showDate}
                showTime={showTime}
                arrowButtonComponent={arrowButtonComponent}
                onClear={this.onClear}
                onChangeValueText={this.onChangeValueText}
                onChangeFormatGroup={this.onChangeFormatGroup}
                onToggle={this.onToggle!}
                onSubmit={this.onValueSubmit}
                onAllSelect={this.onModeDay}
            />
        );
    }

    private onClose() {
        clearSelection();

        setTimeout(() => {
            clearSelection();

            this.setState(this.initialState, () => {
                if (this.props.onClose) {
                    this.props.onClose();
                }
            });
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

    private emitChange = (() => {
        let timeout: NodeJS.Timeout;

        return (date: ReactTimebombDate, commit: boolean) => {
            clearTimeout(timeout);

            timeout = setTimeout(() => {
                const { value, showConfirm, onChange } = this.props;

                if (!showConfirm) {
                    commit = true;
                }

                if (dateEqual(value, date)) {
                    return;
                }

                if (commit) {
                    if (isArray(date)) {
                        onChange(...date);
                    } else {
                        onChange(date);
                    }
                }

                this.setState({ allowValidation: Boolean(date) });
            }, 0);
        };
    })();

    private getSelectedRange(date: ReactTimebombDate) {
        if (isArray(date)) {
            if (date.length === 2) {
                if (date[0] > date[1]) {
                    return 0;
                } else {
                    return 1;
                }
            } else if (date.length === 1) {
                return 0;
            }
        } else {
            return 0;
        }

        return this.state.selectedRange;
    }

    private onClear() {
        this.setState({ valueText: undefined }, () => {
            this.emitChange(undefined, true);
        });
    }

    private onChangeValueText(valueText: string | undefined): void {
        this.setState({ valueText });
    }

    private onChangeFormatGroup(format?: string) {
        this.setState({ mode: format ? getFormatType(format) : undefined });
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
                : isArray(value)
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
                    isArray(this.state.valueText) &&
                    this.state.valueText.length === 1
                        ? [
                              validateDate(
                                  this.state.valueText[0],
                                  format!
                              ) as Date,
                              date
                          ]
                        : [date];

                const selectedRange = this.getSelectedRange(dateArr);
                const valueText = dateFormat(dateArr.sort(sortDates), format!);

                this.setState({ date: dateArr, valueText, selectedRange });
            } else {
                const valueText = dateFormat(date, format!);

                this.setState({ date, valueText });
            }
        }
    }

    private onModeDay() {
        this.setState({ mode: 'day' });
    }

    private onModeYear() {
        this.setState({ mode: 'year' });
    }

    private onModeMonth() {
        this.setState({ mode: 'month' });
    }

    private onSelectMonth(date: Date) {
        this.onSelectDay(date);
        this.setState({ mode: 'day' });
    }

    private onSelectYear(date: Date) {
        this.onSelectDay(date);
        this.setState({ mode: 'day' });
    }

    private onReset(): void {
        this.setState({ date: this.defaultDateValue });
    }

    private onNextMonth(): void {
        const currentDate = isArray(this.state.date)
            ? this.state.date[this.state.selectedRange]
            : this.state.date;

        if (currentDate) {
            const date = new Date(currentDate);

            date.setMonth(date.getMonth() + 1);

            this.setState({ date });
        }
    }

    private onPrevMonth(): void {
        const currentDate = isArray(this.state.date)
            ? this.state.date[this.state.selectedRange]
            : this.state.date;

        if (currentDate) {
            const date = new Date(currentDate);

            date.setMonth(date.getMonth() - 1);

            this.setState({ date });
        }
    }

    private onSelectTime(time: string): void {
        const { format } = this.props;
        let value = this.props.value || new Date('1970-01-01');

        if (!time) {
            if (isArray(value)) {
                value = value.map(v => startOfDay(v));
            }

            this.emitChange(value, false);
        } else {
            const splitted = time.split(':');
            const newDate = isArray(value)
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

    private onMobileMenuContainerClick(e: React.MouseEvent<HTMLDivElement>) {
        if (
            e.target instanceof HTMLDivElement &&
            e.target.classList.contains('react-slct-menu')
        ) {
            if (this.onToggle) {
                this.onToggle();
            }
        }
    }
}
