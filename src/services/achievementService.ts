import httpClient from "./httpClient";

const PREFIX = "achievements";

const getAchievements = (userId?: string): Promise<Response> =>
    httpClient.get(PREFIX, [{ name: "id", value: userId }]);

export default {
    getAchievements
};
