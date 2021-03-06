// @ts-ignore
import momentDefaultImport from 'moment';
import * as momentImport from 'moment';
import { ReactTimebombDate, FormatType } from './typings';

const moment: typeof momentImport = momentDefaultImport || momentImport;

export const formatSplitExpr = /[.|:|\-|\\|_|\/|\s]/;

export function dateFormat(date: Date, format: string): string;
export function dateFormat(date: Date[], format: string): string[];
export function dateFormat(
    date: Date | Date[],
    format: string
): string | string[];
export function dateFormat(
    date: Date | Date[],
    format: string
): string | string[] {
    if (isArray(date)) {
        return date.map(date => moment(date).format(format));
    } else {
        return moment(date).format(format);
    }
}

export function validateDate(
    date: string | string[] | undefined,
    format: string
): ReactTimebombDate {
    if (isArray(date)) {
        const dates = date
            .map(date => {
                const instance = moment(date, format, true);

                return instance.isValid() ? instance.toDate() : undefined;
            })
            .filter(d => Boolean(d)) as Date[];

        return dates.length === 0 ? undefined : dates;
    } else {
        const instance = moment(date, format, true);

        return instance.isValid() ? instance.toDate() : undefined;
    }
}

export function getFormatType(format: string): FormatType | undefined {
    if (/^D/.test(format)) {
        return 'day';
    }

    if (/^M/.test(format)) {
        return 'month';
    }

    if (/^Y/.test(format)) {
        return 'year';
    }

    if (/^h/i.test(format)) {
        return 'hour';
    }

    if (/^m/.test(format)) {
        return 'minute';
    }

    if (/^s/.test(format)) {
        return 'second';
    }

    return undefined;
}

export function is24HoursFormat(format?: string): boolean {
    if (!format) {
        return false;
    }

    return /H|k/.test(format);
}

export function getMeridiem(format?: string) {
    if (!format) {
        return undefined;
    }

    const matcher = format.match(/\s+([aAp])$/);

    if (matcher) {
        return matcher[1];
    }

    return undefined;
}

export function formatIsActualNumber(format: string) {
    // day / year
    if (/D|Y|H|h|m|s/.test(format)) {
        return true;
    }

    // month
    if (format === 'M' || format === 'MM') {
        return true;
    }

    return false;
}

/** @return returns a string with transformed value, true for valid input or false for invalid input */
export function validateFormatGroup(
    input: string | number,
    format: string
): boolean | string {
    const formatType = getFormatType(format);

    return validateFormatType(input, formatType);
}

/** @return returns a string with transformed value, true for valid input or false for invalid input */
export function validateFormatType(
    input: string | number,
    formatType?: FormatType
) {
    if (isFinite(input as any)) {
        const int = typeof input === 'string' ? parseInt(input, 10) : input;
        const char = String(input);
        const strLen = char.length;

        switch (formatType) {
            case 'day':
                if (strLen === 1) {
                    if (int >= 0 && int <= 3) {
                        return true;
                    } else {
                        return `0${input}`;
                    }
                }

                if (strLen === 2 && int >= 1 && int <= 31) {
                    return true;
                }
                break;
            case 'month':
                if (strLen === 1) {
                    if (int === 0 || int === 1) {
                        return true;
                    } else {
                        return `0${input}`;
                    }
                }

                if (strLen === 2 && int >= 0 && int <= 12) {
                    return true;
                }
                break;
            case 'year':
                if (strLen === 1 && (int === 1 || int === 2)) {
                    return true;
                }

                if (
                    strLen >= 2 &&
                    (char.startsWith('19') || char.startsWith('20'))
                ) {
                    return true;
                }
                break;
            case 'hour':
                if (strLen === 1) {
                    if (int >= 0 && int <= 2) {
                        return true;
                    } else {
                        return `0${input}`;
                    }
                }

                if (strLen >= 2 && int >= 0 && int <= 24) {
                    return true;
                }
                break;
            case 'minute':
            case 'second':
                if (strLen === 1) {
                    if (int >= 0 && int <= 5) {
                        return true;
                    } else {
                        return `0${input}`;
                    }
                }

                if (strLen >= 2 && int >= 0 && int <= 59) {
                    return true;
                }
                break;
        }
    }

    return false;
}

const ALLOWED_CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function stringFromCharCode(keyCode: number): string {
    const charCode = keyCode - 48 * Math.floor(keyCode / 48);
    const char = String.fromCharCode(96 <= keyCode ? charCode : keyCode);

    if (ALLOWED_CHARS.includes(char)) {
        return char;
    }

    return '';
}

