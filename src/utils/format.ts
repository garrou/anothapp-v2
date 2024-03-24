const MINS_IN_HOUR = 60;

const MINS_IN_DAY = 1440;

export const formatDate = (toFormat: string): string => {
    const date = new Date(toFormat);
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    return `${dd < 10 ? "0" + dd : dd}/${mm < 10 ? "0" + mm : mm}/${yyyy}`;
}

export const minsToStringDays = (mins: number): string => {
    const days = Math.floor(mins / MINS_IN_DAY);
    return days === 0 ? "" : `${days} jour${days > 1 ? "s" : ""}`;
}

export const minsToStringHours = (mins: number): string => {
    const hours = Math.floor(mins / MINS_IN_HOUR);
    const remain = mins % MINS_IN_HOUR;
    return `${hours} h ${remain} minute${remain > 1 ? "s" : ""}`;
}

export const minsToStringHoursDays = (mins: number = 0): string => {
    const hours = minsToStringHours(mins);
    const days = minsToStringDays(mins);
    return days !== "" ? `${hours} • ${days}` : hours;
}

export const buildUrl = (url: string, query: string, param: string | undefined, separator: string = "&"): string => url.concat(param ? `${separator}${query}=${param}` : "");