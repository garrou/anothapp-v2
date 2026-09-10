import { describe, it, expect, vi, beforeEach } from "vitest";
import { useNotification } from "./notification";

const notificationServiceMocks = vi.hoisted(() => ({
    getNotifications: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
}));

vi.mock("@/services/notificationService", () => ({
    default: notificationServiceMocks,
}));

const jsonResponse = (status: number, body: unknown) => ({
    status,
    json: async () => body,
});

describe("useNotification.getNotifications", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("returns the notifications on success", () => {
        const data = { notifications: [{ id: 1, type: "friend_request" }] };
        notificationServiceMocks.getNotifications.mockResolvedValue(jsonResponse(200, data));

        return expect(useNotification().getNotifications()).resolves.toEqual(data);
    });

    it("throws the server's message on failure", async () => {
        notificationServiceMocks.getNotifications.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useNotification().getNotifications()).rejects.toThrow("Requête invalide");
    });
});

describe("useNotification.markAsRead", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("resolves on success", async () => {
        notificationServiceMocks.markAsRead.mockResolvedValue(jsonResponse(200, null));

        await expect(useNotification().markAsRead(1)).resolves.toBeUndefined();
        expect(notificationServiceMocks.markAsRead).toHaveBeenCalledWith(1);
    });

    it("throws the server's message on failure", async () => {
        notificationServiceMocks.markAsRead.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useNotification().markAsRead(1)).rejects.toThrow("Requête invalide");
    });
});

describe("useNotification.markAllAsRead", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("resolves on success", async () => {
        notificationServiceMocks.markAllAsRead.mockResolvedValue(jsonResponse(200, null));

        await expect(useNotification().markAllAsRead()).resolves.toBeUndefined();
    });

    it("throws the server's message on failure", async () => {
        notificationServiceMocks.markAllAsRead.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useNotification().markAllAsRead()).rejects.toThrow("Requête invalide");
    });
});
