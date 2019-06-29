import * as React from 'react';
import styled from 'styled-components';
import { FormatType } from '../typings';
import {
    formatNumberRaw,
    keys,
    addMinutes,
    addHours,
    subtractHours,
    subtractMinutes
} from '../utils';

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

export function NumberInput(props: NumberInputProps) {
    const { date, step, mode, onCancel, onSubmit } = props;
    const ref = React.useRef<HTMLInputElement | null>(null);
    const [focused, setFocused] = React.useState(false);
    const [value, setValue] = React.useState<number | string | undefined>(
        getDateValue(date)
    );

    React.useEffect(() => {
        setValue(getDateValue(props.date));
    }, [date.getTime()]);

    React.useEffect(() => {
        if (value && focused) {
            const newDate = setDateValue(value);

            props.onChange(newDate, mode);
        }
    }, [value]);

    function setDateValue(value: string | number) {
        const newDate = new Date(date);
        const newValue = parseInt((value as any) || '0', 10);

        switch (mode) {
            case 'hour':
                newDate.setHours(newValue);
                break;
            case 'minute':
                newDate.setMinutes(newValue);
                break;
        }

        return newDate;
    }

    function getDateValue(date: Date) {
        switch (mode) {
            case 'hour':
                return date.getHours();
            case 'minute':
                return date.getMinutes();
        }

        return 0;
    }

    function getRenderedValue() {
        if (focused) {
            return value;
        } else {
            return isFinite(value as any) ? formatNumberRaw(value as any) : '';
        }
    }

    function onFocusIn() {
        setFocused(true);
    }

    function onFocusOut() {
        if (document.querySelector(':focus') !== ref.current) {
            setFocused(false);
        }
    }

    function onChange(e: React.SyntheticEvent<HTMLInputElement>) {
        const { value } = e.currentTarget;

        if (value.length > 2) {
            e.preventDefault();
            return;
        }

        if (value === '') {
            setValue(value);
        } else if (date) {
            const newDate = setDateValue(value);

            setValue(getDateValue(newDate));
        }
    }

    function onStepUp() {
        if (date) {
            const newDate = (() => {
                switch (mode) {
                    case 'hour':
                        return addHours(date, 1);
                    case 'minute':
                        return addMinutes(date, step!);
                }

                return undefined;
            })();

            if (newDate) {
                props.onChange(newDate, mode);
            }
        }
    }

    function onStepDown() {
        if (date) {
            const newDate = (() => {
                switch (mode) {
                    case 'hour':
                        return subtractHours(date, 1);
                    case 'minute':
                        return subtractMinutes(date, step!);
                }

                return undefined;
            })();

            if (newDate) {
                props.onChange(newDate, mode);
            }
        }
    }

    function onKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
        switch (e.keyCode) {
            case keys.ENTER:
                onSubmit(date, mode);
                break;
            case keys.ESC:
                onCancel(undefined, mode);
                break;
        }
    }

    return (
        <InputContainer
            className={`react-timebomb-number-input ${mode}`}
            onMouseEnter={onFocusIn}
            onMouseLeave={onFocusOut}
        >
            <Input
                data-react-timebomb-selectable
                type="number"
                ref={ref}
                step={step}
                value={getRenderedValue()}
                onChange={onChange}
                onFocus={onFocusIn}
                onBlur={onFocusOut}
                onKeyUp={onKeyUp}
            />
            <Steps>
                <Step
                    data-react-timebomb-selectable
                    tabIndex={-1}
                    onClick={onStepUp}
                >
                    ▲
                </Step>
                <Step
                    data-react-timebomb-selectable
                    tabIndex={-1}
                    onClick={onStepDown}
                >
                    ▼
                </Step>
            </Steps>
        </InputContainer>
    );
}
