const DISPLAY_CHART = "displayChart";

const getColorChart = (id: string): string | null => localStorage.getItem(id);

const saveColorChart = (id: string, color: string) => localStorage.setItem(id, color);

const storeDisplayChart = (value: boolean): void => localStorage.setItem(DISPLAY_CHART, `${value}`);

const getDisplayChart = (): boolean => localStorage.getItem(DISPLAY_CHART) === "true";

export default {
    getColorChart,
    getDisplayChart,
    saveColorChart,
    storeDisplayChart,
}