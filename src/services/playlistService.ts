import httpClient from "./httpClient";

const PREFIX = "playlists";

const getPlaylists = (friendId?: string): Promise<Response> =>
    httpClient.get(PREFIX, [{ name: "friendId", value: friendId }]);

const getPlaylist = (id: string): Promise<Response> => httpClient.get(`${PREFIX}/${id}`);

const createPlaylist = (name: string, visible: boolean): Promise<Response> =>
    httpClient.post(PREFIX, { name, visible });

const updatePlaylist = (id: string, fields: { name?: string; visible?: boolean }): Promise<Response> =>
    httpClient.patch(`${PREFIX}/${id}`, fields);

const deletePlaylist = (id: string): Promise<Response> => httpClient.delete(`${PREFIX}/${id}`);

const addShowToPlaylist = (id: string, showId: number): Promise<Response> =>
    httpClient.post(`${PREFIX}/${id}/shows`, { showId });

const removeShowFromPlaylist = (id: string, showId: number): Promise<Response> =>
    httpClient.delete(`${PREFIX}/${id}/shows/${showId}`);

const getCollaborators = (id: string): Promise<Response> => httpClient.get(`${PREFIX}/${id}/collaborators`);

const inviteCollaborator = (id: string, userId: string): Promise<Response> =>
    httpClient.post(`${PREFIX}/${id}/collaborators`, { userId });

const acceptCollaboratorInvite = (id: string): Promise<Response> =>
    httpClient.patch(`${PREFIX}/${id}/collaborators/accept`);

const removeCollaborator = (id: string, userId: string): Promise<Response> =>
    httpClient.delete(`${PREFIX}/${id}/collaborators/${userId}`);

export default {
    getPlaylists,
    getPlaylist,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addShowToPlaylist,
    removeShowFromPlaylist,
    getCollaborators,
    inviteCollaborator,
    acceptCollaboratorInvite,
    removeCollaborator,
}
