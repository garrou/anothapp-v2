import httpClient from "./httpClient";

const PREFIX = "notifications";

const getNotifications = (): Promise<Response> => httpClient.get(PREFIX);

const markAsRead = (id: number): Promise<Response> => httpClient.patch(`${PREFIX}/${id}/read`);

const markAllAsRead = (): Promise<Response> => httpClient.patch(`${PREFIX}/read`);

export default {
    getNotifications,
    markAllAsRead,
    markAsRead,
}
