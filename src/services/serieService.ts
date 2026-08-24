import httpClient from "./httpClient";
import type { SerieStatus } from "@/types/types";

const PREFIX = "shows";

const addSeason = (id: number, num: number): Promise<Response> =>
    httpClient.post(`${PREFIX}/${id}/seasons`, { id, num });

const addSerie = (id: number, inList: boolean): Promise<Response> =>
    httpClient.post(PREFIX, { id, list: inList });

const deleteSerie = (id: number, list = false): Promise<Response> =>
    httpClient.delete(`${PREFIX}/${id}`, [{ name: "list", value: list }]);

const getSeasonsBySerieId = (id: number): Promise<Response> => httpClient.get(`${PREFIX}/${id}/seasons`);

const getSeasonInfosBySerieIdByNumber = (id: number, num: number): Promise<Response> =>
    httpClient.get(`${PREFIX}/${id}/seasons/${num}`);

const getSerie = (id: number): Promise<Response> => httpClient.get(`${PREFIX}/${id}`);

const getSeries = (title?: string, platforms?: string, kinds?: string, notes?: string): Promise<Response> =>
    httpClient.get(PREFIX, [
        { name: "title", value: title },
        { name: "platforms", value: platforms },
        { name: "kinds", value: kinds },
        { name: "notes", value: notes }
    ]);

const getSeriesByStatus = (status: SerieStatus, friendId?: string): Promise<Response> =>
    httpClient.get(PREFIX, [
        { name: "status", value: status },
        { name: "friendId", value: friendId }
    ]);

const updateFieldBySerieId = (id: number, field: string, value: string | number): Promise<Response> =>
    httpClient.patch(`${PREFIX}/${id}`, { [field]: value });

export default {
    addSeason,
    addSerie,
    deleteSerie,
    getSeasonsBySerieId,
    getSeasonInfosBySerieIdByNumber,
    getSerie,
    getSeries,
    getSeriesByStatus,
    updateFieldBySerieId
}
