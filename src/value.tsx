import { bind } from 'lodash-decorators';
import * as React from 'react';
import styled from 'styled-components';
import { validateChar, keys } from './utils';

interface ValueProps {
    open?: boolean;
    value?: Date;
    valueText?: string;
    placeholder?: string;
    format: string;
    onToggle(): void;
    onRef(el?: HTMLSpanElement): void;
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
    padding: ${(props: { empty: boolean }) =>
        props.empty ? '2px 0 2px 2px' : '2px 10px 2px 2px'};
    cursor: text;

    &:focus {
        outline: none;
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

const WHITELIST_KEYS = [keys.BACKSPACE, keys.ARROW_LEFT, keys.ARROW_RIGHT];

export class Value extends React.PureComponent<ValueProps> {
    private searchInput?: HTMLSpanElement;

    public componentDidUpdate(prevProps: ValueProps): void {
        const { searchInput } = this;
        const { open, value } = this.props;

        if (
            ((open && !prevProps.open) || value !== prevProps.value) &&
            searchInput &&
            document.querySelector(':focus') !== searchInput
        ) {
            setTimeout(this.setCursorAtEnd, 0);
        }
    }

    public render(): React.ReactNode {
        const { placeholder, value, open } = this.props;

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
                        {placeholder && (
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
                            onClick={this.onClear}
                        >
                            ×
                        </ClearButton>
                    )}
                    <Button className="react-timebomb-arrow">
                        {open ? '▲' : '▼'}
                    </Button>
                </Flex>
            </Container>
        );
    }

    @bind
    private renderValue(): React.ReactNode {
        const { value } = this.props;

        return (
            <Flex>
                <Input
                    empty={!value}
                    className="react-timebomb-search"
                    innerRef={this.onSearchRef}
                    contentEditable
                    onInput={this.onChangeDateText}
                    onKeyDown={this.onKeyDown}
                    onKeyUp={this.onKeyUp}
                />
            </Flex>
        );
    }

    @bind
    private setCursorAtEnd(): void {
        if (this.searchInput) {
            const range = document.createRange();
            const selection = getSelection();

            range.selectNodeContents(this.searchInput);
            range.collapse(false);

            this.searchInput.focus();

            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    @bind
    private onSearchRef(el?: HTMLSpanElement): void {
        const { valueText } = this.props;

        this.searchInput = el;

        if (el) {
            if (valueText) {
                el.innerText = valueText;
            }

            this.props.onRef(el);
        }
    }

    @bind
    private onChangeDateText(e: React.SyntheticEvent<HTMLSpanElement>): void {
        const valueText = e.currentTarget.innerText.trim();

        this.props.onChangeValueText(valueText);
    }

    @bind
    private onClear(e: React.SyntheticEvent<HTMLButtonElement>): void {
        e.stopPropagation();

        this.props.onChangeValueText('');
    }

    @bind
    private onKeyDown(e: React.KeyboardEvent<HTMLSpanElement>): void {
        const { format } = this.props;

        if (this.searchInput) {
            if (e.keyCode === keys.ENTER || e.keyCode === keys.ESC) {
                e.preventDefault();
                this.searchInput.blur();
                this.props.onSubmit(this.props.onToggle);
            }

            if (WHITELIST_KEYS.includes(e.keyCode) || e.metaKey) {
                return;
            }

            const sel = getSelection();
            const formatChar =
                format[
                    Math.min(
                        sel.extentOffset,
                        sel.baseOffset,
                        sel.anchorOffset,
                        sel.focusOffset
                    )
                ];

            const validated = validateChar(e.keyCode, formatChar);

            if (validated !== true) {
                e.preventDefault();
            }
        }
    }

    @bind
    private onKeyUp(/*e: React.KeyboardEvent<HTMLSpanElement>*/): void {
        // const { format } = this.props;
        // if (this.searchInput && !e.metaKey && e.keyCode !== keys.BACKSPACE && e.keyCode !== keys.) {
        //     const sel = getSelection();
        //     const offset = Math.min(
        //         sel.extentOffset,
        //         sel.baseOffset,
        //         sel.anchorOffset,
        //         sel.focusOffset
        //     );
        //     const nextFormatChar = format[offset] || '';
        //     const nextCharCode = nextFormatChar.charCodeAt(0);
        //     if (
        //         nextCharCode >= 37 &&
        //         nextCharCode <= 47 &&
        //         this.searchInput.innerText[offset + 1] !== nextFormatChar
        //     ) {
        //         // auto insert char
        //         this.searchInput.innerText += nextFormatChar;
        //         this.setCursorAtEnd();
        //     }
        // }
    }

    @bind
    private onToggle(e: React.SyntheticEvent<HTMLSpanElement>): void {
        if (e.target !== this.searchInput || !this.props.open) {
            this.props.onToggle();
        }
    }
}
