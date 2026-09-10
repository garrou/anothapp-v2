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

const storeCachedList = <T>(key: string, data: T[], ttlMs: number = REFERENCE_DATA_TTL_MS): void => {
    try {
        localStorage.setItem(key, JSON.stringify({ data, expires: Date.now() + ttlMs }));
    } catch {
    }
}

const clearCachedList = (key: string): void => {
    try {
        localStorage.removeItem(key);
    } catch {
    }
}

const getColorChart = (id: string): string | null => localStorage.getItem(id);

const saveColorChart = (id: string, color: string) => localStorage.setItem(id, color);

const getTheme = (): string | null => localStorage.getItem(THEME);

const storeTheme = (value: string): void => localStorage.setItem(THEME, value);

export default {
    clearCachedList,
    getCachedList,
    getColorChart,
    getTheme,
    saveColorChart,
    storeCachedList,
    storeTheme,
}