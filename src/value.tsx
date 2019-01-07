import * as React from 'react';
import styled from 'styled-components';
import {
    keys,
    formatNumber,
    splitDate,
    joinDates,
    stringFromCharCode,
    validateFormatGroup,
    getAttribute,
    getFormatType,
    manipulateDate,
    isEnabled
} from './utils';
import { ReactTimebombProps, ReactTimebombState } from './typings';
import { SmallButton } from './button';
import { ArrowButton } from './arrow-button';

export interface ValueProps {
    open?: boolean;
    value?: Date;
    format: string;
    placeholder: ReactTimebombProps['placeholder'];
    minDate: ReactTimebombProps['minDate'];
    maxDate: ReactTimebombProps['maxDate'];
    showDate: ReactTimebombState['showDate'];
    showTime: ReactTimebombState['showTime'];
    allowValidation: ReactTimebombState['allowValidation'];
    arrowButtonComponent: ReactTimebombProps['arrowButtonComponent'];
    disabled: ReactTimebombProps['disabled'];
    onToggle(): void;
    onChangeValueText(valueText?: string, commit?: boolean): void;
    onSubmit(): void;
    onClear(): void;
}

interface ValueState {
    currentFormatGroup?: string;
}

interface InputProps {
    disabled?: boolean;
}

export const Flex = styled.div`
    display: flex;
    align-items: center;
    white-space: nowrap;
    position: relative;
`;

export const Container = styled(Flex)`
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    border: 1px solid #ccc;
    cursor: ${(props: { disabled?: boolean }) =>
        props.disabled ? 'not-allowed' : 'pointer'};
    width: 100%;
    height: 100%;
    box-sizing: border-box;
`;

const Input = styled.span`
    padding: 2px 0 2px 0;
    min-width: 1px;
    cursor: ${(props: InputProps) => (props.disabled ? 'not-allowed' : 'text')};
    pointer-events: ${(props: InputProps) =>
        props.disabled ? 'none' : 'auto'};

    &:focus {
        outline: none;
    }

    &:last-of-type {
        padding: 2px 10px 2px 0;
    }

    &:not(:last-of-type):after {
        content: attr(data-separator);
        width: 4px;
        display: inline-block;
    }

    &:empty:before {
        content: attr(data-placeholder);
        color: #aaa;
    }

    &:empty:not(:last-of-type):after {
        color: #aaa;
    }
`;

export const ClearButton = styled(SmallButton)`
    font-size: 18px;
`;

export const Placeholder = styled.span`
    color: #aaa;
    user-select: none;
`;

export const Icon = styled.span`
    margin-right: 5px;
    user-select: none;

    &:after {
        content: '${(props: { icon: string }) => props.icon}';
    }
`;

const WHITELIST_KEYS = [keys.BACKSPACE, keys.DELETE, keys.TAB];

const FORBIDDEN_KEYS = [
    keys.SHIFT,
    keys.ARROW_LEFT,
    keys.ARROW_RIGHT,
    keys.ARROW_UP,
    keys.ARROW_DOWN,
    keys.TAB
];

export class Value extends React.PureComponent<ValueProps, ValueState> {
    private searchInputs: HTMLSpanElement[] = [];

    private get formatGroups(): string[] {
        return this.props.format.split('').reduce(
            (memo, char) => {
                const prevChar = memo[memo.length - 1];

                if (prevChar && char === prevChar.substr(0, 1)) {
                    memo[memo.length - 1] += char;
                } else {
                    memo = [...memo, char];
                }

                return memo;
            },
            [] as string[]
        );
    }

    private get focused(): HTMLElement | null {
        return document.querySelector(':focus');
    }

    private get iconClass(): 'time' | 'calendar' {
        const { showTime, showDate } = this.props;

        if (!showDate && showTime) {
            return 'time';
        }

        return 'calendar';
    }

    private get icon() {
        switch (this.iconClass) {
            case 'calendar':
                return '📅';
            case 'time':
                return '⏱';
        }
    }

