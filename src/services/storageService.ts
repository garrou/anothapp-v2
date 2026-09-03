const DISPLAY_CHART = "displayChart";

const THEME = "theme";

const REFERENCE_DATA_TTL_MS = 31 * 24 * 60 * 60 * 1000;

const getCachedList = <T>(key: string): T[] | null => {
    try {
        const raw = localStorage.getItem(key);

        if (!raw) return null;
        const { data, expires } = JSON.parse(raw);

        return Array.isArray(data) && Date.now() < expires ? data : null;
    } catch {
        return null;
    }
}

const storeCachedList = <T>(key: string, data: T[]): void => {
    try {
        localStorage.setItem(key, JSON.stringify({ data, expires: Date.now() + REFERENCE_DATA_TTL_MS }));
    } catch {
        // storage unavailable or full - nothing persists, the next load just refetches
    }
}

const getColorChart = (id: string): string | null => localStorage.getItem(id);

const saveColorChart = (id: string, color: string) => localStorage.setItem(id, color);

const storeDisplayChart = (value: boolean): void => localStorage.setItem(DISPLAY_CHART, `${value}`);

const getDisplayChart = (): boolean => localStorage.getItem(DISPLAY_CHART) === "true";

const getTheme = (): string | null => localStorage.getItem(THEME);

const storeTheme = (value: string): void => localStorage.setItem(THEME, value);

export default {
    getCachedList,
    getColorChart,
    getDisplayChart,
    getTheme,
    saveColorChart,
    storeCachedList,
    storeDisplayChart,
    storeTheme,
}