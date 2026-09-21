import httpClient from "./httpClient";

const PREFIX = "users";

const getUsers = (username: string): Promise<Response> =>
    httpClient.get(PREFIX, [{ name: "username", value: username }]);

const getProfile = (): Promise<Response> => httpClient.get(`${PREFIX}/profile`);

const updateImage = (image: string): Promise<Response> =>
    httpClient.patch(`${PREFIX}/me`, { image });

const updateLogin = (newEmail: string, confirmEmail: string, currentPassword: string): Promise<Response> =>
    httpClient.patch(`${PREFIX}/me`, { newEmail, confirmEmail, currentPassword });

const updatePassword = (currentPassword: string, newPassword: string, confirmPassword: string): Promise<Response> =>
    httpClient.patch(`${PREFIX}/me`, { currentPassword, newPassword, confirmPassword });

const requestDeletion = (password: string): Promise<Response> =>
    httpClient.delete(`${PREFIX}/me`, { password });

export default {
    getUsers,
    getProfile,
    updateImage,
    updateLogin,
    updatePassword,
    requestDeletion
};
