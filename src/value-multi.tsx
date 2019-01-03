import * as React from 'react';
import {
    Container,
    Flex,
    Icon,
    ValueProps,
    Placeholder,
    ClearButton,
    ArrowButton
} from './value';
import { dateFormat } from './utils';

interface MultiValueProps {
    value: undefined | Date[];
    placeholder: ValueProps['placeholder'];
    open: ValueProps['open'];
    onToggle(): void;
    onClear(): void;
}

export class ValueMulti extends React.PureComponent<MultiValueProps> {
    constructor(props: MultiValueProps) {
        super(props);

        this.onClear = this.onClear.bind(this);
    }

    public render() {
        const { placeholder, value, open } = this.props;
        const showPlaceholder = placeholder && !open;

        return (
            <Container
                data-role="value"
                className="react-slct-value react-timebomb-value"
                onClick={this.props.onToggle}
            >
                <Flex>
                    <Icon className="react-timebomb-icon" />
                    <Flex>
                        {this.renderValue()}
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
                            tabIndex={-1}
                            onClick={this.onClear}
                        >
                            ×
                        </ClearButton>
                    )}
                    <ArrowButton tabIndex={-1} className="react-timebomb-arrow">
                        {open ? '▲' : '▼'}
                    </ArrowButton>
                </Flex>
            </Container>
        );
    }

    private renderValue() {
        const { value } = this.props;

        if (!value) {
            return null;
        }

        return value.map(d => dateFormat(d, 'DD.MM.YYYY')).join(' - ');
    }

    private onClear(e: React.SyntheticEvent<HTMLButtonElement>): void {
        e.stopPropagation();

        this.props.onClear();
    }
}
