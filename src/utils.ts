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
