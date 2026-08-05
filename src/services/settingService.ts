import httpClient from "./httpClient";

const PREFIX = "settings";

const exportData = (): Promise<Response> => httpClient.get(`${PREFIX}/export-data`);

export default {
    exportData
}
