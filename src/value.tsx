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
    onSubmit(): void;
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
            setTimeout(() => {
                const range = document.createRange();
                const selection = getSelection();

                range.selectNodeContents(searchInput);
                range.collapse(false);

                searchInput.focus();

                selection.removeAllRanges();
                selection.addRange(range);
            }, 0);
        }
    }

    public render(): React.ReactNode {
        const { placeholder, value, open } = this.props;

        return (
            <Container className="react-slct-value" onClick={this.onToggle}>
                <Flex>
                    <Icon>📅</Icon>
                    {this.renderValue()}
                    {placeholder && <Placeholder>{placeholder}</Placeholder>}
                </Flex>
                <Flex>
                    {value && (
                        <ClearButton onClick={this.onClear}>×</ClearButton>
                    )}
                    <Button>{open ? '▲' : '▼'}</Button>
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
                    className="react-slct-datepicker-input"
                    innerRef={this.onSearchRef}
                    contentEditable
                    onInput={this.onChangeDateText}
                    onKeyDown={this.onKeyDown}
                />
            </Flex>
        );
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
        if (e.keyCode === keys.ENTER) {
            e.preventDefault();
            this.props.onSubmit();
        }

        if (this.searchInput) {
            if (WHITELIST_KEYS.includes(e.keyCode) || e.metaKey) {
                return;
            }

            const formatChar = this.props.format.substr(
                getSelection().baseOffset,
                1
            );
            const validated = validateChar(e.keyCode, formatChar);

            if (validated !== true) {
                e.preventDefault();
            }
        }
    }

    @bind
    private onToggle(e: React.SyntheticEvent<HTMLSpanElement>): void {
        if (e.target !== this.searchInput || !this.props.open) {
            this.props.onToggle();
        }
    }
}
