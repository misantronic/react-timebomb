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

interface GestureWrapperProps extends GestureState {
    children: React.ReactNode;
    allowPrev: boolean;
    allowNext: boolean;
    onChangeMonth(direction: GestureDirection): void;
}

@(withGesture({ mouse: false }) as any)
export class GestureWrapper extends React.PureComponent<
    {
        allowPrev: boolean;
        allowNext: boolean;
        onChangeMonth(direction: GestureDirection): void;
    },
    { x?: string; cooldown?: boolean }
> {
    constructor(props) {
        super(props);

        this.state = {};
    }

    public componentDidUpdate(prevProps: GestureWrapperProps) {
        const props = this.props as GestureWrapperProps;
        const { allowNext, allowPrev, down } = props;

        if (prevProps.down && !down) {
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
                if (
                    (direction === 'next' && !allowNext) ||
                    (direction === 'prev' && !allowPrev)
                ) {
                    return;
                }

                this.setState({ x, cooldown: true }, () => {
                    setTimeout(() => {
                        this.setState({ x: undefined }, () => {
                            this.props.onChangeMonth(direction!);
                            this.setState({ cooldown: false });
                        });
                    }, 167);
                });
            }
        }
    }

    public render() {
        const props = this.props as GestureWrapperProps;
        const { x, cooldown } = this.state;
        let [deltaX] = props.delta;

        if (!this.props.allowNext && deltaX < 0) {
            deltaX = 0;
        }

        if (!this.props.allowPrev && deltaX > 0) {
            deltaX = 0;
        }

        let translateX = x || `${props.down ? deltaX : 0}px`;

        if (cooldown && props.cancel) {
            props.cancel();
        }

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
