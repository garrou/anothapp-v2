import httpClient from "./httpClient";

const PREFIX = "seasons";

const deleteSeasonById = (id: number): Promise<Response> => httpClient.delete(`${PREFIX}/${id}`);

const updateSeason = (id: number, platformId: number, viewedAt: string): Promise<Response> =>
    httpClient.patch(`${PREFIX}/${id}`, { platform: platformId, viewedAt });

const getSeasons = (year?: number, month?: number): Promise<Response> =>
    httpClient.get(PREFIX, [{ name: year ? "year" : "month", value: year ?? month }]);

const getEpisodesBySeasonId = (id: number): Promise<Response> => httpClient.get(`${PREFIX}/${id}/episodes`);

const addEpisodeViewing = (id: number, episodeId: number): Promise<Response> =>
    httpClient.post(`${PREFIX}/${id}/episodes/${episodeId}`);

const addAllEpisodesViewing = (id: number): Promise<Response> => httpClient.post(`${PREFIX}/${id}/episodes`);

export default {
    addAllEpisodesViewing,
    addEpisodeViewing,
    deleteSeasonById,
    getEpisodesBySeasonId,
    getSeasons,
    updateSeason
}
