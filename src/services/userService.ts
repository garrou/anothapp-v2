import httpClient from "./httpClient";

const PREFIX = "users";

const getUsers = (username: string): Promise<Response> =>
    httpClient.get(PREFIX, [{ name: "username", value: username }]);

const getProfile = (): Promise<Response> => httpClient.get(`${PREFIX}/profile`);

const updateImage = (image: string): Promise<Response> =>
    httpClient.patch(`${PREFIX}/me`, { image });

const updateLogin = (email: string, newEmail: string): Promise<Response> =>
    httpClient.patch(`${PREFIX}/me`, { email, newEmail });

const updatePassword = (currentPassword: string, newPassword: string, confirmPassword: string): Promise<Response> =>
    httpClient.patch(`${PREFIX}/me`, { currentPassword, newPassword, confirmPassword });

const updateEpisodeTracking = (episodeTrackingEnabled: boolean): Promise<Response> =>
    httpClient.patch(`${PREFIX}/me`, { episodeTrackingEnabled });

export default {
    getUsers,
    getProfile,
    updateEpisodeTracking,
    updateImage,
    updateLogin,
    updatePassword
};
