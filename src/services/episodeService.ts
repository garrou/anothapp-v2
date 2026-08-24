import httpClient from "./httpClient";

const PREFIX = "episodes";

const updateViewing = (id: number, watchedAt: string): Promise<Response> =>
    httpClient.patch(`${PREFIX}/${id}`, { watchedAt });

const deleteViewing = (id: number): Promise<Response> => httpClient.delete(`${PREFIX}/${id}`);

export default {
    updateViewing,
    deleteViewing
}
