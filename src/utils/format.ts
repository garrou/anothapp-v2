const MINS_IN_HOUR = 60;

const MINS_IN_DAY = 1440;

const minsToStringDays = (mins: number): string => {
    const days = Math.floor(mins / MINS_IN_DAY);
    const time = minsToStringHours(Math.floor(mins % MINS_IN_DAY));
    return days === 0 ? `${time}` : `${days} jour${days > 1 ? "s" : ""} ${time}`;
}

const minsToStringHours = (mins: number): string => {
    const hours = Math.floor(mins / MINS_IN_HOUR);
    const remain = mins % MINS_IN_HOUR;
    return remain === 0 ? `${hours} h` : `${hours} h ${remain} min${remain > 1 ? "s" : ""}`;
}

export const formatDate = (toFormat: string): string => {
    const date = new Date(toFormat);
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    return `${dd < 10 ? "0" + dd : dd}/${mm < 10 ? "0" + mm : mm}/${yyyy}`;
}

export const minsToStringHoursDays = (mins: number = 0): string => {
    if (!mins || mins === 0)
        return "0 h";

    const hours = minsToStringHours(mins);
    const days = minsToStringDays(mins);
    return `${hours} • ${days}`;
}

export const buildUrl = (url: string, query: string, param?: string | number, separator: string = "&"): string => {
    return param === undefined ? url : url.concat(`${separator}${query}=${param}`);
}

export const buildPlural = (text: string, value?: number, prefix = true): string => {
    const num = value ?? 0;
    const plural = `${text}${num > 1 ? "s" : ""}`;
    return prefix ? `${num} ${plural}` : `${plural} ${num}`;
}