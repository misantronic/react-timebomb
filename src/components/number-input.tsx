import * as React from 'react';
import styled from 'styled-components';
import { FormatType } from '../typings';
import { formatNumberRaw, keys } from '../utils';

const Steps = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 0;
    top: 0;
    width: 24px;
    height: 100%;
    border-width: 0 1px;
    border-style: solid;
    border-color: #ccc;
    visibility: hidden;
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

const InputContainer = styled.div`
    position: relative;
    flex: 1;
    display: flex;

    &:hover {
        ${Steps} {
            visibility: visible;
        }
    }

    &:last-child {
        ${Steps} {
            border-right: none;
        }
    }
`;

const Input = styled.input`
    flex: 1;
    padding: 0 25px 0 6px;
    margin: 0;
    width: 50%;
    min-height: 32px;
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

    &:focus {
        background: #eee;

        + ${Steps} {
            visibility: visible;
        }
    }
`;

interface NumberInputProps {
    date: Date;
    mode: FormatType;
    step?: number;
    onChange(date: Date, mode: FormatType): void;
    onSubmit(date: Date, mode: FormatType): void;
    onCancel(date: undefined, mode: FormatType): void;
}

interface NumberInputState {
    value?: any;
    focused?: boolean;
}

export class NumberInput extends React.PureComponent<
    NumberInputProps,
    NumberInputState
> {
    private ref = React.createRef<HTMLInputElement>();

    private get renderedValue() {
        if (this.state.focused) {
            return this.state.value;
        } else {
            return isFinite(this.state.value)
                ? formatNumberRaw(this.state.value)
                : '';
        }
    }

    constructor(props: NumberInputProps) {
        super(props);

        this.state = {};

        this.onChange = this.onChange.bind(this);
        this.onFocusIn = this.onFocusIn.bind(this);
        this.onFocusOut = this.onFocusOut.bind(this);
        this.onStepUp = this.onStepUp.bind(this);
        this.onStepDown = this.onStepDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    public static defaultProps: Partial<NumberInputProps> = {
        step: 1
    };

    public componentDidMount() {
        const { date } = this.props;

        if (date) {
            this.setStateValue();
        }
    }

    public componentDidUpdate(
        prevProps: NumberInputProps,
        prevState: NumberInputState
    ) {
        const { date, mode, onChange } = this.props;
        const { value, focused } = this.state;

        if (date && prevProps.date.getTime() !== date.getTime()) {
            this.setStateValue();
        }

        if (prevState.value !== value && value !== '' && focused) {
            const newDate = this.setDateValue(value);

            onChange(newDate, mode);
        }
    }

    public render() {
        const { step, mode } = this.props;

        return (
            <InputContainer
                className={`react-timebomb-number-input ${mode}`}
                onMouseEnter={this.onFocusIn}
                onMouseLeave={this.onFocusOut}
            >
                <Input
                    data-react-timebomb-selectable
                    type="number"
                    ref={this.ref}
                    step={step}
                    value={this.renderedValue}
                    onChange={this.onChange}
                    onFocus={this.onFocusIn}
                    onBlur={this.onFocusOut}
                    onKeyUp={this.onKeyUp}
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

    private setStateValue(value = this.props.date) {
        this.setState({ value: this.getDateValue(value) });
    }

    private setDateValue(value: string | number) {
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

    private getDateValue(date: Date) {
        switch (this.props.mode) {
            case 'hour':
                return date.getHours();
            case 'minute':
                return date.getMinutes();
        }

        return 0;
    }

    private onFocusIn() {
        this.setState({ focused: true });
    }

    private onFocusOut() {
        if (document.querySelector(':focus') !== this.ref.current) {
            this.setState({ focused: false });
        }
    }

    private onChange(e: React.SyntheticEvent<HTMLInputElement>) {
        const { date } = this.props;
        const { value } = e.currentTarget;

        if (value.length > 2) {
            e.preventDefault();
            return;
        }

        if (value === '') {
            this.setState({ value });
        } else if (date) {
            const newDate = this.setDateValue(value);

            this.setStateValue(newDate);
        }
    }

    private onStepUp() {
        const { date, step } = this.props;
        const { value } = this.state;

        if (date && value !== undefined) {
            const newDate = this.setDateValue(value + step!);

            this.setStateValue(newDate);
        }
    }

    private onStepDown() {
        const { date, step } = this.props;
        const { value } = this.state;

        if (date && value !== undefined) {
            const newDate = this.setDateValue(value - step!);

            this.setStateValue(newDate);
        }
    }

    private onKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
        switch (e.keyCode) {
            case keys.ENTER:
                this.props.onSubmit(this.props.date, this.props.mode);
                break;
            case keys.ESC:
                this.props.onCancel(undefined, this.props.mode);
                break;
        }
    }
}
