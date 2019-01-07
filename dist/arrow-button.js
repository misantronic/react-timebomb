import * as React from 'react';
import { SmallButton } from './button';
export const ArrowButton = (props) => (React.createElement(SmallButton, { className: "react-timebomb-arrow", disabled: props.disabled, tabIndex: -1 }, props.open ? '▲' : '▼'));
//# sourceMappingURL=arrow-button.js.map