type DateHelper = {
    sameDayAs: (other: Date | number) => ReturnType<typeof sameDayAs>,
    getStartOfDay: () => ReturnType<typeof startOfDay>,
    addDays: (days: number) => ReturnType<typeof addDays>,
    isPastDay: (other: Date | number) => ReturnType<typeof isPastDay>,
    dayInMinutes: () => ReturnType<typeof dayInMinutes>
}

export const dateHelpers = (date: Date | number): DateHelper => {
    const dateAsDate: Date = date instanceof Date ? date : new Date(date);
    return {
        sameDayAs: (other: Date | number) => sameDayAs(dateAsDate, other),
        getStartOfDay: () => startOfDay(dateAsDate),
        addDays: (days: number) => addDays(dateAsDate, days),
        isPastDay: (other: Date | number) => isPastDay(dateAsDate, other),
        dayInMinutes: () => dayInMinutes(dateAsDate),
    }
}

const sameDayAs = (date: Date, other: Date | number): boolean => {
    const otherAsDate: Date = other instanceof Date ? other : new Date(other);
    return date.getDate() === otherAsDate.getDate() &&
        date.getMonth() === otherAsDate.getMonth() &&
        date.getFullYear() === otherAsDate.getFullYear();
}
const startOfDay = (date: Date): Date  => {
    const startOfDayDate: Date = new Date(date.getTime());
    startOfDayDate.setHours(0, 0, 0, 0);
    return startOfDayDate;
}
const addDays = (date: Date, days: number): Date => {
    const DAY_IN_MILLISECONDS: number = 86400000;
    return new Date(date.getTime() + DAY_IN_MILLISECONDS * days);
}
const isPastDay = (date: Date, other: Date | number): boolean => {
    const otherAsDate: Date = other instanceof Date ? other : new Date(other);
    return otherAsDate.getFullYear() <= date.getFullYear() &&
        otherAsDate.getMonth() <= date.getMonth() &&
        otherAsDate.getDate() < date.getDate();
}
const dayInMinutes = (date: Date): number => {
    return date.getHours() * 60 + date.getMinutes();
}