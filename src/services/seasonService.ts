import httpClient from "./httpClient";

const PREFIX = "seasons";

const deleteSeasonById = (id: number): Promise<Response> => httpClient.delete(`${PREFIX}/${id}`);

const updateSeason = (id: number, platformId: number, viewedAt: string): Promise<Response> =>
    httpClient.patch(`${PREFIX}/${id}`, { platform: platformId, viewedAt });

const getEpisodesBySeasonId = (id: number): Promise<Response> => httpClient.get(`${PREFIX}/${id}/episodes`);

const addEpisodeViewing = (id: number, episodeId: number): Promise<Response> =>
    httpClient.post(`${PREFIX}/${id}/episodes/${episodeId}`);

const addAllEpisodesViewing = (id: number): Promise<Response> => httpClient.post(`${PREFIX}/${id}/episodes`);

const updateWatchedWith = (id: number, friendIds: string[]): Promise<Response> =>
    httpClient.patch(`${PREFIX}/${id}/watched-with`, { friendIds });

const getWatchedWith = (status: "pending" | "active"): Promise<Response> =>
    httpClient.get(`${PREFIX}/watched-with`, [{ name: "status", value: status }]);

const respondToWatchedWith = (userSeasonId: number, accepted: boolean): Promise<Response> =>
    httpClient.patch(`${PREFIX}/${userSeasonId}/watched-with/response`, { accepted });

export default {
    addAllEpisodesViewing,
    addEpisodeViewing,
    deleteSeasonById,
    getEpisodesBySeasonId,
    getWatchedWith,
    respondToWatchedWith,
    updateSeason,
    updateWatchedWith
}
