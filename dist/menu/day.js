"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const utils_1 = require("../utils");
const styled_components_1 = require("styled-components");
const Flex = styled_components_1.default.div `
    display: flex;
    align-items: center;
`;
const StyledDay = styled_components_1.default(Flex) `
    padding: 8px 2px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: ${(props) => (props.current ? 'inherit' : '#aaa')};
    background-color: ${(props) => props.selected
    ? '#ddd'
    : props.today
        ? 'rgba(172, 206, 247, 0.4)'
        : 'transparent'};
    font-weight: ${(props) => props.selected ? 'bold' : 'normal'};
    pointer-events: ${(props) => props.disabled ? 'none' : 'auto'};
    user-select: none;
    opacity: ${(props) => (props.disabled ? 0.3 : 1)};

    &:hover {
        background-color: ${(props) => props.selected ? '#ddd' : '#eee'};
    }
`;
class Day extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            current: false,
            enabled: true,
            today: false,
            selected: false
        };
        this.onSelectDay = this.onSelectDay.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }
    get selected() {
        const { value, selectWeek, selectRange, hoverDay, day } = this.props;
        if (value) {
            if (selectWeek) {
                const dayWeekOfYear = utils_1.getWeekOfYear(day);
                if (utils_1.isArray(value)) {
                    return value.some(v => utils_1.getWeekOfYear(v) === dayWeekOfYear);
                }
                return utils_1.getWeekOfYear(value) === dayWeekOfYear;
            }
            if (selectRange && utils_1.isArray(value)) {
                const [minDate, maxDate] = value;
                if (value.length === 1 && hoverDay) {
                    return utils_1.isEnabled('day', day, {
                        minDate: minDate < hoverDay ? minDate : hoverDay,
                        maxDate: minDate > hoverDay ? minDate : hoverDay
                    });
                }
                if (value.length === 2) {
                    return utils_1.isEnabled('day', day, {
                        minDate,
                        maxDate
                    });
                }
            }
        }
        return utils_1.dateEqual(value, day, this.props.showTime);
    }
    get current() {
        const { day, date } = this.props;
        const dayMonth = day.getMonth();
        if (utils_1.isArray(date)) {
            return date.some(d => d.getMonth() === dayMonth);
        }
        if (date) {
            return dayMonth === date.getMonth();
        }
        return false;
    }
    get enabled() {
        return utils_1.isEnabled('day', this.props.day, this.props);
    }
    get today() {
        return utils_1.isToday(this.props.day);
    }
    componentDidMount() {
        this.updateState();
    }
    componentDidUpdate(prevProps) {
        this.updateState(prevProps);
    }
    render() {
        const { day } = this.props;
        const { selected, current, enabled, today } = this.state;
        return (React.createElement(StyledDay, { className: selected ? 'value selected' : 'value', selected: selected, current: current, disabled: !enabled, today: today, onClick: this.onSelectDay, onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave }, day.getDate()));
    }
    updateState(prevProps = {}) {
        const { day, minDate, maxDate } = this.props;
        const dayChanged = !utils_1.dateEqual(prevProps.day, day);
        const minMaxChanged = !utils_1.dateEqual(prevProps.minDate, minDate) ||
            !utils_1.dateEqual(prevProps.maxDate, maxDate);
        this.setState({
            current: this.current,
            enabled: dayChanged || minMaxChanged ? this.enabled : this.state.enabled,
            today: dayChanged ? this.today : this.state.today,
            selected: this.selected
        });
    }
    onSelectDay() {
        this.props.onSelectDay(this.props.day);
    }
    onMouseEnter() {
        this.props.onMouseEnter(this.props.day);
    }
    onMouseLeave() {
        this.props.onMouseLeave(this.props.day);
    }
}
exports.Day = Day;
class WeekNum extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    render() {
        return React.createElement("div", { onClick: this.onClick }, this.props.children);
    }
    onClick() {
        this.props.onClick(this.props.day);
    }
}
exports.WeekNum = WeekNum;
//# sourceMappingURL=day.js.map