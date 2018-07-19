import { bind } from 'lodash-decorators';
import * as React from 'react';
import styled from 'styled-components';
import {
    keys,
    formatNumber,
    splitDate,
    joinDates,
    validateDate,
    stringFromCharCode,
    validateFormatGroup
} from './utils';
import { ReactTimebombProps } from './typings';

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
    onChangeValueText(valueText: string): void;
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

const Button = styled.button`
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

const ClearButton = styled(Button)`
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
                    <Button tabIndex={-1} className="react-timebomb-arrow">
                        {open ? '▲' : '▼'}
                    </Button>
                </Flex>
            </Container>
        );
    }

    @bind
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
                                innerRef={this.onSearchRef}
                                onKeyDown={this.onKeyDown}
                                onKeyUp={this.onKeyUp}
                                onFocus={this.onFocus}
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

    @bind
    private onSearchRef(el?: HTMLSpanElement): void {
        if (el) {
            this.searchInputs.push(el);
        } else {
            this.searchInputs = [];
        }
    }

    @bind
    private onKeyDown(e: React.KeyboardEvent<HTMLSpanElement>): void {
        const { onChangeValueText, format, allowValidation } = this.props;
        const input = e.currentTarget;
        const { innerText, nextSibling, previousSibling } = input;
        const sel = getSelection();
        const hasSelection = Boolean(sel.focusOffset - sel.baseOffset);
        const numericValue = parseInt(innerText, 10);

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
                e.preventDefault();

                if (isFinite(numericValue)) {
                    const date = joinDates(
                        this.searchInputs.map(inp => {
                            if (inp === input) {
                                return formatNumber(numericValue + 1);
                            }

                            return inp.innerText;
                        }),
                        format
                    );

                    if (validateDate(date, format) || !allowValidation) {
                        input.innerText = formatNumber(numericValue + 1);
                        this.selectText(input);

                        onChangeValueText(joinDates(this.searchInputs, format));
                    }
                }
                return;
            case keys.ARROW_DOWN:
                e.preventDefault();

                if (isFinite(numericValue)) {
                    input.innerText = formatNumber(numericValue - 1);
                    this.selectText(input);

                    onChangeValueText(joinDates(this.searchInputs, format));
                }
                return;
        }

        const dataValue = input.getAttribute('data-value');
        const dataGroup = input.getAttribute('data-group')!;
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

    @bind
    private onKeyUp(e: React.KeyboardEvent<HTMLSpanElement>): void {
        const { onChangeValueText, format, allowValidation } = this.props;
        const input = e.currentTarget;
        const { innerText, nextSibling } = input;

        if (e.keyCode === keys.ENTER || e.keyCode === keys.ESC) {
            this.props.onSubmit(this.props.onToggle);

            return;
        }

        if (innerText.length >= input.getAttribute('data-group')!.length) {
            if (allowValidation || !nextSibling) {
                this.selectText(input);
            } else if (nextSibling instanceof HTMLSpanElement) {
                this.selectText(nextSibling);
            }

            onChangeValueText(joinDates(this.searchInputs, format));
        }

        input.setAttribute('data-value', innerText);
    }

    @bind
    private onFocus(e: React.SyntheticEvent<HTMLSpanElement>): void {
        this.selectText(e.currentTarget);
    }

    @bind
    private onChange(e: React.KeyboardEvent<HTMLSpanElement>): void {
        const { format, onChangeValueText } = this.props;
        const input = e.currentTarget;
        const { innerText, nextSibling } = input;

        onChangeValueText(joinDates(this.searchInputs, format));

        if (innerText.length >= input.getAttribute('data-group')!.length) {
            if (nextSibling instanceof HTMLSpanElement) {
                nextSibling.focus();
            }
        }
    }

    @bind
    private onClear(e: React.SyntheticEvent<HTMLButtonElement>): void {
        e.stopPropagation();

        this.props.onChangeValueText('');
    }

    @bind
    private onToggle(e: React.SyntheticEvent<HTMLSpanElement>): void {
        const { open, onToggle } = this.props;

        if (
            this.searchInputs.some(inp => inp === e.target) === false ||
            !open
        ) {
            onToggle();
        }
    }
}
