import httpClient from "./httpClient";

const PREFIX = "platforms";

const getUserPlatforms = (): Promise<Response> => httpClient.get(PREFIX);

const getFriendPlatforms = (friendId: string): Promise<Response> =>
    httpClient.get(PREFIX, [{ name: "friendId", value: friendId }]);

const updateUserPlatforms = (platformId: number): Promise<Response> =>
    httpClient.post(PREFIX, { platformId });

const deleteUserPlatform = (platformId: number): Promise<Response> =>
    httpClient.delete(`${PREFIX}/${platformId}`);

export default {
    deleteUserPlatform,
    getFriendPlatforms,
    getUserPlatforms,
    updateUserPlatforms,
}
