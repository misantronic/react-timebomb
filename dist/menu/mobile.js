var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import * as React from 'react';
import { withGesture } from 'react-with-gesture';
import styled from 'styled-components';
const MobileMenuTableWrapper = styled.div `
    display: flex;
    width: 300%;
    position: relative;
    left: -100%;
    transition: ${(props) => props.animate ? 'transform 0.15s ease-out' : 'none'};
`;
let GestureWrapper = class GestureWrapper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidUpdate(prevProps) {
        const props = this.props;
        if (prevProps.down && !props.down) {
            const [xDir] = props.direction;
            let x = '';
            let direction;
            if (xDir > 0) {
                x = '33.3%';
                direction = 'prev';
            }
            else if (xDir < 0) {
                x = '-33.3%';
                direction = 'next';
            }
            if (x && direction) {
                this.setState({ x }, () => {
                    setTimeout(() => {
                        this.setState({ x: undefined }, () => this.props.onChangeMonth(direction));
                    }, 167);
                });
            }
        }
    }
    render() {
        const props = this.props;
        const { x } = this.state;
        const [deltaX] = props.delta;
        const translateX = x || `${props.down ? deltaX : 0}px`;
        return (React.createElement(MobileMenuTableWrapper, { animate: Boolean(x), style: { transform: `translateX(${translateX})` } }, props.children));
    }
};
GestureWrapper = __decorate([
    withGesture({ mouse: false }),
    __metadata("design:paramtypes", [Object])
], GestureWrapper);
export { GestureWrapper };
//# sourceMappingURL=mobile.js.map