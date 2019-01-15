import * as React from 'react';
import { withGesture, GestureState } from 'react-with-gesture';
import styled from 'styled-components';

const MobileMenuTableWrapper = styled.div`
    display: flex;
    width: 300%;
    position: relative;
    left: -100%;
    transition: ${(props: { animate: boolean }) =>
        props.animate ? 'transform 0.15s ease-out' : 'none'};
`;

export type GestureDirection = 'next' | 'prev';

interface MobileMenuTableWrapperWithGestureProps extends GestureState {
    children: React.ReactNode;
    onChangeMonth(direction: GestureDirection): void;
}

@(withGesture({ mouse: false }) as any)
export class GestureWrapper extends React.PureComponent<
    { onChangeMonth(direction: GestureDirection): void },
    { x?: string }
> {
    constructor(props) {
        super(props);

        this.state = {};
    }

    public componentDidUpdate(
        prevProps: MobileMenuTableWrapperWithGestureProps
    ) {
        const props = this.props as MobileMenuTableWrapperWithGestureProps;

        if (prevProps.down && !props.down) {
            const [xDir] = props.direction;
            let x = '';
            let direction: GestureDirection | undefined;

            if (xDir > 0) {
                x = '33.3%';
                direction = 'prev';
            } else if (xDir < 0) {
                x = '-33.3%';
                direction = 'next';
            }

            if (x && direction) {
                this.setState({ x }, () => {
                    setTimeout(() => {
                        this.setState({ x: undefined }, () =>
                            this.props.onChangeMonth(direction!)
                        );
                    }, 167);
                });
            }
        }
    }

    public render() {
        const props = this.props as MobileMenuTableWrapperWithGestureProps;
        const { x } = this.state;
        const [deltaX] = props.delta;
        const translateX = x || `${props.down ? deltaX : 0}px`;

        return (
            <MobileMenuTableWrapper
                animate={Boolean(x)}
                style={{ transform: `translateX(${translateX})` }}
            >
                {props.children}
            </MobileMenuTableWrapper>
        );
    }
}
