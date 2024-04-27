const DISPLAY_CHART = "displayChart";
const JWT = "jwt";

const deleteJwt = (): void => localStorage.removeItem(JWT);

const getColorChart = (id: string, defaultColor: string): string => localStorage.getItem(id) ?? defaultColor;

const getJwt = (): string | null => localStorage.getItem(JWT) ?? "";

const saveColorChart = (id: string, color: string) => localStorage.setItem(id, color);

const storeJwt = (token: string): void => localStorage.setItem(JWT, token);

const storeDisplayChart = (value: boolean): void => localStorage.setItem(DISPLAY_CHART, `${value}`);

const getDisplayChart = (): boolean => localStorage.getItem(DISPLAY_CHART) === "true";

export default {
    deleteJwt,
    getColorChart,
    getDisplayChart,
    getJwt, 
    saveColorChart,
    storeDisplayChart,
    storeJwt
}