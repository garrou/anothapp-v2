import httpClient from "./httpClient";

const PREFIX = "episodes";

const watchEpisode = (id: number): Promise<Response> => httpClient.post(`${PREFIX}/${id}/watch`);

const unwatchEpisode = (id: number): Promise<Response> => httpClient.delete(`${PREFIX}/${id}/watch`);

export default {
    watchEpisode,
    unwatchEpisode
}
