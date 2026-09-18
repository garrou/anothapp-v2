import httpClient from "./httpClient";

const PREFIX = "auth";

const checkAuth = (): Promise<Response> => httpClient.get(`${PREFIX}/me`);

const login = (identifier: string, password: string): Promise<Response> =>
    httpClient.post(`${PREFIX}/login`, { identifier, password });

const logout = () => httpClient.post(`${PREFIX}/logout`, undefined, { skipRefresh: true });

const register = (email: string, password: string, confirm: string, username: string): Promise<Response> =>
    httpClient.post(`${PREFIX}/register`, { email, confirm, username, password });

const cancelDeletion = (cancellationToken: string): Promise<Response> =>
    httpClient.post(`${PREFIX}/cancel-deletion`, { cancellationToken });

const verifyEmail = (token: string): Promise<Response> =>
    httpClient.post(`${PREFIX}/verify-email`, { token });

const resendVerification = (identifier: string): Promise<Response> =>
    httpClient.post(`${PREFIX}/resend-verification`, { identifier });

const forgotPassword = (email: string): Promise<Response> =>
    httpClient.post(`${PREFIX}/forgot-password`, { email });

const resetPassword = (token: string, password: string, confirm: string): Promise<Response> =>
    httpClient.post(`${PREFIX}/reset-password`, { token, password, confirm });

export default {
    checkAuth,
    login,
    logout,
    register,
    cancelDeletion,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
}
