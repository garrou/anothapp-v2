import httpClient from "./httpClient";

const PREFIX = "settings";

const exportData = (): Promise<Response> => httpClient.get(`${PREFIX}/export-data`);

const importData = (payload: unknown): Promise<Response> => httpClient.post(`${PREFIX}/import-data`, payload);

export default {
    exportData,
    importData
}
