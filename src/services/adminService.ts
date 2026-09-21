import httpClient from "./httpClient";

const PREFIX = "admin";

const getDashboard = (): Promise<Response> => httpClient.get(`${PREFIX}/dashboard`);

const searchUsers = (query: string): Promise<Response> =>
    httpClient.get(`${PREFIX}/users`, [{ name: "query", value: query }]);

const revokeUserSessions = (userId: string): Promise<Response> =>
    httpClient.post(`${PREFIX}/users/${userId}/revoke-sessions`);

export default {
    getDashboard,
    searchUsers,
    revokeUserSessions,
};
