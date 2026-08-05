import httpClient from "./httpClient";

const PREFIX = "seasons";

const deleteSeasonById = (id: number): Promise<Response> => httpClient.delete(`${PREFIX}/${id}`);

const updateSeason = (id: number, platformId: number, viewedAt: string): Promise<Response> =>
    httpClient.patch(`${PREFIX}/${id}`, { platform: platformId, viewedAt });

const getSeasons = (year?: number, month?: number): Promise<Response> =>
    httpClient.get(PREFIX, [{ name: year ? "year" : "month", value: year ?? month }]);

export default {
    deleteSeasonById,
    getSeasons,
    updateSeason
}
