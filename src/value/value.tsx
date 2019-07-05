import * as React from 'react';
import styled from 'styled-components';
import { ArrowButton, SmallButton } from '../components/button';
import {
    ClearComponentProps,
    IconProps,
    ReactTimebombValueProps
} from '../typings';
import {
    clearSelection,
    fillZero,
    formatIsActualNumber,
    formatNumber,
    formatSplitExpr,
    getAttribute,
    getFormatType,
    isEnabled,
    joinDates,
    keys,
    manipulateDate,
    replaceSpaceWithNbsp,
    selectElement,
    splitDate,
    stringFromCharCode,
    validateFormatGroup
} from '../utils';

interface ValueState {
    allSelected?: boolean;
}

interface InputProps {
    disabled?: boolean;
}

export const Flex = styled.div`
    display: flex;
    align-items: center;
    white-space: nowrap;
    position: relative;
    line-height: 1;
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
        min-width: 4px;
        display: inline-block;
    }

    &:empty:before {
        content: attr(data-placeholder);
        color: #aaa;
    }

    &:empty:not(:last-of-type):after {
        color: #aaa;
    }

    &:not([contenteditable='true']) {
        user-select: none;
    }
`;

export const ClearButton = styled(SmallButton)`
    font-size: 18px;
`;

const ClearButtonX = styled.span`
    position: relative;
    left: -1px;
    top: -2px;
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

const DefaultIcon = (props: IconProps) => {
    function getIconClass(): 'time' | 'calendar' {
        const { showTime, showDate } = props;

        if (!showDate && showTime) {
            return 'time';
        }

        return 'calendar';
    }

    function getIcon() {
        switch (getIconClass()) {
            case 'calendar':
                return '📅';
            case 'time':
                return '⏱';
        }
    }

    return (
        <Icon
            icon={getIcon()}
            className={`react-timebomb-icon ${getIconClass()}`}
        />
    );
};

export const DefaultClearComponent = (props: ClearComponentProps) => (
    <ClearButton
        className="react-timebomb-clearer"
        tabIndex={-1}
        disabled={props.disabled}
        onClick={props.onClick}
    >
        <ClearButtonX>×</ClearButtonX>
    </ClearButton>
);

const META_KEYS = [keys.BACKSPACE, keys.DELETE, keys.TAB];

const FORBIDDEN_KEYS = [
    keys.SHIFT,
    keys.ARROW_LEFT,
    keys.ARROW_RIGHT,
    keys.ARROW_UP,
    keys.ARROW_DOWN,
    keys.TAB
];

class ValueComponent extends React.PureComponent<
    ReactTimebombValueProps,
    ValueState
> {
    private inputs: HTMLSpanElement[] = [];

    private get formatGroups(): string[] {
        return this.props.format.split('').reduce(
            (memo, char) => {
                const prevChar = memo[memo.length - 1];

                if (
                    (prevChar && char === prevChar.substr(0, 1)) ||
                    (formatSplitExpr.test(prevChar) &&
                        formatSplitExpr.test(char))
                ) {
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

    constructor(props: ReactTimebombValueProps) {
        super(props);

        this.state = {};

        this.onSearchRef = this.onSearchRef.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onDblClick = this.onDblClick.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    public componentDidUpdate(prevProps: ReactTimebombValueProps): void {
        setTimeout(() => {
            const { open, value, format, mode, allowValidation } = this.props;
            const hasFocus = this.inputs.some(inp => inp === this.focused);
            const allowTextSelection =
                mode === 'day' || mode === 'month' || mode === 'year';

            if (!hasFocus) {
                if (open) {
                    if (prevProps.value !== value && value) {
                        const parts = splitDate(value, format);
                        const input = this.inputs[0];

                        this.inputs.forEach(
                            (input, i) => (input.innerText = parts[i])
                        );

                        if (input && allowTextSelection) {
                            input.focus();
                        }
                    }

                    if (allowTextSelection) {
                        if (!prevProps.open || value !== prevProps.value) {
                            const [input] = this.inputs;

                            if (input) {
                                selectElement(input);
                            }
                        }
                    }
                }
            }

            if (
                open &&
                prevProps.mode !== mode &&
                !this.state.allSelected &&
                allowTextSelection
            ) {
                const input = this.inputs.find(el => {
                    const format = getAttribute(el, 'data-group');
                    const type = getFormatType(format);

                    return type === mode;
                });

                selectElement(input);
            }

            if (!open && value) {
                const parts = splitDate(value, format);

                this.inputs.forEach((input, i) => (input.innerText = parts[i]));
            }

            if (open && prevProps.value && !value && !allowValidation) {
                this.inputs.forEach(input => (input.innerText = ''));
            }

            if (!open) {
                this.setState({ allSelected: false });
            }
        }, 16);
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
            arrowButtonId,
            iconComponent,
            open
        } = this.props;
        const ArrowButtonComp = this.props.arrowButtonComponent || ArrowButton;
        const ClearComponent =
            this.props.clearComponent || DefaultClearComponent;
        const showPlaceholder = placeholder && !open;
        const showClearer = value && !disabled;
        const timeOnly = showTime && !showDate;
        const IconComponent =
            iconComponent !== undefined ? iconComponent : DefaultIcon;

        return (
            <Container
                data-role="value"
                className="react-slct-value react-timebomb-value"
                ref={this.props.innerRef}
                disabled={disabled}
                onClick={this.onToggle}
            >
                <Flex>
                    {IconComponent && (
                        <IconComponent
                            showDate={showDate}
                            showTime={showTime}
                        />
                    )}
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
                    {showClearer && (
                        <ClearComponent
                            disabled={disabled}
                            onClick={this.onClear}
                        />
                    )}
                    {!timeOnly && (
                        <ArrowButtonComp
                            id={arrowButtonId}
                            disabled={disabled}
                            open={open}
                        />
                    )}
                </Flex>
            </Container>
        );
    }

    private renderValue(): React.ReactNode {
        const { open, disabled, mobile, value } = this.props;
        const LabelComponent = this.props.labelComponent;
        const contentEditable = !disabled && !mobile;

        if (!open && !value) {
            return null;
        }

        if (LabelComponent) {
            return <LabelComponent {...this.props} />;
        }

        const formatGroups = this.formatGroups;

        return (
            <Flex>
                {formatGroups.map((group, i) => {
                    if (group.split('').some(g => formatSplitExpr.test(g))) {
                        return null;
                    } else {
                        const separator = formatGroups[i + 1];

                        return (
                            <Input
                                data-react-timebomb-selectable
                                contentEditable={contentEditable}
                                disabled={disabled}
                                data-placeholder={group}
                                data-separator={replaceSpaceWithNbsp(separator)}
                                key={group}
                                data-group={group}
                                ref={this.onSearchRef}
                                onKeyDown={this.onKeyDown}
                                onKeyUp={this.onKeyUp}
                                onFocus={this.onFocus}
                                onBlur={this.onBlur}
                                onClick={this.onClick}
                                onDoubleClick={this.onDblClick}
                                onChange={this.onChange}
                            />
                        );
                    }
                })}
            </Flex>
        );
    }

    private onSearchRef(el: HTMLSpanElement | null): void {
        if (el) {
            this.inputs.push(el);
        } else {
            this.inputs = [];
        }
    }

    private onKeyDown(e: React.KeyboardEvent<HTMLSpanElement>): void {
        const {
            onChangeValueText,
            format,
            value,
            allowValidation,
            timeStep
        } = this.props;
        const input = e.currentTarget;
        const { innerText, nextSibling, previousSibling } = input;
        const formatGroup = getAttribute(input, 'data-group');
        const numericFormat = formatIsActualNumber(formatGroup);
        const sel = getSelection();
        const hasSelection = sel
            ? Boolean(sel.focusOffset - sel.anchorOffset)
            : false;
        let numericValue = parseInt(innerText, 10);

        switch (e.keyCode) {
            case keys.ENTER:
            case keys.ESC:
            case keys.BACKSPACE:
            case keys.DOT:
            case keys.COMMA:
                e.preventDefault();
                return;
            case keys.ARROW_RIGHT:
                e.preventDefault();

                if (nextSibling instanceof HTMLSpanElement) {
                    nextSibling.focus();
                } else {
                    selectElement(input);
                }
                return;
            case keys.ARROW_LEFT:
                e.preventDefault();

                if (previousSibling instanceof HTMLSpanElement) {
                    previousSibling.focus();
                } else {
                    selectElement(input);
                }
                return;
            case keys.ARROW_UP:
            case keys.ARROW_DOWN:
                e.preventDefault();

                if (!numericFormat) {
                    return;
                }

                const isArrowUp = e.keyCode === keys.ARROW_UP;

                if (isNaN(numericValue)) {
                    numericValue = 0;
                }

                if (isFinite(numericValue)) {
                    const formatType = getFormatType(formatGroup);

                    if (!allowValidation) {
                        const add = formatType === 'minute' ? timeStep || 1 : 1;
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
                                timeStep
                            );
                            const enabled = isEnabled(
                                'day',
                                newDate,
                                this.props
                            );

                            if (enabled) {
                                const dateParts = splitDate(newDate, format);

                                this.inputs.map(
                                    (inp, i) => (inp.innerText = dateParts[i])
                                );
                            }
                        }
                    }

                    selectElement(input);
                    onChangeValueText(joinDates(this.inputs, format));
                }
                return;
        }

        const char = stringFromCharCode(e.keyCode);
        const groupValue = innerText && !hasSelection ? innerText + char : char;

        if (META_KEYS.includes(e.keyCode) || e.metaKey || e.ctrlKey) {
            return;
        }

        if (!numericFormat) {
            e.preventDefault();
            return;
        }

        const valid = validateFormatGroup(groupValue, formatGroup);

        if (!valid) {
            e.preventDefault();
        } else if (typeof valid === 'string') {
            e.preventDefault();

            input.innerText = valid;
        }

        if (
            this.state.allSelected &&
            e.keyCode !== keys.BACKSPACE &&
            e.keyCode !== keys.DELETE
        ) {
            const [firstInput] = this.inputs;
            let validatedChar = validateFormatGroup(char, formatGroup);

            if (validatedChar && validatedChar === true) {
                validatedChar = char;
            }

            if (validatedChar) {
                e.preventDefault();

                this.inputs.forEach((el, i) => i !== 0 && (el.innerText = ''));

                if (validatedChar.length === 2) {
                    selectElement(firstInput);
                } else {
                    clearSelection();

                    firstInput.innerText = validatedChar;
                    firstInput.focus();

                    selectElement(firstInput, [1, 1]);
                }
            }
        }

        // validate group
        if (!hasSelection && innerText.length >= formatGroup.length) {
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

        if (this.state.allSelected) {
            if (e.keyCode === keys.BACKSPACE || e.keyCode === keys.DELETE) {
                // delete all
                this.inputs.forEach(el => (el.innerText = ''));

                selectElement(this.inputs[0]);
            }

            this.setState({ allSelected: false });
        }

        // remove text / focus prev
        else if (e.keyCode === keys.BACKSPACE) {
            if (innerText) {
                input.innerText = '';
            } else if (previousSibling instanceof HTMLSpanElement) {
                selectElement(previousSibling);
            }
        }

        // focus next
        else if (
            (innerText.length >= getAttribute(input, 'data-group').length &&
                !FORBIDDEN_KEYS.includes(e.keyCode)) ||
            e.keyCode === keys.DOT ||
            e.keyCode === keys.COMMA
        ) {
            if (!nextSibling) {
                selectElement(input);
            } else if (nextSibling instanceof HTMLSpanElement) {
                selectElement(nextSibling);
            }

            onChangeValueText(joinDates(this.inputs, format));
        }
    }

    private onClick(e: React.SyntheticEvent<HTMLSpanElement>): void {
        selectElement(e.currentTarget);
    }

    private onDblClick(e: React.SyntheticEvent<HTMLSpanElement>) {
        const input = e.currentTarget;

        if (input.parentNode && this.inputs.some(el => Boolean(el.innerText))) {
            selectElement(this.inputs[0]);
            selectElement(input.parentNode as HTMLElement);
            this.setState({ allSelected: true }, this.props.onAllSelect);
        }
    }

    private onFocus = (() => {
        let timeout = 0;

        return (e: React.SyntheticEvent<HTMLSpanElement>) => {
            clearTimeout(timeout);

            const input = e.currentTarget;

            selectElement(input);

            timeout = setTimeout(() => {
                if (!this.state.allSelected) {
                    const formatGroup = getAttribute(input, 'data-group');

                    this.props.onChangeFormatGroup(formatGroup);
                }
            }, 16);
        };
    })();

    private onBlur(e: React.SyntheticEvent<HTMLSpanElement>): void {
        if (!this.state.allSelected) {
            const input = e.target as HTMLSpanElement;
            const value = input.innerText;
            const dataGroup = getAttribute(input, 'data-group');
            const formatType = getFormatType(dataGroup);

            if (formatType) {
                const filledValue = fillZero(value, formatType);

                if (filledValue) {
                    input.innerText = filledValue;
                }
            }
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

        onChangeValueText(joinDates(this.inputs, format));

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

        if (!this.inputs.some(inp => inp === e.target) || !open) {
            onToggle();
        }
    }
}

export const Value = React.forwardRef(
    (props: ReactTimebombValueProps, ref: React.Ref<HTMLDivElement>) => (
        <ValueComponent innerRef={ref} {...props} />
    )
);
