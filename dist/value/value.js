"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const styled_components_1 = require("styled-components");
const utils_1 = require("../utils");
const button_1 = require("../components/button");
exports.Flex = styled_components_1.default.div `
    display: flex;
    align-items: center;
    white-space: nowrap;
    position: relative;
    line-height: 1;
`;
exports.Container = styled_components_1.default(exports.Flex) `
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    border: 1px solid #ccc;
    cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};
    width: 100%;
    height: 100%;
    box-sizing: border-box;
`;
const Input = styled_components_1.default.span `
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
exports.ClearButton = styled_components_1.default(button_1.SmallButton) `
    font-size: 18px;
`;
const ClearButtonX = styled_components_1.default.span `
    position: relative;
    left: -1px;
    top: -2px;
`;
exports.Placeholder = styled_components_1.default.span `
    color: #aaa;
    user-select: none;
`;
exports.Icon = styled_components_1.default.span `
    margin-right: 5px;
    user-select: none;

    &:after {
        content: '${(props) => props.icon}';
    }
`;
const DefaultIcon = (props) => {
    function getIconClass() {
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
    return (React.createElement(exports.Icon, { icon: getIcon(), className: `react-timebomb-icon ${getIconClass()}` }));
};
exports.DefaultClearComponent = (props) => (React.createElement(exports.ClearButton, { className: "react-timebomb-clearer", tabIndex: -1, disabled: props.disabled, onClick: props.onClick },
    React.createElement(ClearButtonX, null, "\u00D7")));
const META_KEYS = [utils_1.keys.BACKSPACE, utils_1.keys.DELETE, utils_1.keys.TAB];
const FORBIDDEN_KEYS = [
    utils_1.keys.SHIFT,
    utils_1.keys.ARROW_LEFT,
    utils_1.keys.ARROW_RIGHT,
    utils_1.keys.ARROW_UP,
    utils_1.keys.ARROW_DOWN,
    utils_1.keys.TAB
];
class Value extends React.PureComponent {
    constructor(props) {
        super(props);
        this.inputs = [];
        this.onFocus = (() => {
            let timeout = 0;
            return (e) => {
                clearTimeout(timeout);
                const input = e.currentTarget;
                utils_1.selectElement(input);
                timeout = setTimeout(() => {
                    if (!this.state.allSelected) {
                        const formatGroup = utils_1.getAttribute(input, 'data-group');
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
                (utils_1.formatSplitExpr.test(prevChar) &&
                    utils_1.formatSplitExpr.test(char))) {
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
        setTimeout(() => {
            const { open, value, format, mode, allowValidation } = this.props;
            const hasFocus = this.inputs.some(inp => inp === this.focused);
            const allowTextSelection = mode === 'day' || mode === 'month' || mode === 'year';
            if (!hasFocus) {
                if (open) {
                    if (prevProps.value !== value && value) {
                        const parts = utils_1.splitDate(value, format);
                        const input = this.inputs[0];
                        this.inputs.forEach((input, i) => (input.innerText = parts[i]));
                        if (input && allowTextSelection) {
                            input.focus();
                        }
                    }
                    if (allowTextSelection) {
                        if (!prevProps.open || value !== prevProps.value) {
                            const [input] = this.inputs;
                            if (input) {
                                utils_1.selectElement(input);
                            }
                        }
                    }
                }
            }
            if (open &&
                prevProps.mode !== mode &&
                !this.state.allSelected &&
                allowTextSelection) {
                const input = this.inputs.find(el => {
                    const format = utils_1.getAttribute(el, 'data-group');
                    const type = utils_1.getFormatType(format);
                    return type === mode;
                });
                utils_1.selectElement(input);
            }
            if (!open && value) {
                const parts = utils_1.splitDate(value, format);
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
        const { placeholder, value, showDate, showTime, disabled, arrowButtonId, iconComponent, open } = this.props;
        const ArrowButtonComp = this.props.arrowButtonComponent || button_1.ArrowButton;
        const ClearComponent = this.props.clearComponent || exports.DefaultClearComponent;
        const showPlaceholder = placeholder && !open;
        const showClearer = value && !disabled;
        const timeOnly = showTime && !showDate;
        const IconComponent = iconComponent !== undefined ? iconComponent : DefaultIcon;
        return (React.createElement(exports.Container, { "data-role": "value", className: "react-slct-value react-timebomb-value", disabled: disabled, onClick: this.onToggle },
            React.createElement(exports.Flex, null,
                IconComponent && (React.createElement(IconComponent, { showDate: showDate, showTime: showTime })),
                React.createElement(exports.Flex, null,
                    this.renderValue(),
                    showPlaceholder && (React.createElement(exports.Placeholder, { className: "react-timebomb-placeholder" }, placeholder)))),
            React.createElement(exports.Flex, null,
                showClearer && (React.createElement(ClearComponent, { disabled: disabled, onClick: this.onClear })),
                !timeOnly && (React.createElement(ArrowButtonComp, { id: arrowButtonId, disabled: disabled, open: open })))));
    }
    renderValue() {
        const { open, disabled, mobile, value } = this.props;
        const contentEditable = !disabled && !mobile;
        if (!open && !value) {
            return null;
        }
        const formatGroups = this.formatGroups;
        return (React.createElement(exports.Flex, null, formatGroups.map((group, i) => {
            if (group.split('').some(g => utils_1.formatSplitExpr.test(g))) {
                return null;
            }
            else {
                const separator = formatGroups[i + 1];
                return (React.createElement(Input, { "data-react-timebomb-selectable": true, contentEditable: contentEditable, disabled: disabled, "data-placeholder": group, "data-separator": utils_1.replaceSpaceWithNbsp(separator), key: group, "data-group": group, ref: this.onSearchRef, onKeyDown: this.onKeyDown, onKeyUp: this.onKeyUp, onFocus: this.onFocus, onBlur: this.onBlur, onClick: this.onClick, onDoubleClick: this.onDblClick, onChange: this.onChange }));
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
        const { onChangeValueText, format, value, allowValidation, timeStep } = this.props;
        const input = e.currentTarget;
        const { innerText, nextSibling, previousSibling } = input;
        const formatGroup = utils_1.getAttribute(input, 'data-group');
        const numericFormat = utils_1.formatIsActualNumber(formatGroup);
        const sel = getSelection();
        const hasSelection = sel
            ? Boolean(sel.focusOffset - sel.anchorOffset)
            : false;
        let numericValue = parseInt(innerText, 10);
        switch (e.keyCode) {
            case utils_1.keys.ENTER:
            case utils_1.keys.ESC:
            case utils_1.keys.BACKSPACE:
            case utils_1.keys.DOT:
            case utils_1.keys.COMMA:
                e.preventDefault();
                return;
            case utils_1.keys.ARROW_RIGHT:
                e.preventDefault();
                if (nextSibling instanceof HTMLSpanElement) {
                    nextSibling.focus();
                }
                else {
                    utils_1.selectElement(input);
                }
                return;
            case utils_1.keys.ARROW_LEFT:
                e.preventDefault();
                if (previousSibling instanceof HTMLSpanElement) {
                    previousSibling.focus();
                }
                else {
                    utils_1.selectElement(input);
                }
                return;
            case utils_1.keys.ARROW_UP:
            case utils_1.keys.ARROW_DOWN:
                e.preventDefault();
                if (!numericFormat) {
                    return;
                }
                const isArrowUp = e.keyCode === utils_1.keys.ARROW_UP;
                if (isNaN(numericValue)) {
                    numericValue = 0;
                }
                if (isFinite(numericValue)) {
                    const formatType = utils_1.getFormatType(formatGroup);
                    if (!allowValidation) {
                        const add = formatType === 'minute' ? timeStep || 1 : 1;
                        const nextValue = numericValue + (isArrowUp ? add : -add);
                        const valid = utils_1.validateFormatGroup(nextValue, formatGroup);
                        if (valid) {
                            input.innerText =
                                typeof valid === 'string'
                                    ? valid
                                    : utils_1.formatNumber(nextValue);
                        }
                    }
                    else {
                        if (value && formatType) {
                            const direction = isArrowUp ? 'add' : 'subtract';
                            const newDate = utils_1.manipulateDate(value, formatType, direction, timeStep);
                            const enabled = utils_1.isEnabled('day', newDate, this.props);
                            if (enabled) {
                                const dateParts = utils_1.splitDate(newDate, format);
                                this.inputs.map((inp, i) => (inp.innerText = dateParts[i]));
                            }
                        }
                    }
                    utils_1.selectElement(input);
                    onChangeValueText(utils_1.joinDates(this.inputs, format));
                }
                return;
        }
        const char = utils_1.stringFromCharCode(e.keyCode);
        const groupValue = innerText && !hasSelection ? innerText + char : char;
        if (META_KEYS.includes(e.keyCode) || e.metaKey || e.ctrlKey) {
            return;
        }
        if (!numericFormat) {
            e.preventDefault();
            return;
        }
        const valid = utils_1.validateFormatGroup(groupValue, formatGroup);
        if (!valid) {
            e.preventDefault();
        }
        else if (typeof valid === 'string') {
            e.preventDefault();
            input.innerText = valid;
        }
        if (this.state.allSelected &&
            e.keyCode !== utils_1.keys.BACKSPACE &&
            e.keyCode !== utils_1.keys.DELETE) {
            const [firstInput] = this.inputs;
            let validatedChar = utils_1.validateFormatGroup(char, formatGroup);
            if (validatedChar && validatedChar === true) {
                validatedChar = char;
            }
            if (validatedChar) {
                e.preventDefault();
                this.inputs.forEach((el, i) => i !== 0 && (el.innerText = ''));
                if (validatedChar.length === 2) {
                    utils_1.selectElement(firstInput);
                }
                else {
                    utils_1.clearSelection();
                    firstInput.innerText = validatedChar;
                    firstInput.focus();
                    utils_1.selectElement(firstInput, [1, 1]);
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
        if (e.keyCode === utils_1.keys.ENTER) {
            e.preventDefault();
            if (this.focused) {
                this.focused.blur();
            }
            onSubmit();
            return;
        }
        if (e.keyCode === utils_1.keys.ESC) {
            onToggle();
            return;
        }
        if (this.state.allSelected) {
            if (e.keyCode === utils_1.keys.BACKSPACE || e.keyCode === utils_1.keys.DELETE) {
                // delete all
                this.inputs.forEach(el => (el.innerText = ''));
                utils_1.selectElement(this.inputs[0]);
            }
            this.setState({ allSelected: false });
        }
        // remove text / focus prev
        else if (e.keyCode === utils_1.keys.BACKSPACE) {
            if (innerText) {
                input.innerText = '';
            }
            else if (previousSibling instanceof HTMLSpanElement) {
                utils_1.selectElement(previousSibling);
            }
        }
        // focus next
        else if ((innerText.length >= utils_1.getAttribute(input, 'data-group').length &&
            !FORBIDDEN_KEYS.includes(e.keyCode)) ||
            e.keyCode === utils_1.keys.DOT ||
            e.keyCode === utils_1.keys.COMMA) {
            if (!nextSibling) {
                utils_1.selectElement(input);
            }
            else if (nextSibling instanceof HTMLSpanElement) {
                utils_1.selectElement(nextSibling);
            }
            onChangeValueText(utils_1.joinDates(this.inputs, format));
        }
    }
    onClick(e) {
        utils_1.selectElement(e.currentTarget);
    }
    onDblClick(e) {
        const input = e.currentTarget;
        if (input.parentNode && this.inputs.some(el => Boolean(el.innerText))) {
            utils_1.selectElement(this.inputs[0]);
            utils_1.selectElement(input.parentNode);
            this.setState({ allSelected: true }, this.props.onAllSelect);
        }
    }
    onBlur(e) {
        if (!this.state.allSelected) {
            const input = e.target;
            const value = input.innerText;
            const dataGroup = utils_1.getAttribute(input, 'data-group');
            const formatType = utils_1.getFormatType(dataGroup);
            if (formatType) {
                const filledValue = utils_1.fillZero(value, formatType);
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
                !utils_1.getAttribute(focused, 'data-react-timebomb-selectable')) {
                this.props.onToggle();
            }
        }, 0);
    }
    onChange(e) {
        const { format, onChangeValueText } = this.props;
        const input = e.currentTarget;
        const { innerText, nextSibling } = input;
        onChangeValueText(utils_1.joinDates(this.inputs, format));
        if (innerText.length >= utils_1.getAttribute(input, 'data-group').length) {
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
exports.Value = Value;
//# sourceMappingURL=value.js.map