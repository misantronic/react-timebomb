import * as React from 'react';
import styled from 'styled-components';
import { ArrowButton } from '../components/button';
import { ReactTimebombMultiValueProps } from '../typings';
import { dateEqual, dateFormat, keys } from '../utils';
import {
    Container,
    DefaultClearComponent,
    Flex,
    Icon,
    Placeholder
} from './value';

const DefaultIcon = () => <Icon className="react-timebomb-icon" icon="📅" />;

const StyledValue = styled(Value)`
    > span:after {
        content: ' – ';
    }

    > span:last-child:after {
        content: '';
    }
`;

const HoverSpan = styled.span`
    opacity: 0.5;
`;

function Value(props: ReactTimebombMultiValueProps) {
    const { value, className } = props;
    const LabelComponent = props.labelComponent;

    const content = (() => {
        if (!value) {
            return null;
        }

        if (LabelComponent) {
            return <LabelComponent {...props} />;
        }

        if (value.length === 1) {
            return <span>{dateFormat(value[0], props.format)}</span>;
        }

        return (
            <>
                {value.map((d, i) => {
                    const str = dateFormat(d, props.format);

                    if (dateEqual(d, props.hoverDate)) {
                        return <HoverSpan key={i}>{str}</HoverSpan>;
                    } else {
                        return <span key={i}>{str}</span>;
                    }
                })}
            </>
        );
    })();

    return <div className={className}>{content}</div>;
}

export const ValueMulti = React.forwardRef(
    (props: ReactTimebombMultiValueProps, ref: React.Ref<HTMLDivElement>) => {
        const {
            placeholder,
            value,
            open,
            disabled,
            arrowButtonId,
            iconComponent,
            onToggle
        } = props;
        const ArrowButtonComp = props.arrowButtonComponent || ArrowButton;
        const ClearComponent = props.clearComponent || DefaultClearComponent;
        const showPlaceholder = placeholder && !value;
        const IconComponent =
            iconComponent !== undefined ? iconComponent : DefaultIcon;

        React.useEffect(() => {
            document.body.addEventListener('keyup', onKeyUp);

            return () => {
                document.body.removeEventListener('keyup', onKeyUp);
            };
        }, []);

        function onClear(e: React.MouseEvent<HTMLButtonElement>): void {
            e.stopPropagation();

            props.onClear();
        }

        function onKeyUp(e: KeyboardEvent) {
            switch (e.keyCode) {
                case keys.ESC:
                    if (open) {
                        onToggle();
                    }
                    break;
            }
        }

        return (
            <Container
                data-role="value"
                className="react-slct-value react-timebomb-value"
                disabled={disabled}
                ref={ref}
                onClick={disabled ? undefined : onToggle}
            >
                <Flex>
                    {IconComponent && <IconComponent />}
                    <Flex>
                        <StyledValue {...props} />
                        {showPlaceholder && (
                            <Placeholder className="react-timebomb-placeholder">
                                {placeholder}
                            </Placeholder>
                        )}
                    </Flex>
                </Flex>
                <Flex>
                    {value && (
                        <ClearComponent disabled={disabled} onClick={onClear} />
                    )}
                    <ArrowButtonComp
                        id={arrowButtonId}
                        disabled={disabled}
                        open={open}
                    />
                </Flex>
            </Container>
        );
    }
);
