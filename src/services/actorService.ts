import httpClient from "./httpClient";

const PREFIX = "actors";

const getFavorites = (friendId?: string): Promise<Response> =>
    httpClient.get(`${PREFIX}/favorites`, [{ name: "friendId", value: friendId }]);

const addFavorite = (id: number): Promise<Response> => httpClient.post(`${PREFIX}/${id}/favorite`);

const removeFavorite = (id: number): Promise<Response> => httpClient.delete(`${PREFIX}/${id}/favorite`);

export default {
    addFavorite,
    getFavorites,
    removeFavorite
}
