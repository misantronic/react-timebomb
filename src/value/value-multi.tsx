import * as React from 'react';
import { ArrowButton } from '../components/button';
import { ReactTimebombMultiValueProps } from '../typings';
import { dateFormat, keys } from '../utils';
import {
    Container,
    DefaultClearComponent,
    Flex,
    Icon,
    Placeholder
} from './value';

const DefaultIcon = () => <Icon className="react-timebomb-icon" icon="📅" />;

function Value(props: ReactTimebombMultiValueProps) {
    const { value } = props;
    const LabelComponent = props.labelComponent;

    if (!value) {
        return null;
    }

    if (LabelComponent) {
        return <LabelComponent {...props} />;
    }

    return <>{value.map(d => dateFormat(d, 'DD.MM.YYYY')).join(' – ')}</>;
}

export function ValueMulti(props: ReactTimebombMultiValueProps) {
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
    const showPlaceholder = placeholder && !open;
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
            onClick={disabled ? undefined : onToggle}
        >
            <Flex>
                {IconComponent && <IconComponent />}
                <Flex>
                    <Value {...props} />
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
