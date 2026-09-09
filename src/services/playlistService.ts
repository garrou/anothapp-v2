import httpClient from "./httpClient";

const PREFIX = "playlists";

const getPlaylists = (friendId?: string): Promise<Response> =>
    httpClient.get(PREFIX, [{ name: "friendId", value: friendId }]);

const getPlaylist = (id: number): Promise<Response> => httpClient.get(`${PREFIX}/${id}`);

const createPlaylist = (name: string, visible: boolean): Promise<Response> =>
    httpClient.post(PREFIX, { name, visible });

const updatePlaylist = (id: number, fields: { name?: string; visible?: boolean }): Promise<Response> =>
    httpClient.patch(`${PREFIX}/${id}`, fields);

const deletePlaylist = (id: number): Promise<Response> => httpClient.delete(`${PREFIX}/${id}`);

const addShowToPlaylist = (id: number, showId: number): Promise<Response> =>
    httpClient.post(`${PREFIX}/${id}/shows`, { showId });

const removeShowFromPlaylist = (id: number, showId: number): Promise<Response> =>
    httpClient.delete(`${PREFIX}/${id}/shows/${showId}`);

export default {
    getPlaylists,
    getPlaylist,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addShowToPlaylist,
    removeShowFromPlaylist,
}