    constructor(props: ValueProps) {
        super(props);

        this.state = {};

        this.onSearchRef = this.onSearchRef.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    public componentDidUpdate(prevProps: ValueProps): void {
        const { open, value, format } = this.props;
        const hasFocus = this.searchInputs.some(inp => inp === this.focused);

        if (!hasFocus) {
            if (open) {
                if (prevProps.value !== value && value) {
                    const parts = splitDate(value, format);
                    const input = this.searchInputs[0];

                    this.searchInputs.forEach(
                        (input, i) => (input.innerText = parts[i])
                    );

                    if (input) {
                        input.focus();
                    }
                }

                if (!prevProps.open || value !== prevProps.value) {
                    const input = this.searchInputs[0];

                    if (input) {
                        this.selectText(input);
                    }
                }
            }
        }

        if (!open && value) {
            const parts = splitDate(value, format);

            this.searchInputs.forEach(
                (input, i) => (input.innerText = parts[i])
            );
        }
    }

    public componentDidMount() {
        if (this.props.value) {
            this.forceUpdate();
        }
    }

    public render(): React.ReactNode {
        const {
            placeholder,
            value,
            showDate,
            showTime,
            disabled,
            open
        } = this.props;
        const ArrowButtonComp = this.props.arrowButtonComponent || ArrowButton;
        const showPlaceholder = placeholder && !open;
        const timeOnly = showTime && !showDate;

        return (
            <Container
                data-role="value"
                className="react-slct-value react-timebomb-value"
                disabled={disabled}
                onClick={this.onToggle}
            >
                <Flex>
                    <Icon
                        icon={this.icon}
                        className={`react-timebomb-icon ${this.iconClass}`}
                    />
                    <Flex>
                        {this.renderValue()}
                        {showPlaceholder && (
                            <Placeholder className="react-timebomb-placeholder">
                                {placeholder}
                            </Placeholder>
                        )}
                    </Flex>
                </Flex>
                <Flex>
                    {value && (
                        <ClearButton
                            className="react-timebomb-clearer"
                            tabIndex={-1}
                            disabled={disabled}
                            onClick={this.onClear}
                        >
                            ×
                        </ClearButton>
                    )}
                    {!timeOnly && (
                        <ArrowButtonComp disabled={disabled} open={open} />
                    )}
                </Flex>
            </Container>
        );
    }

    private renderValue(): React.ReactNode {
        const { open, disabled, value } = this.props;

        if (!open && !value) {
            return null;
        }

        const { formatGroups } = this;

        return (
            <Flex>
                {formatGroups.map((group, i) => {
                    if (group === '.' || group === ':' || group === ' ') {
                        return null;
                    } else {
                        const separator = formatGroups[i + 1];

                        return (
                            <Input
                                contentEditable={!disabled}
                                disabled={disabled}
                                data-placeholder={group}
                                data-separator={separator}
                                key={group}
                                data-group={group}
                                ref={this.onSearchRef}
                                data-react-timebomb-selectable
                                onKeyDown={this.onKeyDown}
                                onKeyUp={this.onKeyUp}
                                onFocus={this.onFocus}
                                onBlur={this.onBlur}
                                onClick={this.onClick}
                                onChange={this.onChange}
                            />
                        );
                    }
                })}
            </Flex>
        );
    }

    private selectText(el: HTMLElement | undefined) {
        if (el) {
            const range = document.createRange();
            const sel = getSelection();

            range.selectNodeContents(el);

            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    private onSearchRef(el: HTMLSpanElement | null): void {
        if (el) {
            this.searchInputs.push(el);
        } else {
            this.searchInputs = [];
        }
    }

    private onKeyDown(e: React.KeyboardEvent<HTMLSpanElement>): void {
        const {
            onChangeValueText,
            format,
            value,
            allowValidation
        } = this.props;
        const input = e.currentTarget;
        const { innerText, nextSibling, previousSibling } = input;
        const sel = getSelection();
        const hasSelection = Boolean(sel.focusOffset - sel.baseOffset);
        let numericValue = parseInt(innerText, 10);

        switch (e.keyCode) {
            case keys.ENTER:
            case keys.ESC:
            case keys.BACKSPACE:
                e.preventDefault();
                return;
            case keys.ARROW_RIGHT:
                e.preventDefault();

                if (nextSibling instanceof HTMLSpanElement) {
                    nextSibling.focus();
                } else {
                    this.selectText(input);
                }
                return;
            case keys.ARROW_LEFT:
                e.preventDefault();

                if (previousSibling instanceof HTMLSpanElement) {
                    previousSibling.focus();
                } else {
                    this.selectText(input);
                }
                return;
            case keys.ARROW_UP:
            case keys.ARROW_DOWN:
                e.preventDefault();

                const isArrowUp = e.keyCode === keys.ARROW_UP;

                if (isNaN(numericValue)) {
                    numericValue = 0;
                }

                if (isFinite(numericValue)) {
                    const formatGroup = getAttribute(input, 'data-group');
                    const formatType = getFormatType(formatGroup);

                    if (!allowValidation) {
                        const add = e.shiftKey ? 10 : 1;
                        const nextValue =
                            numericValue + (isArrowUp ? add : -add);
                        const valid = validateFormatGroup(
                            nextValue,
                            formatGroup
                        );

                        if (valid) {
                            input.innerText =
                                typeof valid === 'string'
                                    ? valid
                                    : formatNumber(nextValue);
                        }
                    } else {
                        if (value && formatType) {
                            const direction = isArrowUp ? 'add' : 'subtract';

                            const newDate = manipulateDate(
                                value,
                                formatType,
                                direction,
                                e.shiftKey
                            );
                            const enabled = isEnabled(
                                'day',
                                newDate,
                                this.props
                            );

                            if (enabled) {
                                const dateParts = splitDate(newDate, format);

                                this.searchInputs.map(
                                    (inp, i) => (inp.innerText = dateParts[i])
                                );
                            }
                        }
                    }

                    this.selectText(input);
                    onChangeValueText(joinDates(this.searchInputs, format));
                }
                return;
        }

        const dataValue = getAttribute(input, 'data-value');
        const dataGroup = getAttribute(input, 'data-group');
        const char = stringFromCharCode(e.keyCode);
        const groupValue = dataValue && !hasSelection ? dataValue + char : char;

        if (WHITELIST_KEYS.includes(e.keyCode) || e.metaKey || e.ctrlKey) {
            return;
        }

        const valid = validateFormatGroup(groupValue, dataGroup);

        if (!valid) {
            e.preventDefault();
        } else if (typeof valid === 'string') {
            e.preventDefault();

            input.innerText = valid;
        }

        if (hasSelection) {
            return;
        }

        // validate group
        if (innerText.length >= dataGroup.length) {
            e.preventDefault();
        }
    }

    private onKeyUp(e: React.KeyboardEvent<HTMLSpanElement>): void {
        const { onChangeValueText, format, onSubmit, onToggle } = this.props;
        const input = e.currentTarget;
        const { innerText, nextSibling, previousSibling } = input;

        if (e.keyCode === keys.ENTER) {
            e.preventDefault();

            if (this.focused) {
                this.focused.blur();
            }
            onSubmit();
            return;
        }

        if (e.keyCode === keys.ESC) {
            onToggle();
            return;
        }

        // focus prev
        if (e.keyCode === keys.BACKSPACE) {
            if (innerText) {
                input.innerText = '';
            } else if (previousSibling instanceof HTMLSpanElement) {
                this.selectText(previousSibling);
            }
        }

        // focus next
        else if (
            innerText.length >= getAttribute(input, 'data-group').length &&
            !FORBIDDEN_KEYS.includes(e.keyCode)
        ) {
            if (!nextSibling) {
                this.selectText(input);
            } else if (nextSibling instanceof HTMLSpanElement) {
                this.selectText(nextSibling);
            }

            onChangeValueText(joinDates(this.searchInputs, format));
        }

        input.setAttribute('data-value', input.innerText);
    }

    private onClick(e: React.SyntheticEvent<HTMLSpanElement>): void {
        this.selectText(e.currentTarget);
    }

    private onFocus(e: React.SyntheticEvent<HTMLSpanElement>): void {
        const input = e.target as HTMLSpanElement;
        const currentFormatGroup = getAttribute(input, 'data-group');

        this.selectText(e.currentTarget);

        this.setState({ currentFormatGroup });
    }

    private onBlur(e: React.SyntheticEvent<HTMLSpanElement>): void {
        const input = e.target as HTMLSpanElement;
        const value = input.innerText;
        const dataGroup = getAttribute(input, 'data-group');
        const formatType = getFormatType(dataGroup);

        const fillZero = () => {
            const innerText = `0${value}`;

            input.innerText = innerText;
            input.setAttribute('data-value', innerText);
        };

        switch (formatType) {
            case 'day':
                if (value === '1' || value === '2' || value === '3') {
                    fillZero();
                }
                break;
            case 'month':
                if (value === '1') {
                    fillZero();
                }
                break;
        }

        // check if timebomb is still focused
        setTimeout(() => {
            const { focused } = this;

            if (
                this.props.open &&
                focused &&
                !getAttribute(focused, 'data-react-timebomb-selectable')
            ) {
                this.props.onToggle();
            }
        }, 0);
    }

    private onChange(e: React.KeyboardEvent<HTMLSpanElement>): void {
        const { format, onChangeValueText } = this.props;
        const input = e.currentTarget;
        const { innerText, nextSibling } = input;

        onChangeValueText(joinDates(this.searchInputs, format));

        if (innerText.length >= getAttribute(input, 'data-group').length) {
            if (nextSibling instanceof HTMLSpanElement) {
                nextSibling.focus();
            }
        }
    }

    private onClear(e: React.MouseEvent<HTMLButtonElement>): void {
        e.stopPropagation();

        this.props.onClear();
    }

    private onToggle(e: React.SyntheticEvent<HTMLSpanElement>): void {
        const { open, disabled, onToggle } = this.props;

        if (disabled) {
            return;
        }

        if (!this.searchInputs.some(inp => inp === e.target) || !open) {
            onToggle();
        }
    }
}
