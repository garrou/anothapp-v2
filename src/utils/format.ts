const MINS_IN_HOUR = 60;
const MINS_IN_DAY = 1440;

const minsToStringDays = (mins: number): string => {
    const days = Math.floor(mins / MINS_IN_DAY);
    const time = minsToStringHours(Math.floor(mins % MINS_IN_DAY));
    return days === 0 ? `${time}` : `${days} j ${time}`;
}

const minsToStringHours = (mins: number): string => {
    const hours = Math.floor(mins / MINS_IN_HOUR);
    const remain = mins % MINS_IN_HOUR;
    return remain === 0 ? `${hours} h` : `${hours} h ${remain} min${remain > 1 ? "s" : ""}`;
}

export const formatDateTime = (toFormat: string): string => {
    const date = new Date(toFormat);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export const formatDate = (toFormat: string): string => {
    const date = new Date(toFormat);
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    return `${dd < 10 ? "0" + dd : dd}/${mm < 10 ? "0" + mm : mm}/${yyyy}`;
}

export const minsToHours = (mins: number): number => Math.floor(mins / 60);

export const minsToStringHoursDays = (mins: number = 0): string => {
    if (mins === 0)
        return "0 h";

    const days = Math.floor(mins / MINS_IN_DAY);

    return days === 0
        ? minsToStringHours(mins)
        : minsToStringDays(mins);
}

interface Param {

    name: string;

    value?: number | string | boolean;
}

const buildUrl = (url: string, query: string, param?: string | number | boolean): string => {
    return param === undefined
        ? url
        : url.concat(`${url.includes("?") ? "&" : "?"}${query}=${param}`);
}

export const buildUrlWithParams = (url: string, params: Param[]): string => {
    return params.reduce((acc, curr) => buildUrl(acc, curr.name, curr.value), url);
}

export const buildPlural = (text: string, value?: number, prefix = true, displayValue = true): string => {
    const num = value ?? 0;
    const plural = `${text}${num > 1 ? "s" : ""}`;

    return displayValue
        ? prefix ? `${num} ${plural}` : `${plural} ${num}`
        : plural;
}

export const buildHexColor = (): string => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

export const withoutAccentsIgnoreCase = (value: string): string => {
    return value.trim().toLocaleLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}