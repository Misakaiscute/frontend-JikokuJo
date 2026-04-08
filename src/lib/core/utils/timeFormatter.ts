export const timeFormatter = (minsSinceDayStart: number, withColon: boolean = true): string => {
    const hours: string = String(
        Math.floor((minsSinceDayStart % (60 * 24)) / 60)
    ).padStart(2, '0');
    const minutes: string = String(
        minsSinceDayStart % 60
    ).padStart(2, '0');

    if (withColon) {
        return hours + ':' + minutes;
    } else {
        return hours + minutes;
    }
}