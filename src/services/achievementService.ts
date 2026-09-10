import httpClient from "./httpClient";

const PREFIX = "achievements";

const getAchievements = (): Promise<Response> => httpClient.get(PREFIX);

export default {
    getAchievements
};
