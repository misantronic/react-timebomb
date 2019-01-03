import * as React from 'react';
import { Container, Flex, Icon, Placeholder, ClearButton, ArrowButton } from './value';
import { dateFormat } from './utils';
export class ValueMulti extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onClear = this.onClear.bind(this);
    }
    render() {
        const { placeholder, value, open } = this.props;
        const showPlaceholder = placeholder && !open;
        return (React.createElement(Container, { "data-role": "value", className: "react-slct-value react-timebomb-value", onClick: this.props.onToggle },
            React.createElement(Flex, null,
                React.createElement(Icon, { className: "react-timebomb-icon" }),
                React.createElement(Flex, null,
                    this.renderValue(),
                    showPlaceholder && (React.createElement(Placeholder, { className: "react-timebomb-placeholder" }, placeholder)))),
            React.createElement(Flex, null,
                value && (React.createElement(ClearButton, { className: "react-timebomb-clearer", tabIndex: -1, onClick: this.onClear }, "\u00D7")),
                React.createElement(ArrowButton, { tabIndex: -1, className: "react-timebomb-arrow" }, open ? '▲' : '▼'))));
    }
    renderValue() {
        const { value } = this.props;
        if (!value) {
            return null;
        }
        return value.map(d => dateFormat(d, 'DD.MM.YYYY')).join(' - ');
    }
    onClear(e) {
        e.stopPropagation();
        this.props.onClear();
    }
}
//# sourceMappingURL=value-multi.js.map