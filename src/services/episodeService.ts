import httpClient from "./httpClient";

const PREFIX = "episodes";

const getViewedByMonthAgo = (month: number): Promise<Response> =>
    httpClient.get(PREFIX, [{ name: "month", value: month }]);

const updateViewing = (id: number, watchedAt: string): Promise<Response> =>
    httpClient.patch(`${PREFIX}/${id}`, { watchedAt });

const deleteViewing = (id: number): Promise<Response> => httpClient.delete(`${PREFIX}/${id}`);

export default {
    getViewedByMonthAgo,
    updateViewing,
    deleteViewing
}
