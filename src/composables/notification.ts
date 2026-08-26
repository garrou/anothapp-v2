import notificationService from "@/services/notificationService";
import { isError } from "@/utils/response";
import type { NotificationsResponse } from "@/models/notification";

export function useNotification() {

    const getNotifications = async (): Promise<NotificationsResponse> => {
        const resp = await notificationService.getNotifications();
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const markAsRead = async (id: number): Promise<void> => {
        const resp = await notificationService.markAsRead(id);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
    }

    const markAllAsRead = async (): Promise<void> => {
        const resp = await notificationService.markAllAsRead();

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
    }

    return {
        getNotifications,
        markAllAsRead,
        markAsRead,
    }
}
