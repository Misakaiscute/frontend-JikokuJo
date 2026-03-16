export const timeFormatter = (minsSinceDayStart: number): string => {
    const hours: string = String(Math.floor(minsSinceDayStart / 60)).padStart(2, '0');
    const minutes: string = String(minsSinceDayStart % 60).padStart(2, '0');

    return hours + ':' + minutes;
}