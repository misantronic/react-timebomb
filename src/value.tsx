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
import { ReactTimebombProps } from './typings';
import { Button } from './button';

interface ValueProps {
    open?: boolean;
    value?: Date;
    valueText?: string;
    format: string;
    placeholder: ReactTimebombProps['placeholder'];
    minDate: ReactTimebombProps['minDate'];
    maxDate: ReactTimebombProps['maxDate'];
    allowValidation?: boolean;
    onToggle(): void;
    onChangeValueText(valueText?: string): void;
    onSubmit(onToggle: () => void): void;
}

const Flex = styled.div`
    display: flex;
    align-items: center;
`;

const Container = styled(Flex)`
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    border: 1px solid #ccc;
    cursor: pointer;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
`;

const Input = styled.span`
    padding: 2px 0 2px 0;
    min-width: 1px;
    cursor: text;

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

const ArrowButton = styled(Button)`
    font-size: 13px;
    color: #ccc;
    cursor: pointer;
    border: none;
    line-height: 1;

    &:hover {
        color: #333;
    }

    &:focus {
        outline: none;
    }
`;

const ClearButton = styled(ArrowButton)`
    font-size: 18px;
`;

const Placeholder = styled.span`
    color: #aaa;
    user-select: none;
`;

const Icon = styled.span`
    margin-right: 5px;
    user-select: none;

    &:after {
        content: '📅';
    }
`;

const WHITELIST_KEYS = [keys.BACKSPACE, keys.DELETE, keys.TAB];

export class Value extends React.PureComponent<ValueProps> {
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

    constructor(props: ValueProps) {
        super(props);

        this.onSearchRef = this.onSearchRef.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    public componentDidUpdate(prevProps: ValueProps): void {
        const { open, value, format } = this.props;
        const hasFocus = this.searchInputs.some(inp => inp === this.focused);

        if (!hasFocus) {
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

            if ((open && !prevProps.open) || value !== prevProps.value) {
                const input = this.searchInputs[0];

                if (input) {
                    if (input.innerText === '') {
                        input.focus();
                    } else {
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

    public render(): React.ReactNode {
        const { placeholder, value, open } = this.props;
        const showPlaceholder = placeholder && !open;

        return (
            <Container
                data-role="value"
                className="react-slct-value react-timebomb-value"
                onClick={this.onToggle}
            >
                <Flex>
                    <Icon className="react-timebomb-icon" />
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
                            onClick={this.onClear}
                        >
                            ×
                        </ClearButton>
                    )}
                    <ArrowButton tabIndex={-1} className="react-timebomb-arrow">
                        {open ? '▲' : '▼'}
                    </ArrowButton>
                </Flex>
            </Container>
        );
    }

    private renderValue(): React.ReactNode {
        const { open, value } = this.props;

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
                                contentEditable
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
                                onClick={this.onFocus}
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
                        const nextValue = numericValue + (isArrowUp ? 1 : -1);
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
                                direction
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
        const { onChangeValueText, format, allowValidation } = this.props;
        const input = e.currentTarget;
        const { innerText, nextSibling } = input;

        if (e.keyCode === keys.ENTER) {
            e.preventDefault();

            if (this.focused) {
                this.focused.blur();
            }
            this.props.onSubmit(this.props.onToggle);

            return;
        }

        if (e.keyCode === keys.ESC) {
            this.props.onToggle();

            return;
        }

        const forbiddenKeys = [
            keys.SHIFT,
            keys.ARROW_LEFT,
            keys.ARROW_RIGHT,
            keys.ARROW_UP,
            keys.ARROW_DOWN,
            keys.TAB
        ];

        // focus next
        if (
            innerText.length >= getAttribute(input, 'data-group').length &&
            !forbiddenKeys.includes(e.keyCode)
        ) {
            if (allowValidation || !nextSibling) {
                this.selectText(input);
            } else if (nextSibling instanceof HTMLSpanElement) {
                this.selectText(nextSibling);
            }

            onChangeValueText(joinDates(this.searchInputs, format));
        }

        input.setAttribute('data-value', innerText);
    }

    private onFocus(e: React.SyntheticEvent<HTMLSpanElement>): void {
        this.selectText(e.currentTarget);
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

        setTimeout(() => {
            const { focused } = this;

            if (
                focused &&
                !focused.getAttribute('data-react-timebomb-selectable')
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

    private onClear(e: React.SyntheticEvent<HTMLButtonElement>): void {
        e.stopPropagation();

        this.props.onChangeValueText(undefined);
    }

    private onToggle(e: React.SyntheticEvent<HTMLSpanElement>): void {
        const { open, onToggle } = this.props;

        if (!this.searchInputs.some(inp => inp === e.target) || !open) {
            onToggle();
        }
    }
}
