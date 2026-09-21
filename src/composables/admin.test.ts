import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAdmin } from "./admin";

const adminServiceMocks = vi.hoisted(() => ({
    getDashboard: vi.fn(),
    searchUsers: vi.fn(),
    revokeUserSessions: vi.fn(),
}));

vi.mock("@/services/adminService", () => ({
    default: adminServiceMocks,
}));

const jsonResponse = (status: number, body: unknown) => ({
    status,
    json: async () => body,
});

describe("useAdmin.getDashboard", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("returns the dashboard on success", async () => {
        const dashboard = { userCount: 3 };
        adminServiceMocks.getDashboard.mockResolvedValue(jsonResponse(200, dashboard));

        const result = await useAdmin().getDashboard();

        expect(result).toEqual(dashboard);
    });

    it("throws the server's message on failure", async () => {
        adminServiceMocks.getDashboard.mockResolvedValue(jsonResponse(403, { message: "Accès refusé" }));

        await expect(useAdmin().getDashboard()).rejects.toThrow("Accès refusé");
    });
});

describe("useAdmin.searchUsers", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("passes the query through and returns the matches", async () => {
        const users = [{ id: "user-1", username: "bob", email: "bob@test.fr" }];
        adminServiceMocks.searchUsers.mockResolvedValue(jsonResponse(200, users));

        const result = await useAdmin().searchUsers("bob");

        expect(result).toEqual(users);
        expect(adminServiceMocks.searchUsers).toHaveBeenCalledWith("bob");
    });

    it("throws the server's message on failure", async () => {
        adminServiceMocks.searchUsers.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useAdmin().searchUsers("bob")).rejects.toThrow("Requête invalide");
    });
});

describe("useAdmin.revokeUserSessions", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("returns the revoked count on success", async () => {
        adminServiceMocks.revokeUserSessions.mockResolvedValue(jsonResponse(200, { revokedCount: 2 }));

        const result = await useAdmin().revokeUserSessions("user-1");

        expect(result).toBe(2);
        expect(adminServiceMocks.revokeUserSessions).toHaveBeenCalledWith("user-1");
    });

    it("throws the server's message on failure", async () => {
        adminServiceMocks.revokeUserSessions.mockResolvedValue(jsonResponse(404, { message: "Utilisateur inconnu" }));

        await expect(useAdmin().revokeUserSessions("user-1")).rejects.toThrow("Utilisateur inconnu");
    });
});
