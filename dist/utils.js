// @ts-ignore
import momentDefaultImport from 'moment';
import * as momentImport from 'moment';
const moment = momentDefaultImport || momentImport;
export const formatSplitExpr = /[.|:|\-|\\|_|\s]/;
export function dateFormat(date, format) {
    if (isArray(date)) {
        return date.map(date => moment(date).format(format));
    }
    else {
        return moment(date).format(format);
    }
}
export function validateDate(date, format) {
    if (isArray(date)) {
        const dates = date
            .map(date => {
            const instance = moment(date, format, true);
            return instance.isValid() ? instance.toDate() : undefined;
        })
            .filter(d => Boolean(d));
        return dates.length === 0 ? undefined : dates;
    }
    else {
        const instance = moment(date, format, true);
        return instance.isValid() ? instance.toDate() : undefined;
    }
}
export function getFormatType(format) {
    if (/^D/.test(format)) {
        return 'day';
    }
    if (/^M/.test(format)) {
        return 'month';
    }
    if (/^Y/.test(format)) {
        return 'year';
    }
    if (/^H/.test(format)) {
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
export function formatIsActualNumber(format) {
    // day / year
    if (/D|Y/.test(format)) {
        return true;
    }
    // month
    if (format === 'M' || format === 'MM') {
        return true;
    }
    return false;
}
/** @return returns a string with transformed value, true for valid input or false for invalid input */
export function validateFormatGroup(input, format) {
    if (isFinite(input)) {
        const int = typeof input === 'string' ? parseInt(input, 10) : input;
        const char = String(input);
        const strLen = char.length;
        const type = getFormatType(format);
        switch (type) {
            case 'day':
                if (strLen === 1) {
                    if (int >= 0 && int <= 3) {
                        return true;
                    }
                    else {
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
                    }
                    else {
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
                if (strLen >= 2 &&
                    (char.startsWith('19') || char.startsWith('20'))) {
                    return true;
                }
                break;
            case 'hour':
                if (strLen === 1) {
                    if (int >= 0 && int <= 2) {
                        return true;
                    }
                    else {
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
                    }
                    else {
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
export function stringFromCharCode(keyCode) {
    const charCode = keyCode - 48 * Math.floor(keyCode / 48);
    const char = String.fromCharCode(96 <= keyCode ? charCode : keyCode);
    if (ALLOWED_CHARS.includes(char)) {
        return char;
    }
    return '';
}
export function formatNumber(number) {
    if (number <= 1) {
        return '01';
    }
    if (number <= 9) {
        return `0${number}`;
    }
    return String(number);
}
export function splitDate(date, format) {
    const formattedDate = dateFormat(date, format);
    return formattedDate
        .split(formatSplitExpr)
        .filter(group => group && formatSplitExpr.test(group) === false);
}
export function joinDates(parts, format) {
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
        new Date(...parsingFlags.parsedDateParts)).format(format);
    }
    return momentDate.format(format);
}
export function clearSelection() {
    const sel = getSelection();
    if (sel.empty) {
        // Chrome
        sel.empty();
    }
    else if (sel.removeAllRanges) {
        // Firefox
        sel.removeAllRanges();
    }
}
export function selectElement(el, caret) {
    if (el) {
        const range = document.createRange();
        const sel = getSelection();
        if (caret === undefined) {
            range.selectNodeContents(el);
        }
        else {
            const [start, end] = caret;
            range.setStart(el, start);
            range.setEnd(el, end);
        }
        sel.removeAllRanges();
        sel.addRange(range);
    }
}
export function getWeekOfYear(date) {
    return moment(date).isoWeek();
}
export function startOfWeek(date) {
    return moment(date)
        .startOf('isoWeek')
        .toDate();
}
export function endOfWeek(date) {
    return moment(date)
        .endOf('isoWeek')
        .toDate();
}
export function startOfDay(date) {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
}
export function endOfDay(date) {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
}
export function addDays(date, num) {
    return moment(date)
        .add(num, 'days')
        .toDate();
}
export function addMonths(date, num) {
    return moment(date)
        .add(num, 'months')
        .toDate();
}
export function addYears(date, num) {
    return moment(date)
        .add(num, 'years')
        .toDate();
}
export function addHours(date, num) {
    return moment(date)
        .add(num, 'hours')
        .toDate();
}
export function addMinutes(date, num) {
    return moment(date)
        .add(num, 'minutes')
        .toDate();
}
export function addSeconds(date, num) {
    return moment(date)
        .add(num, 'seconds')
        .toDate();
}
export function subtractSeconds(date, num) {
    return moment(date)
        .subtract(num, 'seconds')
        .toDate();
}
export function subtractMinutes(date, num) {
    return moment(date)
        .subtract(num, 'minutes')
        .toDate();
}
export function subtractHours(date, num) {
    return moment(date)
        .subtract(num, 'hours')
        .toDate();
}
export function subtractDays(date, num) {
    return moment(date)
        .subtract(num, 'days')
        .toDate();
}
export function subtractMonths(date, num) {
    return moment(date)
        .subtract(num, 'months')
        .toDate();
}
export function subtractYears(date, num) {
    return moment(date)
        .subtract(num, 'years')
        .toDate();
}
export function manipulateDate(date, formatType, direction, shift = false) {
    switch (formatType) {
        case 'day':
            if (direction === 'add')
                return addDays(date, 1);
            if (direction === 'subtract')
                return subtractDays(date, 1);
            break;
        case 'month':
            if (direction === 'add')
                return addMonths(date, 1);
            if (direction === 'subtract')
                return subtractMonths(date, 1);
            break;
        case 'year':
            if (direction === 'add')
                return addYears(date, 1);
            if (direction === 'subtract')
                return subtractYears(date, 1);
            break;
        case 'hour':
            if (direction === 'add')
                return addHours(date, shift ? 10 : 1);
            if (direction === 'subtract')
                return subtractHours(date, shift ? 10 : 1);
            break;
        case 'minute':
            if (direction === 'add')
                return addMinutes(date, shift ? 10 : 1);
            if (direction === 'subtract')
                return subtractMinutes(date, shift ? 10 : 1);
            break;
        case 'second':
            if (direction === 'add')
                return addSeconds(date, shift ? 10 : 1);
            if (direction === 'subtract')
                return subtractSeconds(date, shift ? 10 : 1);
            break;
    }
    return new Date();
}
export function startOfMonth(date) {
    const newDate = new Date(date);
    newDate.setDate(1);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
}
export function endOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
export function isUndefined(val) {
    return val === null || val === undefined;
}
export function setDate(date, hour, min) {
    const newDate = new Date(date);
    newDate.setHours(hour, min);
    return newDate;
}
export function isToday(date) {
    return moment(date).isSame(new Date(), 'day');
}
export function isBefore(date, inp) {
    return moment(date).isBefore(inp, 'day');
}
export function isAfter(date, inp) {
    return moment(date).isAfter(inp, 'day');
}
export function dateEqual(dateA, dateB, considerTime = false) {
    if (!dateA || !dateB) {
        return false;
    }
    if (considerTime) {
        if (isArray(dateA)) {
            dateA = dateA.map(startOfDay);
        }
        else {
            dateA = startOfDay(dateA);
        }
        if (isArray(dateB)) {
            dateB = dateB.map(startOfDay);
        }
        else {
            dateB = startOfDay(dateB);
        }
    }
    if (isArray(dateA) && isArray(dateB)) {
        return dateA.every((date, i) => {
            const dBi = dateB[i];
            if (date && dBi) {
                return date.getTime() === dBi.getTime();
            }
            return false;
        });
    }
    else if (isArray(dateA) && dateB instanceof Date) {
        return dateA.some(d => d.getTime() === dateB.getTime());
    }
    else if (isArray(dateB) && dateA instanceof Date) {
        return dateB.some(d => d.getTime() === dateA.getTime());
    }
    else if (!isArray(dateA) && !isArray(dateB)) {
        return dateA.getTime() === dateB.getTime();
    }
    return false;
}
export function getMonthNames(short) {
    if (short) {
        return moment.monthsShort();
    }
    return moment.months();
}
export function getWeekdayNames() {
    return moment.weekdaysShort();
}
export function isEnabled(context, date, { minDate, maxDate }) {
    if (!minDate && !maxDate) {
        return true;
    }
    if (minDate && !maxDate) {
        return moment(date).isSameOrAfter(minDate, context);
    }
    if (!minDate && maxDate) {
        return moment(date).isSameOrBefore(maxDate, context);
    }
    return moment(date).isBetween(minDate, maxDate, context, '[]');
}
export function getAttribute(input, attr) {
    return input.getAttribute(attr);
}
export function isDateFormat(format) {
    return Boolean(/D|M|Y/.test(format));
}
export function isTimeFormat(format) {
    return Boolean(/H|h|m|k|a|S|s/.test(format));
}
export function sortDates(a, b) {
    return a.getTime() - b.getTime();
}
export function isArray(val) {
    return Array.isArray(val);
}
export function fillZero(value, formatType) {
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
export function replaceSpaceWithNbsp(str) {
    if (!str) {
        return str;
    }
    return str.replace(' ', ' ');
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
//# sourceMappingURL=utils.js.map