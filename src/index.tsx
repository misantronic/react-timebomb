import * as React from 'react';
import styled, { css } from 'styled-components';
import { Select } from 'react-slct';
import { MenuContainerProps } from 'react-slct/dist/typings';
import { Menu } from './menu';
import { MenuTitle } from './menu/title';
import { Value } from './value/value';
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
    getFormatType,
    addDays,
    stringEqual
} from './utils';
import {
    ReactTimebombProps,
    ReactTimebombState,
    ReactTimebombError,
    ReactTimebombDate,
    FormatType
} from './typings';
import { ValueMulti } from './value/value-multi';

export * from './typings';

interface MenuWrapperProps {
    menuHeight: number | 'none';
    mobile?: boolean;
}

const Container = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    background: #fff;
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
    private MobileMenuContainer?: React.ComponentType<MenuContainerProps>;

    private menuRef: HTMLDivElement | null = null;

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
        MenuContainer: React.ComponentType<MenuContainerProps>
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
            mode: getFormatType(this.props.format!),
            valueText: this.props.value
                ? dateFormat(this.props.value, this.props.format!)
                : undefined,
            date: this.defaultDateValue,
            selectedRange: 0,
            menuHeight: 0,
            preventClose: false
        };
    }

    constructor(props: ReactTimebombProps) {
        super(props);

        const { minDate, maxDate } = props;

        if (minDate && maxDate && isBefore(maxDate, minDate)) {
            console.error(
                '[react-timebomb]: minDate must appear before maxDate'
            );
        }

        this.state = this.initialState;

        this.onChangeValueText = this.onChangeValueText.bind(this);
        this.emitChangeAndClose = this.emitChangeAndClose.bind(this);
        this.onSelectDay = this.onSelectDay.bind(this);
        this.onModeDay = this.onModeDay.bind(this);
        this.onModeYear = this.onModeYear.bind(this);
        this.onModeMonth = this.onModeMonth.bind(this);
        this.onSelectMonth = this.onSelectMonth.bind(this);
        this.onChangeMonth = this.onChangeMonth.bind(this);
        this.onSelectYear = this.onSelectYear.bind(this);
        this.onReset = this.onReset.bind(this);
        this.onNextMonth = this.onNextMonth.bind(this);
        this.onPrevMonth = this.onPrevMonth.bind(this);
        this.onSelectTime = this.onSelectTime.bind(this);
        this.onSubmitOrCancelTime = this.onSubmitOrCancelTime.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onChangeFormatGroup = this.onChangeFormatGroup.bind(this);
        this.onMenuRef = this.onMenuRef.bind(this);
        this.onMobileMenuContainerClick = this.onMobileMenuContainerClick.bind(
            this
        );
    }

    public async componentDidUpdate(
        prevProps: ReactTimebombProps,
        prevState: ReactTimebombState
    ) {
        const { valueText, showDate, showTime, preventClose } = this.state;
        const { value, format, selectRange, showConfirm } = this.props;

        if (prevProps.format !== format || prevProps.value !== value) {
            this.setState({
                valueText: value ? dateFormat(value, format!) : undefined
            });
        }

        if (!stringEqual(prevState.valueText, valueText)) {
            const result = await this.validateValueText();

            if (result.error) {
                this.emitError(result.error, result.valueText);
            }

            if (result.date) {
                const rangeIsComplete =
                    selectRange &&
                    isArray(result.date) &&
                    result.date.length === 2;

                if (
                    (!showConfirm && !selectRange && showDate) ||
                    rangeIsComplete
                ) {
                    if (prevState.mode === 'day' && !preventClose) {
                        this.emitChangeAndClose(result.date);
                    } else {
                        this.emitChange(result.date);
                    }
                }

                if (!showDate && showTime) {
                    this.emitChange(result.date);
                }
            }
        }
    }

    private setStateAsync<K extends keyof ReactTimebombState>(
        state:
            | ((
                  prevState: Readonly<ReactTimebombState>,
                  props: Readonly<ReactTimebombProps>
              ) => Pick<ReactTimebombState, K> | ReactTimebombState | null)
            | (Pick<ReactTimebombState, K> | ReactTimebombState | null)
    ) {
        return new Promise(resolve => {
            this.setState(state, resolve);
        });
    }

    private validateValueText(): Promise<{
        date?: ReactTimebombDate;
        error?: ReactTimebombError;
        valueText?: string | string[];
    }> {
        const { valueText, allowValidation } = this.state;
        const { format } = this.props;
        const validDate = validateDate(valueText, format!);

        return new Promise(async resolve => {
            if (validDate) {
                await this.setStateAsync({ allowValidation: true });

                const enabled = isArray(validDate)
                    ? validDate.some(d => isEnabled('day', d, this.props))
                    : isEnabled('day', validDate, this.props);

                if (enabled) {
                    await this.setStateAsync({ date: validDate });

                    resolve({ date: validDate });
                } else {
                    resolve({ error: 'outOfRange', valueText });
                }
            } else if (valueText) {
                resolve({ error: 'invalidDate', valueText });
            } else if (!isUndefined(valueText) && allowValidation) {
                resolve({ date: undefined });
            }
        });
    }

    public render(): React.ReactNode {
        const {
            placeholder,
            showConfirm,
            showCalendarWeek,
            selectRange,
            format,
            error,
            disabled,
            mobile,
            timeStep,
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
        const menuHeight = this.state.menuHeight || ReactTimebomb.MENU_HEIGHT;

        return (
            <Select<ReactTimebombDate>
                value={value}
                placeholder={placeholder}
                error={error}
                onOpen={onOpen}
                onClose={this.onClose}
            >
                {({ placeholder, open, onToggle, onRef, MenuContainer }) => {
                    const showMenu =
                        open && (showDate || showTime) && !disabled;
                    const className = [this.className];

                    if (showMenu) {
                        className.push('open');
                    }

                    this.onToggle = onToggle;

                    if (mobile) {
                        MenuContainer = this.getMobileMenuContainer(
                            MenuContainer
                        );
                    }

                    return (
                        <Container ref={onRef} className={className.join(' ')}>
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
                                        ref={this.onMenuRef}
                                    >
                                        <MenuTitle
                                            mode={mode}
                                            mobile={mobile}
                                            date={this.state.date}
                                            minDate={minDate}
                                            maxDate={maxDate}
                                            selectedRange={selectedRange}
                                            showTime={showTime}
                                            showDate={showDate}
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
                                            selectRange={selectRange}
                                            timeStep={timeStep}
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
                                            onChangeMonth={this.onChangeMonth}
                                            onSelectYear={this.onSelectYear}
                                            onSelectTime={this.onSelectTime}
                                            onSubmitTime={
                                                this.onSubmitOrCancelTime
                                            }
                                            onSubmit={this.emitChangeAndClose}
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
            timeStep,
            iconComponent,
            arrowButtonComponent,
            arrowButtonId,
            clearComponent,
            labelComponent
        } = this.props;
        const { showDate, showTime, allowValidation, mode } = this.state;
        const isMulti = selectRange || isArray(value);
        const componentValue: any = isMulti
            ? value
                ? isArray(value)
                    ? value
                    : [value]
                : undefined
            : value;
        const ValueComponent = isMulti ? ValueMulti : Value;

        return (
            <ValueComponent
                mode={mode}
                disabled={disabled}
                mobile={mobile}
                placeholder={placeholder}
                format={format!}
                value={componentValue}
                minDate={minDate}
                maxDate={maxDate}
                allowValidation={allowValidation}
                open={open}
                showDate={showDate}
                showTime={showTime}
                timeStep={timeStep}
                iconComponent={iconComponent}
                arrowButtonId={arrowButtonId}
                arrowButtonComponent={arrowButtonComponent}
                clearComponent={clearComponent}
                labelComponent={labelComponent}
                onClear={this.onClear}
                onChangeValueText={this.onChangeValueText}
                onChangeFormatGroup={this.onChangeFormatGroup}
                onToggle={this.onToggle!}
                onSubmit={this.emitChangeAndClose}
                onAllSelect={this.onModeDay}
            />
        );
    }

    private onClose() {
        clearSelection();

        setTimeout(async () => {
            clearSelection();

            await this.setStateAsync(this.initialState);

            if (this.props.onClose) {
                this.props.onClose();
            }
        }, 16);
    }

    private async emitError(
        error: ReactTimebombError,
        value: ReactTimebombState['valueText']
    ) {
        if (this.state.allowValidation) {
            await this.setStateAsync({ allowValidation: false });

            if (this.props.onError) {
                this.props.onError(error, value);
            }
        }
    }

    private emitChange = (() => {
        let timeout = 0;

        return (date: ReactTimebombDate) => {
            clearTimeout(timeout);

            timeout = setTimeout(async () => {
                const { value, onChange } = this.props;

                if (dateEqual(value, date)) {
                    return;
                }

                const changeDate = isArray(date) ? date : [date];

                onChange(...changeDate);

                await this.setStateAsync({
                    allowValidation: Boolean(date),
                    preventClose: false
                });
            }, 0);
        };
    })();

    private async emitChangeAndClose(newDate?: ReactTimebombDate) {
        if (this.onToggle) {
            this.onToggle();
        }
        clearSelection();

        const { date } = newDate
            ? { date: newDate }
            : await this.validateValueText();

        if (date) {
            this.emitChange(date);
        }
    }

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

    private setMenuHeight() {
        if (this.menuRef) {
            this.setState({
                menuHeight: this.menuRef.getBoundingClientRect().height
            });
        } else {
            this.setState({ menuHeight: 0 });
        }
    }

    private async onClear() {
        await this.setStateAsync({ valueText: undefined });

        this.emitChange(undefined);
    }

    private onChangeValueText(valueText: string | undefined): void {
        this.setState({ valueText, preventClose: true });
    }

    private async onChangeFormatGroup(format?: string) {
        await this.setStateAsync({
            menuHeight: 'none',
            mode: format ? getFormatType(format) : undefined
        });

        this.setMenuHeight();
    }

    private onSelectDay(day: Date): void {
        const { value, selectRange } = this.props;
        const format = this.props.format!;

        const valueDate = (() => {
            if (value instanceof Date) {
                return value;
            }

            if (isArray(value)) {
                return value[0];
            }

            return day;
        })();

        if (selectRange === 'week') {
            const date = [startOfWeek(day), endOfWeek(day)];
            const valueText = dateFormat(date, format);

            this.setState({ date, valueText });
        } else if (typeof selectRange === 'number') {
            const date = [day, addDays(day, selectRange - 1)];
            const valueText = dateFormat(date, format);

            this.setState({ date, valueText });
        } else if (selectRange === true) {
            const date = setDate(
                day,
                valueDate.getHours(),
                valueDate.getMinutes()
            );
            const dateArr =
                isArray(this.state.valueText) &&
                this.state.valueText.length === 1
                    ? [
                          validateDate(this.state.valueText[0], format) as Date,
                          date
                      ]
                    : [date];

            const selectedRange = this.getSelectedRange(dateArr);
            const valueText = dateFormat(dateArr.sort(sortDates), format);

            this.setState({ date: dateArr, valueText, selectedRange });
        } else {
            const date = setDate(
                day,
                valueDate.getHours(),
                valueDate.getMinutes()
            );
            const valueText = dateFormat(date, format);

            this.setState({ date, valueText });
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

    private onChangeMonth(date: Date) {
        this.setState({ date, mode: 'day' });
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

    private async onSelectTime(time: Date, mode: FormatType, commit = false) {
        const format = this.props.format!;
        const value = this.props.value || new Date();

        const newDate = isArray(value)
            ? value.map(d => setDate(d, time.getHours(), time.getMinutes()))
            : setDate(value, time.getHours(), time.getMinutes());

        const valueText = dateFormat(newDate, format);

        await this.setStateAsync({ mode, valueText });

        if (commit) {
            this.emitChange(newDate);
        }
    }

    private onSubmitOrCancelTime(time: Date | undefined, mode: FormatType) {
        if (time) {
            this.onSelectTime(time, mode, true);
        }

        if (this.onToggle) {
            this.onToggle();
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

    private onMenuRef(el: HTMLDivElement | null) {
        this.menuRef = el;

        this.setMenuHeight();
    }
}
