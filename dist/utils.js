"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keys = exports.replaceSpaceWithNbsp = exports.fillZero = exports.isArray = exports.sortDates = exports.isTimeFormat = exports.isDateFormat = exports.isDayFormat = exports.getAttribute = exports.isEnabled = exports.getWeekdayNames = exports.getMonthNames = exports.stringEqual = exports.dateEqual = exports.isBetween = exports.isAfter = exports.isBefore = exports.isToday = exports.isSameDay = exports.setDate = exports.isUndefined = exports.endOfMonth = exports.startOfMonth = exports.manipulateDate = exports.subtractYears = exports.subtractMonths = exports.subtractDays = exports.subtractHours = exports.subtractMinutes = exports.subtractSeconds = exports.addSeconds = exports.addMinutes = exports.addHours = exports.addYears = exports.addMonths = exports.addDays = exports.endOfDay = exports.startOfDay = exports.endOfWeek = exports.startOfWeek = exports.getWeekOfYear = exports.selectElement = exports.clearSelection = exports.joinDates = exports.splitDate = exports.formatNumberRaw = exports.formatNumber = exports.stringFromCharCode = exports.validateFormatType = exports.validateFormatGroup = exports.formatIsActualNumber = exports.getMeridiem = exports.is24HoursFormat = exports.getFormatType = exports.validateDate = exports.dateFormat = exports.formatSplitExpr = void 0;
// @ts-ignore
const moment_1 = require("moment");
const momentImport = require("moment");
const moment = moment_1.default || momentImport;
exports.formatSplitExpr = /[.|:|\-|\\|_|\/|\s]/;
function dateFormat(date, format) {
    if (isArray(date)) {
        return date.map(date => moment(date).format(format));
    }
    else {
        return moment(date).format(format);
    }
}
exports.dateFormat = dateFormat;
function validateDate(date, format) {
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
exports.validateDate = validateDate;
function getFormatType(format) {
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
exports.getFormatType = getFormatType;
function is24HoursFormat(format) {
    if (!format) {
        return false;
    }
    return /H|k/.test(format);
}
exports.is24HoursFormat = is24HoursFormat;
function getMeridiem(format) {
    if (!format) {
        return undefined;
    }
    const matcher = format.match(/\s+([aAp])$/);
    if (matcher) {
        return matcher[1];
    }
    return undefined;
}
exports.getMeridiem = getMeridiem;
function formatIsActualNumber(format) {
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
exports.formatIsActualNumber = formatIsActualNumber;
/** @return returns a string with transformed value, true for valid input or false for invalid input */
function validateFormatGroup(input, format) {
    const formatType = getFormatType(format);
    return validateFormatType(input, formatType);
}
exports.validateFormatGroup = validateFormatGroup;
/** @return returns a string with transformed value, true for valid input or false for invalid input */
function validateFormatType(input, formatType) {
    if (isFinite(input)) {
        const int = typeof input === 'string' ? parseInt(input, 10) : input;
        const char = String(input);
        const strLen = char.length;
        switch (formatType) {
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
exports.validateFormatType = validateFormatType;
const ALLOWED_CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
function stringFromCharCode(keyCode) {
    const charCode = keyCode - 48 * Math.floor(keyCode / 48);
    const char = String.fromCharCode(96 <= keyCode ? charCode : keyCode);
    if (ALLOWED_CHARS.includes(char)) {
        return char;
    }
    return '';
}
exports.stringFromCharCode = stringFromCharCode;
function formatNumber(number) {
    if (number <= 1) {
        return '01';
    }
    if (number <= 9) {
        return `0${number}`;
    }
    return String(number);
}
exports.formatNumber = formatNumber;
function formatNumberRaw(number) {
    if (number <= 9) {
        return `0${Number(number) || 0}`;
    }
    return String(number);
}
exports.formatNumberRaw = formatNumberRaw;
function splitDate(date, format) {
    const formattedDate = dateFormat(date, format);
    return formattedDate
        .split(exports.formatSplitExpr)
        .filter(group => group && exports.formatSplitExpr.test(group) === false);
}
exports.splitDate = splitDate;
function joinDates(parts, format) {
    const strParts = parts
        .map(part => (part instanceof HTMLElement ? part.innerText : part))
        .filter(val => val);
    const splittedFormat = format.split(exports.formatSplitExpr);
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
exports.joinDates = joinDates;
function clearSelection() {
    const sel = getSelection();
    if (sel) {
        if (sel.empty) {
            // Chrome
            sel.empty();
        }
        else if (sel.removeAllRanges) {
            // Firefox
            sel.removeAllRanges();
        }
    }
}
exports.clearSelection = clearSelection;
function selectElement(el, caret) {
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
        if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
}
exports.selectElement = selectElement;
function getWeekOfYear(date) {
    return moment(date).isoWeek();
}
exports.getWeekOfYear = getWeekOfYear;
function startOfWeek(date) {
    return moment(date)
        .startOf('isoWeek')
        .toDate();
}
exports.startOfWeek = startOfWeek;
function endOfWeek(date) {
    return moment(date)
        .endOf('isoWeek')
        .toDate();
}
exports.endOfWeek = endOfWeek;
function startOfDay(date) {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
}
exports.startOfDay = startOfDay;
function endOfDay(date) {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
}
exports.endOfDay = endOfDay;
function addDays(date, num) {
    return moment(date)
        .add(num, 'days')
        .toDate();
}
exports.addDays = addDays;
function addMonths(date, num) {
    return moment(date)
        .add(num, 'months')
        .toDate();
}
exports.addMonths = addMonths;
function addYears(date, num) {
    return moment(date)
        .add(num, 'years')
        .toDate();
}
exports.addYears = addYears;
function addHours(date, num) {
    return moment(date)
        .add(num, 'hours')
        .toDate();
}
exports.addHours = addHours;
function addMinutes(date, num) {
    return moment(date)
        .add(num, 'minutes')
        .toDate();
}
exports.addMinutes = addMinutes;
function addSeconds(date, num) {
    return moment(date)
        .add(num, 'seconds')
        .toDate();
}
exports.addSeconds = addSeconds;
function subtractSeconds(date, num) {
    return moment(date)
        .subtract(num, 'seconds')
        .toDate();
}
exports.subtractSeconds = subtractSeconds;
function subtractMinutes(date, num) {
    return moment(date)
        .subtract(num, 'minutes')
        .toDate();
}
exports.subtractMinutes = subtractMinutes;
function subtractHours(date, num) {
    return moment(date)
        .subtract(num, 'hours')
        .toDate();
}
exports.subtractHours = subtractHours;
function subtractDays(date, num) {
    return moment(date)
        .subtract(num, 'days')
        .toDate();
}
exports.subtractDays = subtractDays;
function subtractMonths(date, num) {
    return moment(date)
        .subtract(num, 'months')
        .toDate();
}
exports.subtractMonths = subtractMonths;
function subtractYears(date, num) {
    return moment(date)
        .subtract(num, 'years')
        .toDate();
}
exports.subtractYears = subtractYears;
function manipulateDate(date, formatType, direction, timeStep) {
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
                return addHours(date, 1);
            if (direction === 'subtract')
                return subtractHours(date, 1);
            break;
        case 'minute':
            if (direction === 'add')
                return addMinutes(date, timeStep || 1);
            if (direction === 'subtract')
                return subtractMinutes(date, timeStep || 1);
            break;
        case 'second':
            if (direction === 'add')
                return addSeconds(date, timeStep || 1);
            if (direction === 'subtract')
                return subtractSeconds(date, timeStep || 1);
            break;
    }
    return new Date();
}
exports.manipulateDate = manipulateDate;
function startOfMonth(date) {
    const newDate = new Date(date);
    newDate.setDate(1);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
}
exports.startOfMonth = startOfMonth;
function endOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
exports.endOfMonth = endOfMonth;
function isUndefined(val) {
    return val === null || val === undefined;
}
exports.isUndefined = isUndefined;
function setDate(date, hour, min) {
    const newDate = new Date(date);
    newDate.setHours(hour, min);
    return newDate;
}
exports.setDate = setDate;
function isSameDay(dateA, dateB) {
    return moment(dateA).isSame(dateB, 'day');
}
exports.isSameDay = isSameDay;
function isToday(date) {
    return moment(date).isSame(new Date(), 'day');
}
exports.isToday = isToday;
function isBefore(date, inp) {
    return moment(date).isBefore(inp, 'day');
}
exports.isBefore = isBefore;
function isAfter(date, inp) {
    return moment(date).isAfter(inp, 'day');
}
exports.isAfter = isAfter;
function isBetween(date, cmpDateA, cmpDateB, context = 'day') {
    return moment(date).isBetween(cmpDateA, cmpDateB, context, '[]');
}
exports.isBetween = isBetween;
function dateEqual(dateA, dateB, considerTime = false) {
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
exports.dateEqual = dateEqual;
function stringEqual(valueA, valueB) {
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
exports.stringEqual = stringEqual;
function getMonthNames(short) {
    if (short) {
        return moment.monthsShort();
    }
    return moment.months();
}
exports.getMonthNames = getMonthNames;
function getWeekdayNames() {
    return moment.weekdaysShort();
}
exports.getWeekdayNames = getWeekdayNames;
function isEnabled(context, date, { minDate, maxDate }) {
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
exports.isEnabled = isEnabled;
function getAttribute(input, attr) {
    return input.getAttribute(attr);
}
exports.getAttribute = getAttribute;
function isDayFormat(format) {
    return Boolean(/d/i.test(format));
}
exports.isDayFormat = isDayFormat;
function isDateFormat(format) {
    return Boolean(/D|M|Y/.test(format));
}
exports.isDateFormat = isDateFormat;
function isTimeFormat(format) {
    return Boolean(/H|h|m|k|a|S|s/.test(format));
}
exports.isTimeFormat = isTimeFormat;
function sortDates(a, b) {
    return a.getTime() - b.getTime();
}
exports.sortDates = sortDates;
function isArray(val) {
    return Array.isArray(val);
}
exports.isArray = isArray;
function fillZero(value, formatType) {
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
exports.fillZero = fillZero;
function replaceSpaceWithNbsp(str) {
    if (!str) {
        return str;
    }
    return str.replace(/ /g, ' ');
}
exports.replaceSpaceWithNbsp = replaceSpaceWithNbsp;
exports.keys = {
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