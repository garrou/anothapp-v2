import httpClient from "./httpClient";

const PREFIX = "friends";

const getFriends = (status?: string, serieId?: number): Promise<Response> =>
    httpClient.get(PREFIX, [
        { name: "status", value: status },
        { name: "serieId", value: serieId }
    ]);

const acceptFriendRequest = (userId: string): Promise<Response> =>
    httpClient.patch(`${PREFIX}/${userId}`, { userId });

const sendFriendRequest = (userId: string): Promise<Response> =>
    httpClient.post(PREFIX, { userId });

const deleteFriend = (userId: string): Promise<Response> =>
    httpClient.delete(`${PREFIX}/${userId}`);

const getFriendProfile = (userId: string): Promise<Response> =>
    httpClient.get(`${PREFIX}/${userId}`);

export default {
    acceptFriendRequest,
    deleteFriend,
    getFriendProfile,
    getFriends,
    sendFriendRequest
}
