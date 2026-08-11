import httpClient from "./httpClient";

const PREFIX = "auth";

const checkAuth = (): Promise<Response> => httpClient.get(`${PREFIX}/me`);

const login = (identifier: string, password: string): Promise<Response> =>
    httpClient.post(`${PREFIX}/login`, { identifier, password });

const logout = () => httpClient.post(`${PREFIX}/logout`, undefined, { skipRefresh: true });

const register = (email: string, password: string, confirm: string, username: string): Promise<Response> =>
    httpClient.post(`${PREFIX}/register`, { email, confirm, username, password });

export default {
    checkAuth,
    login,
    logout,
    register,
}
