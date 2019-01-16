import * as React from 'react';
import styled from 'styled-components';
import { keys, formatNumber, splitDate, joinDates, stringFromCharCode, validateFormatGroup, getAttribute, getFormatType, manipulateDate, isEnabled, selectElement, fillZero, clearSelection, formatSplitExpr, formatIsActualNumber, replaceSpaceWithNbsp } from './utils';
import { SmallButton } from './button';
import { ArrowButton } from './arrow-button';
export const Flex = styled.div `
    display: flex;
    align-items: center;
    white-space: nowrap;
    position: relative;
`;
export const Container = styled(Flex) `
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    border: 1px solid #ccc;
    cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};
    width: 100%;
    height: 100%;
    box-sizing: border-box;
`;
const Input = styled.span `
    padding: 2px 0 2px 0;
    min-width: 1px;
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'text')};
    pointer-events: ${(props) => props.disabled ? 'none' : 'auto'};

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
export const ClearButton = styled(SmallButton) `
    font-size: 18px;
`;
export const Placeholder = styled.span `
    color: #aaa;
    user-select: none;
`;
export const Icon = styled.span `
    margin-right: 5px;
    user-select: none;

    &:after {
        content: '${(props) => props.icon}';
    }
`;
const META_KEYS = [keys.BACKSPACE, keys.DELETE, keys.TAB];
const FORBIDDEN_KEYS = [
    keys.SHIFT,
    keys.ARROW_LEFT,
    keys.ARROW_RIGHT,
    keys.ARROW_UP,
    keys.ARROW_DOWN,
    keys.TAB
];
export class Value extends React.PureComponent {
    constructor(props) {
        super(props);
        this.inputs = [];
        this.onFocus = (() => {
            let timeout;
            return (e) => {
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
    get formatGroups() {
        return this.props.format.split('').reduce((memo, char) => {
            const prevChar = memo[memo.length - 1];
            if ((prevChar && char === prevChar.substr(0, 1)) ||
                (formatSplitExpr.test(prevChar) &&
                    formatSplitExpr.test(char))) {
                memo[memo.length - 1] += char;
            }
            else {
                memo = [...memo, char];
            }
            return memo;
        }, []);
    }
    get focused() {
        return document.querySelector(':focus');
    }
    get iconClass() {
        const { showTime, showDate } = this.props;
        if (!showDate && showTime) {
            return 'time';
        }
        return 'calendar';
    }
    get icon() {
        switch (this.iconClass) {
            case 'calendar':
                return '📅';
            case 'time':
                return '⏱';
        }
    }
    componentDidUpdate(prevProps) {
        setTimeout(() => {
            const { open, value, format, mode, allowValidation } = this.props;
            const hasFocus = this.inputs.some(inp => inp === this.focused);
            if (!hasFocus) {
                if (open) {
                    if (prevProps.value !== value && value) {
                        const parts = splitDate(value, format);
                        const input = this.inputs[0];
                        this.inputs.forEach((input, i) => (input.innerText = parts[i]));
                        if (input) {
                            input.focus();
                        }
                    }
                    if (!prevProps.open || value !== prevProps.value) {
                        const [input] = this.inputs;
                        if (input) {
                            selectElement(input);
                        }
                    }
                }
            }
            if (open && prevProps.mode !== mode && !this.state.allSelected) {
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
    componentDidMount() {
        if (this.props.value) {
            this.forceUpdate();
        }
    }
    render() {
        const { placeholder, value, showDate, showTime, disabled, open } = this.props;
        const ArrowButtonComp = this.props.arrowButtonComponent || ArrowButton;
        const showPlaceholder = placeholder && !open;
        const showClearer = value && !disabled;
        const timeOnly = showTime && !showDate;
        return (React.createElement(Container, { "data-role": "value", className: "react-slct-value react-timebomb-value", disabled: disabled, onClick: this.onToggle },
            React.createElement(Flex, null,
                React.createElement(Icon, { icon: this.icon, className: `react-timebomb-icon ${this.iconClass}` }),
                React.createElement(Flex, null,
                    this.renderValue(),
                    showPlaceholder && (React.createElement(Placeholder, { className: "react-timebomb-placeholder" }, placeholder)))),
            React.createElement(Flex, null,
                showClearer && (React.createElement(ClearButton, { className: "react-timebomb-clearer", tabIndex: -1, onClick: this.onClear }, "\u00D7")),
                !timeOnly && (React.createElement(ArrowButtonComp, { disabled: disabled, open: open })))));
    }
    renderValue() {
        const { open, disabled, mobile, value } = this.props;
        const contentEditable = !disabled && !mobile;
        if (!open && !value) {
            return null;
        }
        const formatGroups = this.formatGroups;
        return (React.createElement(Flex, null, formatGroups.map((group, i) => {
            if (group.split('').some(g => formatSplitExpr.test(g))) {
                return null;
            }
            else {
                const separator = formatGroups[i + 1];
                return (React.createElement(Input, { "data-react-timebomb-selectable": true, contentEditable: contentEditable, disabled: disabled, "data-placeholder": group, "data-separator": replaceSpaceWithNbsp(separator), key: group, "data-group": group, ref: this.onSearchRef, onKeyDown: this.onKeyDown, onKeyUp: this.onKeyUp, onFocus: this.onFocus, onBlur: this.onBlur, onClick: this.onClick, onDoubleClick: this.onDblClick, onChange: this.onChange }));
            }
        })));
    }
    onSearchRef(el) {
        if (el) {
            this.inputs.push(el);
        }
        else {
            this.inputs = [];
        }
    }
    onKeyDown(e) {
        const { onChangeValueText, format, value, allowValidation } = this.props;
        const input = e.currentTarget;
        const { innerText, nextSibling, previousSibling } = input;
        const formatGroup = getAttribute(input, 'data-group');
        const numericFormat = formatIsActualNumber(formatGroup);
        const sel = getSelection();
        const hasSelection = Boolean(sel.focusOffset - sel.baseOffset);
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
                }
                else {
                    selectElement(input);
                }
                return;
            case keys.ARROW_LEFT:
                e.preventDefault();
                if (previousSibling instanceof HTMLSpanElement) {
                    previousSibling.focus();
                }
                else {
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
                        const add = e.shiftKey ? 10 : 1;
                        const nextValue = numericValue + (isArrowUp ? add : -add);
                        const valid = validateFormatGroup(nextValue, formatGroup);
                        if (valid) {
                            input.innerText =
                                typeof valid === 'string'
                                    ? valid
                                    : formatNumber(nextValue);
                        }
                    }
                    else {
                        if (value && formatType) {
                            const direction = isArrowUp ? 'add' : 'subtract';
                            const newDate = manipulateDate(value, formatType, direction, e.shiftKey);
                            const enabled = isEnabled('day', newDate, this.props);
                            if (enabled) {
                                const dateParts = splitDate(newDate, format);
                                this.inputs.map((inp, i) => (inp.innerText = dateParts[i]));
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
        }
        else if (typeof valid === 'string') {
            e.preventDefault();
            input.innerText = valid;
        }
        if (this.state.allSelected &&
            e.keyCode !== keys.BACKSPACE &&
            e.keyCode !== keys.DELETE) {
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
                }
                else {
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
    onKeyUp(e) {
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
            }
            else if (previousSibling instanceof HTMLSpanElement) {
                selectElement(previousSibling);
            }
        }
        // focus next
        else if ((innerText.length >= getAttribute(input, 'data-group').length &&
            !FORBIDDEN_KEYS.includes(e.keyCode)) ||
            e.keyCode === keys.DOT ||
            e.keyCode === keys.COMMA) {
            if (!nextSibling) {
                selectElement(input);
            }
            else if (nextSibling instanceof HTMLSpanElement) {
                selectElement(nextSibling);
            }
            onChangeValueText(joinDates(this.inputs, format));
        }
    }
    onClick(e) {
        selectElement(e.currentTarget);
    }
    onDblClick(e) {
        const input = e.currentTarget;
        if (input.parentNode && this.inputs.some(el => Boolean(el.innerText))) {
            selectElement(this.inputs[0]);
            selectElement(input.parentNode);
            this.setState({ allSelected: true }, this.props.onAllSelect);
        }
    }
    onBlur(e) {
        if (!this.state.allSelected) {
            const input = e.target;
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
            if (this.props.open &&
                focused &&
                !getAttribute(focused, 'data-react-timebomb-selectable')) {
                this.props.onToggle();
            }
        }, 0);
    }
    onChange(e) {
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
    onClear(e) {
        e.stopPropagation();
        this.props.onClear();
    }
    onToggle(e) {
        const { open, disabled, onToggle } = this.props;
        if (disabled) {
            return;
        }
        if (!this.inputs.some(inp => inp === e.target) || !open) {
            onToggle();
        }
    }
}
//# sourceMappingURL=value.js.map