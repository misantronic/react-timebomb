import * as React from 'react';
import {
    Container,
    Flex,
    Icon,
    ValueProps,
    Placeholder,
    ClearButton,
    DefaultClearComponent
} from './value';
import { dateFormat, keys } from '../utils';
import { ArrowButton } from '../components/button';

interface MultiValueProps {
    value: undefined | Date[];
    placeholder: ValueProps['placeholder'];
    open: ValueProps['open'];
    arrowButtonComponent: ValueProps['arrowButtonComponent'];
    arrowButtonId: ValueProps['arrowButtonId'];
    clearComponent: ValueProps['clearComponent'];
    iconComponent: ValueProps['iconComponent'];
    disabled: ValueProps['disabled'];
    onToggle(): void;
    onClear(): void;
}

const DefaultIcon = () => <Icon className="react-timebomb-icon" icon="📅" />;

function Value(props: MultiValueProps) {
    const { value } = props;

    if (!value) {
        return null;
    }

    return <>{value.map(d => dateFormat(d, 'DD.MM.YYYY')).join(' – ')}</>;
}

export function ValueMulti(props: MultiValueProps) {
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
                    <ClearButton
                        className="react-timebomb-clearer"
                        disabled={disabled}
                        tabIndex={-1}
                        onClick={onClear}
                    >
                        <ClearComponent />
                    </ClearButton>
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
