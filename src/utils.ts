// @ts-ignore
import momentDefaultImport from 'moment';
import * as momentImport from 'moment';

const moment: typeof momentImport = momentDefaultImport || momentImport;

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

export function isDisabled(
    date: Date,
    { minDate, maxDate }: { minDate?: Date; maxDate?: Date }
): boolean | undefined {
    return (
        (minDate && date < startOfDay(minDate)) ||
        (maxDate && date >= endOfDay(maxDate))
    );
}
