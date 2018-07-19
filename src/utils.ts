// @ts-ignore
import momentDefaultImport from 'moment';
import * as momentImport from 'moment';

const moment: typeof momentImport = momentDefaultImport || momentImport;
const formatSplit = /[.|:|-|\\|_|\s]/;

export function dateFormat(date: Date, format: string): string {
    return moment(date).format(format);
}

export function validateDate(
    date: string | undefined,
    format: string
): Date | null {
    const instance = moment(date, format, true);

    return instance.isValid() ? instance.toDate() : null;
}

export function validateFormatGroup(
    char: string,
    format: string
): boolean | string {
    if (isFinite(char as any)) {
        const int = parseInt(char, 10);
        const strLen = char.length;

        if (/d/i.test(format)) {
            if (strLen === 1) {
                if (int >= 0 && int <= 3) {
                    return true;
                } else {
                    return `0${char}`;
                }
            }

            if (strLen === 2 && int >= 1 && int <= 31) {
                return true;
            }
        }

        if (/M/.test(format)) {
            if (strLen === 1) {
                if (int === 0 || int === 1) {
                    return true;
                } else {
                    return `0${char}`;
                }
            }

            if (strLen === 2 && int >= 0 && int <= 12) {
                return true;
            }
        }

        if (/y/i.test(format)) {
            if (strLen === 1 && (int === 1 || int === 2)) {
                return true;
            }

            if (
                strLen >= 2 &&
                (char.startsWith('19') || char.startsWith('20'))
            ) {
                return true;
            }
        }

        if (/h/i.test(format)) {
            if (strLen === 1) {
                if (int >= 0 && int <= 2) {
                    return true;
                } else {
                    return `0${char}`;
                }
            }

            if (strLen >= 2 && int >= 0 && int <= 24) {
                return true;
            }
        }

        if (/m|s/.test(format)) {
            if (strLen === 1) {
                if (int >= 0 && int <= 5) {
                    return true;
                } else {
                    return `0${char}`;
                }
            }

            if (strLen >= 2 && int >= 0 && int <= 59) {
                return true;
            }
        }
    }

    return false;
}

export function stringFromCharCode(keyCode: number): string {
    const charCode = keyCode - 48 * Math.floor(keyCode / 48);

    return String.fromCharCode(96 <= keyCode ? charCode : keyCode);
}

export function formatNumber(number: Number): string {
    if (number <= 1) {
        return '01';
    }

    if (number <= 9) {
        return `0${number}`;
    }

    return String(number);
}

export function splitDate(date: Date, format: string): string[] {
    return moment(date)
        .format(format)
        .split(formatSplit);
}

export function joinDates(
    parts: (string | HTMLElement)[],
    format: string
): string {
    const strParts = parts
        .map(part => (part instanceof HTMLElement ? part.innerText : part))
        .filter(val => val);
    const splittedFormat = format.split(formatSplit);

    if (strParts.length !== splittedFormat.length) {
        return '';
    }

    return moment(strParts.join(' '), splittedFormat.join(' ')).format(format);
}

export function clearSelection(): void {
    const sel = getSelection();

    if (sel.empty) {
        // Chrome
        sel.empty();
    } else if (sel.removeAllRanges) {
        // Firefox
        sel.removeAllRanges();
    }
}

export function startOfDay(date: Date): Date {
    const newDate = new Date(date);

    newDate.setHours(0, 0, 0, 0);

    return newDate;
}

export function endOfDay(date: Date): Date {
    const newDate = new Date(date);

    newDate.setHours(23, 59, 59, 999);

    return newDate;
}

export function addDays(date: Date, num: number): Date {
    const newDate = new Date(date);

    newDate.setTime(newDate.getTime() + 1000 * 60 * 60 * 24 * num);

    return newDate;
}

export function subtractDays(date: Date, num: number): Date {
    const newDate = new Date(date);

    newDate.setTime(newDate.getTime() - 1000 * 60 * 60 * 24 * num);

    return newDate;
}

export function startOfMonth(date: Date): Date {
    const newDate = new Date(date);

    newDate.setDate(1);
    newDate.setHours(0, 0, 0, 0);

    return newDate;
}

export function endOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function isUndefined(val): val is undefined {
    return val === null || val === undefined;
}

export function setDate(date: Date, hour: number, min?: number): Date {
    const newDate = new Date(date);

    newDate.setHours(hour, min);

    return newDate;
}

export function isDisabled(
    date: Date,
    { minDate, maxDate }: { minDate?: Date; maxDate?: Date }
): boolean | undefined {
    return (
        (minDate && date < startOfDay(minDate)) ||
        (maxDate && date >= endOfDay(maxDate))
    );
}

export const keys = {
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
    ARROW_LEFT: 37,
    ENTER: 13,
    TAB: 9,
    ESC: 27,
    BACKSPACE: 8,
    DELETE: 46,
    SPACE: 32,
    A: 65
};
