const DISPLAY_CHART = "displayChart";

const THEME = "theme";

const getColorChart = (id: string): string | null => localStorage.getItem(id);

const saveColorChart = (id: string, color: string) => localStorage.setItem(id, color);

const storeDisplayChart = (value: boolean): void => localStorage.setItem(DISPLAY_CHART, `${value}`);

const getDisplayChart = (): boolean => localStorage.getItem(DISPLAY_CHART) === "true";

const getTheme = (): string | null => localStorage.getItem(THEME);

const storeTheme = (value: string): void => localStorage.setItem(THEME, value);

export default {
    getColorChart,
    getDisplayChart,
    getTheme,
    saveColorChart,
    storeDisplayChart,
    storeTheme,
}