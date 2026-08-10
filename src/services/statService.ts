import httpClient from "./httpClient";

const PREFIX = "stats";

const getStats = (userId?: string): Promise<Response> =>
    httpClient.get(PREFIX, [{ name: "id", value: userId }]);

export default {
    getStats
};