export function formatNumber(number: number): string {
    if (number <= 1) {
        return '01';
    }

    if (number <= 9) {
        return `0${number}`;
    }

    return String(number);
}

export function formatNumberRaw(number: number): string {
    if (number <= 9) {
        return `0${Number(number) || 0}`;
    }

    return String(number);
}

export function splitDate(date: Date, format: string): string[] {
    const formattedDate = dateFormat(date, format);

    return formattedDate
        .split(formatSplitExpr)
        .filter(group => group && formatSplitExpr.test(group) === false);
}

export function joinDates(
    parts: (string | HTMLElement)[],
    format: string
): string {
    const strParts = parts
        .map(part => (part instanceof HTMLElement ? part.innerText : part))
        .filter(val => val);
    const splittedFormat = format.split(formatSplitExpr);

    if (strParts.length !== splittedFormat.length) {
        return '';
    }

    const date = strParts.join(' ');
    const spaceFormat = splittedFormat.join(' ');
    const momentDate = moment(date, spaceFormat);
    const parsingFlags = momentDate.parsingFlags();

    if (parsingFlags.overflow === 2) {
        return moment(
            // @ts-ignore
            new Date(...parsingFlags.parsedDateParts)
        ).format(format);
    }

    return momentDate.format(format);
}

export function clearSelection(): void {
    const sel = getSelection();

    if (sel) {
        if (sel.empty) {
            // Chrome
            sel.empty();
        } else if (sel.removeAllRanges) {
            // Firefox
            sel.removeAllRanges();
        }
    }
}

