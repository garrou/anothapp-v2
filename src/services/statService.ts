import httpClient from "./httpClient";

const PREFIX = "stats";

const getStats = (userId?: string): Promise<Response> =>
    httpClient.get(PREFIX, [{ name: "id", value: userId }]);

const getWrapped = (year: number): Promise<Response> =>
    httpClient.get(`${PREFIX}/wrapped`, [{ name: "year", value: year }]);

export default {
    getStats,
    getWrapped
};
