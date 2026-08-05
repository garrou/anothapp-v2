import httpClient from "./httpClient";

const PREFIX = "search";

const getActor = (id: number): Promise<Response> => httpClient.get(`${PREFIX}/persons/${id}`);

const getCharacters = (id: number): Promise<Response> => httpClient.get(`${PREFIX}/shows/${id}/characters`);

const getKinds = (): Promise<Response> => httpClient.get(`${PREFIX}/kinds`);

const getNotes = (): Promise<Response> => httpClient.get(`${PREFIX}/notes`);

const getPlatforms = (): Promise<Response> => httpClient.get(`${PREFIX}/platforms`);

const getSerie = (id: number): Promise<Response> => httpClient.get(`${PREFIX}/shows/${id}`);

const getSerieImages = (id: number): Promise<Response> => httpClient.get(`${PREFIX}/shows/${id}/images`);

const getSeries = (title?: string, kinds?: string, platforms?: string, limit?: number, year?: number): Promise<Response> =>
    httpClient.get(`${PREFIX}/shows`, [
        { name: "title", value: title },
        { name: "kinds", value: kinds },
        { name: "platforms", value: platforms },
        { name: "limit", value: limit },
        { name: "year", value: year }
    ]);

const getSeasonsBySerieId = (id: number): Promise<Response> => httpClient.get(`${PREFIX}/shows/${id}/seasons`);

const getSimilarsSeries = (id: number): Promise<Response> => httpClient.get(`${PREFIX}/shows/${id}/similars`);

const getImages = (limit: number): Promise<Response> =>
    httpClient.get(`${PREFIX}/images`, [{ name: "limit", value: limit }]);

const getEpisodesBySerieIdBySeason = (id: number, season: number): Promise<Response> =>
    httpClient.get(`${PREFIX}/shows/${id}/seasons/${season}/episodes`);

export default {
    getActor,
    getCharacters,
    getEpisodesBySerieIdBySeason,
    getImages,
    getKinds,
    getNotes,
    getPlatforms,
    getSeasonsBySerieId,
    getSerie,
    getSerieImages,
    getSeries,
    getSimilarsSeries,
}
