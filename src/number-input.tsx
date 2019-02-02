import * as React from 'react';
import styled from 'styled-components';
import { FormatType } from './typings';

const InputContainer = styled.div`
    position: relative;
    flex: 1;
    display: flex;
    border: 1px solid #ccc;
`;

const Input = styled.input`
    flex: 1;
    padding: 4px 16px 4px 6px;
    margin: 0;
    width: 50%;
    text-align: center;
    border: none;

    // @see https://stackoverflow.com/a/4298216/1138860
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        /* display: none; <- Crashes Chrome on hover */
        -webkit-appearance: none;
        margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
    }

    &:focus {
        outline: none;
    }
`;

const Steps = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 1px;
    top: 1px;
    width: 15px;
    height: calc(100% - 2px);
    border-left: 1px solid #ccc;
`;

const Step = styled.button`
    margin: 0;
    padding: 0;
    line-height: 1;
    border: none;
    flex: 1;
    font-size: 8px;
    color: #ccc;
    cursor: pointer;
    -webkit-appearance: none;

    &:focus {
        outline: none;
    }

    &:hover {
        background: #eee;
        color: #000;
    }
`;

interface NumberInputProps {
    date: Date;
    mode: FormatType;
    step?: number;
    onChange(date: Date): void;
}

interface NumberInputState {
    value?: number;
}

export class NumberInput extends React.PureComponent<
    NumberInputProps,
    NumberInputState
> {
    constructor(props: NumberInputProps) {
        super(props);

        this.state = {};

        this.onChange = this.onChange.bind(this);
        this.onStepUp = this.onStepUp.bind(this);
        this.onStepDown = this.onStepDown.bind(this);
    }

    public static defaultProps: Partial<NumberInputProps> = {
        step: 1
    };

    public static getDerivedStateFromProps(
        prevProps: NumberInputProps
    ): NumberInputState | undefined {
        switch (prevProps.mode) {
            case 'hour':
                return { value: prevProps.date.getHours() };
            case 'minute':
                return { value: prevProps.date.getMinutes() };
        }

        return undefined;
    }

    public render() {
        const { step } = this.props;

        return (
            <InputContainer>
                <Input
                    data-react-timebomb-selectable
                    type="number"
                    step={step}
                    value={this.state.value}
                    onChange={this.onChange}
                />
                <Steps>
                    <Step
                        data-react-timebomb-selectable
                        tabIndex={-1}
                        onClick={this.onStepUp}
                    >
                        ▲
                    </Step>
                    <Step
                        data-react-timebomb-selectable
                        tabIndex={-1}
                        onClick={this.onStepDown}
                    >
                        ▼
                    </Step>
                </Steps>
            </InputContainer>
        );
    }

    private manipulateDate(value: string | number) {
        const newDate = new Date(this.props.date);
        const newValue = parseInt((value as any) || '0', 10);

        switch (this.props.mode) {
            case 'hour':
                newDate.setHours(newValue);
                break;
            case 'minute':
                newDate.setMinutes(newValue);
                break;
        }

        return newDate;
    }

    private onChange(e: React.SyntheticEvent<HTMLInputElement>) {
        const { date } = this.props;
        const { value } = e.currentTarget;

        if (date) {
            const newDate = this.manipulateDate(value);

            this.props.onChange(newDate);
        }
    }

    private onStepUp() {
        const { date, step } = this.props;
        const { value } = this.state;

        if (date && value !== undefined) {
            const newDate = this.manipulateDate(value + step!);

            this.props.onChange(newDate);
        }
    }

    private onStepDown() {
        const { date, step } = this.props;
        const { value } = this.state;

        if (date && value !== undefined) {
            const newDate = this.manipulateDate(value - step!);

            this.props.onChange(newDate);
        }
    }
}
