const JWT = "jwt";

const DISPLAY_CHART = "displayChart";

const deleteJwt = (): void => localStorage.removeItem(JWT);

const getJwt = (): string | null => localStorage.getItem(JWT) ?? "";

const storeJwt = (token: string): void => localStorage.setItem(JWT, token);

const storeDisplayChart = (value: boolean): void => localStorage.setItem(DISPLAY_CHART, `${value}`);

const getDisplayChart = (): boolean => localStorage.getItem(DISPLAY_CHART) === "true";

export default {
    deleteJwt,
    getDisplayChart,
    getJwt, 
    storeDisplayChart,
    storeJwt
}