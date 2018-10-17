import * as tslib_1 from "tslib";
import { bind } from 'lodash-decorators';
import * as React from 'react';
import styled from 'styled-components';
import { keys, formatNumber, splitDate, joinDates, stringFromCharCode, validateFormatGroup, getAttribute, getFormatType, manipulateDate, isDisabled } from './utils';
const Flex = styled.div `
    display: flex;
    align-items: center;
`;
const Container = styled(Flex) `
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    border: 1px solid #ccc;
    cursor: pointer;
`;
const Input = styled.span `
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
const Button = styled.button `
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
const ClearButton = styled(Button) `
    font-size: 18px;
`;
const Placeholder = styled.span `
    color: #aaa;
    user-select: none;
`;
const Icon = styled.span `
    margin-right: 5px;
    user-select: none;

    &:after {
        content: '📅';
    }
`;
const WHITELIST_KEYS = [keys.BACKSPACE, keys.DELETE, keys.TAB];
export class Value extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.searchInputs = [];
    }
    get formatGroups() {
        return this.props.format.split('').reduce((memo, char) => {
            const prevChar = memo[memo.length - 1];
            if (prevChar && char === prevChar.substr(0, 1)) {
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
    componentDidUpdate(prevProps) {
        const { open, value, format } = this.props;
        const hasFocus = this.searchInputs.some(inp => inp === this.focused);
        if (!hasFocus) {
            if (prevProps.value !== value && value) {
                const parts = splitDate(value, format);
                const input = this.searchInputs[0];
                this.searchInputs.forEach((input, i) => (input.innerText = parts[i]));
                if (input) {
                    input.focus();
                }
            }
            if ((open && !prevProps.open) || value !== prevProps.value) {
                const input = this.searchInputs[0];
                if (input) {
                    if (input.innerText === '') {
                        input.focus();
                    }
                    else {
                        this.selectText(input);
                    }
                }
            }
        }
        if (!open && value) {
            const parts = splitDate(value, format);
            this.searchInputs.forEach((input, i) => (input.innerText = parts[i]));
        }
    }
    render() {
        const { placeholder, value, open } = this.props;
        const showPlaceholder = placeholder && !open;
        return (React.createElement(Container, { "data-role": "value", className: "react-slct-value react-timebomb-value", onClick: this.onToggle },
            React.createElement(Flex, null,
                React.createElement(Icon, { className: "react-timebomb-icon" }),
                React.createElement(Flex, null,
                    this.renderValue(),
                    showPlaceholder && (React.createElement(Placeholder, { className: "react-timebomb-placeholder" }, placeholder)))),
            React.createElement(Flex, null,
                value && (React.createElement(ClearButton, { className: "react-timebomb-clearer", tabIndex: -1, onClick: this.onClear }, "\u00D7")),
                React.createElement(Button, { tabIndex: -1, className: "react-timebomb-arrow" }, open ? '▲' : '▼'))));
    }
    renderValue() {
        const { open, value } = this.props;
        if (!open && !value) {
            return null;
        }
        const { formatGroups } = this;
        return (React.createElement(Flex, null, formatGroups.map((group, i) => {
            if (group === '.' || group === ':' || group === ' ') {
                return null;
            }
            else {
                const separator = formatGroups[i + 1];
                return (React.createElement(Input, { contentEditable: true, "data-placeholder": group, "data-separator": separator, key: group, "data-group": group, ref: this.onSearchRef, onKeyDown: this.onKeyDown, onKeyUp: this.onKeyUp, onFocus: this.onFocus, onClick: this.onFocus, onChange: this.onChange }));
            }
        })));
    }
    selectText(el) {
        if (el) {
            const range = document.createRange();
            const sel = getSelection();
            range.selectNodeContents(el);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
    onSearchRef(el) {
        if (el) {
            this.searchInputs.push(el);
        }
        else {
            this.searchInputs = [];
        }
    }
    onKeyDown(e) {
        const { onChangeValueText, format, value, allowValidation } = this.props;
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
                }
                else {
                    this.selectText(input);
                }
                return;
            case keys.ARROW_LEFT:
                e.preventDefault();
                if (previousSibling instanceof HTMLSpanElement) {
                    previousSibling.focus();
                }
                else {
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
                            const newDate = manipulateDate(value, formatType, direction);
                            const disabled = isDisabled(newDate, this.props);
                            if (!disabled) {
                                const dateParts = splitDate(newDate, format);
                                this.searchInputs.map((inp, i) => (inp.innerText = dateParts[i]));
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
        }
        else if (typeof valid === 'string') {
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
    onKeyUp(e) {
        const { onChangeValueText, format, allowValidation } = this.props;
        const input = e.currentTarget;
        const { innerText, nextSibling } = input;
        if (e.keyCode === keys.ENTER || e.keyCode === keys.ESC) {
            if (this.focused) {
                this.focused.blur();
            }
            this.props.onSubmit(this.props.onToggle);
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
        if (innerText.length >= getAttribute(input, 'data-group').length &&
            !forbiddenKeys.includes(e.keyCode)) {
            if (allowValidation || !nextSibling) {
                this.selectText(input);
            }
            else if (nextSibling instanceof HTMLSpanElement) {
                this.selectText(nextSibling);
            }
            onChangeValueText(joinDates(this.searchInputs, format));
        }
        input.setAttribute('data-value', innerText);
    }
    onFocus(e) {
        this.selectText(e.currentTarget);
    }
    onChange(e) {
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
    onClear(e) {
        e.stopPropagation();
        this.props.onChangeValueText('');
    }
    onToggle(e) {
        const { open, onToggle } = this.props;
        if (this.searchInputs.some(inp => inp === e.target) === false ||
            !open) {
            onToggle();
        }
    }
}
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], Value.prototype, "renderValue", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [HTMLSpanElement]),
    tslib_1.__metadata("design:returntype", void 0)
], Value.prototype, "onSearchRef", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Value.prototype, "onKeyDown", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Value.prototype, "onKeyUp", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Value.prototype, "onFocus", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Value.prototype, "onChange", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Value.prototype, "onClear", null);
tslib_1.__decorate([
    bind,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Value.prototype, "onToggle", null);
//# sourceMappingURL=value.js.map