export function selectElement(
    el: HTMLElement | undefined,
    caret?: number[]
): void {
    if (el) {
        const range = document.createRange();
        const sel = getSelection();

        if (caret === undefined) {
            range.selectNodeContents(el);
        } else {
            const [start, end] = caret;

            range.setStart(el, start);
            range.setEnd(el, end);
        }

        if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
}

export function getWeekOfYear(date: Date): number {
    return moment(date).isoWeek();
}

export function startOfWeek(date: Date): Date {
    return moment(date)
        .startOf('isoWeek')
        .toDate();
}

export function endOfWeek(date: Date): Date {
    return moment(date)
        .endOf('isoWeek')
        .toDate();
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
    return moment(date)
        .add(num, 'days')
        .toDate();
}

export function addMonths(date: Date, num: number): Date {
    return moment(date)
        .add(num, 'months')
        .toDate();
}

export function addYears(date: Date, num: number): Date {
    return moment(date)
        .add(num, 'years')
        .toDate();
}

export function addHours(date: Date, num: number): Date {
    return moment(date)
        .add(num, 'hours')
        .toDate();
}

export function addMinutes(date: Date, num: number): Date {
    return moment(date)
        .add(num, 'minutes')
        .toDate();
}

export function addSeconds(date: Date, num: number): Date {
    return moment(date)
        .add(num, 'seconds')
        .toDate();
}

export function subtractSeconds(date: Date, num: number): Date {
    return moment(date)
        .subtract(num, 'seconds')
        .toDate();
}

export function subtractMinutes(date: Date, num: number): Date {
    return moment(date)
        .subtract(num, 'minutes')
        .toDate();
}

export function subtractHours(date: Date, num: number): Date {
    return moment(date)
        .subtract(num, 'hours')
        .toDate();
}

export function subtractDays(date: Date, num: number): Date {
    return moment(date)
        .subtract(num, 'days')
        .toDate();
}

export function subtractMonths(date: Date, num: number): Date {
    return moment(date)
        .subtract(num, 'months')
        .toDate();
}

export function subtractYears(date: Date, num: number): Date {
    return moment(date)
        .subtract(num, 'years')
        .toDate();
}

export function manipulateDate(
    date: Date,
    formatType: FormatType,
    direction: 'add' | 'subtract',
    timeStep?: number
): Date {
    switch (formatType) {
        case 'day':
            if (direction === 'add') return addDays(date, 1);
            if (direction === 'subtract') return subtractDays(date, 1);
            break;
        case 'month':
            if (direction === 'add') return addMonths(date, 1);
            if (direction === 'subtract') return subtractMonths(date, 1);
            break;
        case 'year':
            if (direction === 'add') return addYears(date, 1);
            if (direction === 'subtract') return subtractYears(date, 1);
            break;
        case 'hour':
            if (direction === 'add') return addHours(date, 1);
            if (direction === 'subtract') return subtractHours(date, 1);
            break;
        case 'minute':
            if (direction === 'add') return addMinutes(date, timeStep || 1);
            if (direction === 'subtract')
                return subtractMinutes(date, timeStep || 1);
            break;
        case 'second':
            if (direction === 'add') return addSeconds(date, timeStep || 1);
            if (direction === 'subtract')
                return subtractSeconds(date, timeStep || 1);
            break;
    }

    return new Date();
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

export function isSameDay(dateA: Date, dateB: Date): boolean {
    return moment(dateA).isSame(dateB, 'day');
}

export function isToday(date: Date): boolean {
    return moment(date).isSame(new Date(), 'day');
}

export function isBefore(date: Date, inp: Date) {
    return moment(date).isBefore(inp, 'day');
}

export function isAfter(date: Date, inp: Date) {
    return moment(date).isAfter(inp, 'day');
}

export function isBetween(
    date: Date,
    cmpDateA?: Date,
    cmpDateB?: Date,
    context: momentImport.unitOfTime.StartOf = 'day'
) {
    return moment(date).isBetween(cmpDateA, cmpDateB, context, '[]');
}

export function dateEqual(
    dateA?: ReactTimebombDate,
    dateB?: ReactTimebombDate,
    considerTime = false
) {
    if (!dateA || !dateB) {
        return false;
    }

    if (considerTime) {
        if (isArray(dateA)) {
            dateA = dateA.map(startOfDay);
        } else {
            dateA = startOfDay(dateA);
        }

        if (isArray(dateB)) {
            dateB = dateB.map(startOfDay);
        } else {
            dateB = startOfDay(dateB);
        }
    }

    if (isArray(dateA) && isArray(dateB)) {
        return dateA.every((date, i) => {
            const dBi = dateB![i];

            if (date && dBi) {
                return date.getTime() === dBi.getTime();
            }

            return false;
        });
    } else if (isArray(dateA) && dateB instanceof Date) {
        return dateA.some(d => d.getTime() === (dateB as Date).getTime());
    } else if (isArray(dateB) && dateA instanceof Date) {
        return dateB.some(d => d.getTime() === (dateA as Date).getTime());
    } else if (!isArray(dateA) && !isArray(dateB)) {
        return dateA.getTime() === dateB.getTime();
    }

    return false;
}

export function stringEqual(
    valueA?: string | string[],
    valueB?: string | string[]
): boolean {
    if (valueA === valueB) {
        return true;
    }

    if (!valueA || !valueB) {
        return false;
    }

    if (isArray(valueA) && isArray(valueB) && valueA.length === valueB.length) {
        return valueA.every((val, i) => val === valueB[i]);
    }

    return false;
}

export function getMonthNames(short?: boolean): string[] {
    if (short) {
        return moment.monthsShort();
    }

    return moment.months();
}

export function getWeekdayNames() {
    return moment.weekdaysShort();
}

export function isEnabled(
    context: momentImport.unitOfTime.StartOf,
    date: Date,
    { minDate, maxDate }: { minDate?: Date; maxDate?: Date }
): boolean {
    if (!minDate && !maxDate) {
        return true;
    }

    if (minDate && !maxDate) {
        return moment(date).isSameOrAfter(minDate, context);
    }

    if (!minDate && maxDate) {
        return moment(date).isSameOrBefore(maxDate, context);
    }

    return isBetween(date, minDate, maxDate, context);
}

export function getAttribute(input: Element, attr: string): string {
    return input.getAttribute(attr)!;
}

export function isDayFormat(format: string) {
    return Boolean(/d/i.test(format));
}

export function isDateFormat(format: string) {
    return Boolean(/D|M|Y/.test(format));
}

export function isTimeFormat(format: string) {
    return Boolean(/H|h|m|k|a|S|s/.test(format));
}

export function sortDates(a: Date, b: Date) {
    return a.getTime() - b.getTime();
}

export function isArray(val: any): val is any[] {
    return Array.isArray(val);
}

export function fillZero(value: string | number, formatType: FormatType) {
    value = String(value);

    switch (formatType) {
        case 'day':
            if (value === '1' || value === '2' || value === '3') {
                return `0${value}`;
            }
            break;
        case 'month':
            if (value === '1') {
                return `0${value}`;
            }
            break;
    }

    return undefined;
}

export function replaceSpaceWithNbsp(str?: string) {
    if (!str) {
        return str;
    }

    return str.replace(/ /g, ' ');
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
    SHIFT: 16,
    DOT: 190,
    COMMA: 188
};
