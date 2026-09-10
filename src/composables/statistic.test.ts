import { describe, it, expect, vi, beforeEach } from "vitest";
import { useStatistic } from "./statistic";

const statServiceMocks = vi.hoisted(() => ({
    getStats: vi.fn(),
    getWrapped: vi.fn(),
    getLeaderboard: vi.fn(),
}));

vi.mock("@/services/statService", () => ({
    default: statServiceMocks,
}));

const jsonResponse = (status: number, body: unknown) => ({
    status,
    json: async () => body,
});

describe("useStatistic.getStats", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("passes the userId through and returns the stats on success", async () => {
        const stats = { episodesHeatmap: [] };
        statServiceMocks.getStats.mockResolvedValue(jsonResponse(200, stats));

        const result = await useStatistic().getStats("friend-1");

        expect(result).toEqual(stats);
        expect(statServiceMocks.getStats).toHaveBeenCalledWith("friend-1");
    });

    it("throws the server's message on failure", async () => {
        statServiceMocks.getStats.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useStatistic().getStats()).rejects.toThrow("Requête invalide");
    });
});

describe("useStatistic.getWrapped", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("returns the wrapped stats on success", async () => {
        const wrapped = { year: 2025 };
        statServiceMocks.getWrapped.mockResolvedValue(jsonResponse(200, wrapped));

        const result = await useStatistic().getWrapped(2025);

        expect(result).toEqual(wrapped);
        expect(statServiceMocks.getWrapped).toHaveBeenCalledWith(2025);
    });

    it("throws the server's message on failure", async () => {
        statServiceMocks.getWrapped.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useStatistic().getWrapped(2025)).rejects.toThrow("Requête invalide");
    });
});

describe("useStatistic.getLeaderboard", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("returns the leaderboard on success", async () => {
        const leaderboard = [{ id: "user-1", username: "garrou" }];
        statServiceMocks.getLeaderboard.mockResolvedValue(jsonResponse(200, leaderboard));

        const result = await useStatistic().getLeaderboard();

        expect(result).toEqual(leaderboard);
    });

    it("throws the server's message on failure", async () => {
        statServiceMocks.getLeaderboard.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useStatistic().getLeaderboard()).rejects.toThrow("Requête invalide");
    });
});
