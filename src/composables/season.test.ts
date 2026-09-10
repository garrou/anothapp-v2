import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSeason } from "./season";

const seasonServiceMocks = vi.hoisted(() => ({
    deleteSeasonById: vi.fn(),
    getSeasons: vi.fn(),
    updateSeason: vi.fn(),
    updateWatchedWith: vi.fn(),
}));
const serieServiceMocks = vi.hoisted(() => ({
    getSeasonsBySerieId: vi.fn(),
    getSeasonInfosBySerieIdByNumber: vi.fn(),
    getSeasonWatchedTime: vi.fn(),
    addSeason: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showInfo: vi.fn(),
}));

vi.mock("@/services/seasonService", () => ({
    default: seasonServiceMocks,
}));
vi.mock("@/services/serieService", () => ({
    default: serieServiceMocks,
}));
vi.mock("./snackbar", () => ({
    useSnackbar: () => snackbarMocks,
}));

const jsonResponse = (status: number, body: unknown) => ({
    status,
    json: async () => body,
});

describe("useSeason.deleteSeason", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("shows a success toast on success", async () => {
        seasonServiceMocks.deleteSeasonById.mockResolvedValue(jsonResponse(204, null));

        await useSeason().deleteSeason(1);

        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Visionnage supprimé");
    });

    it("throws on failure without showing a success toast", async () => {
        seasonServiceMocks.deleteSeasonById.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useSeason().deleteSeason(1)).rejects.toThrow("Requête invalide");
    });
});

describe("useSeason.getSeasonsBySerieId", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("rejects locally without calling the service when serieId is missing", async () => {
        await expect(useSeason().getSeasonsBySerieId({})).rejects.toThrow("Impossible de récupérer les données");
        expect(serieServiceMocks.getSeasonsBySerieId).not.toHaveBeenCalled();
    });

    it("returns the seasons on success", async () => {
        const seasons = [{ number: 1 }];
        serieServiceMocks.getSeasonsBySerieId.mockResolvedValue(jsonResponse(200, seasons));

        const result = await useSeason().getSeasonsBySerieId({ serieId: 1 });

        expect(result).toEqual(seasons);
        expect(serieServiceMocks.getSeasonsBySerieId).toHaveBeenCalledWith(1);
    });

    it("throws the server's message on failure", async () => {
        serieServiceMocks.getSeasonsBySerieId.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useSeason().getSeasonsBySerieId({ serieId: 1 })).rejects.toThrow("Requête invalide");
    });
});

describe("useSeason.addSeason", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("shows a success toast naming the serie and season", async () => {
        serieServiceMocks.addSeason.mockResolvedValue(jsonResponse(201, null));

        await useSeason().addSeason({ id: 1, title: "Breaking Bad" } as any, { number: 2 } as any);

        expect(serieServiceMocks.addSeason).toHaveBeenCalledWith(1, 2);
        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith('"Breaking Bad" saison 2 ajoutée');
    });

    it("throws on failure without showing a success toast", async () => {
        serieServiceMocks.addSeason.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(
            useSeason().addSeason({ id: 1, title: "Breaking Bad" } as any, { number: 2 } as any)
        ).rejects.toThrow("Requête invalide");
    });
});

describe("useSeason.updateSeason", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("rejects locally without calling the service when platformId or viewedAt is missing", async () => {
        await expect(useSeason().updateSeason(1)).rejects.toThrow("Impossible de modifier la saison");
        expect(seasonServiceMocks.updateSeason).not.toHaveBeenCalled();
    });

    it("converts the datetime-local value to ISO before calling the service", async () => {
        seasonServiceMocks.updateSeason.mockResolvedValue(jsonResponse(200, null));

        const result = await useSeason().updateSeason(1, 2, "2025-01-01T12:00");

        expect(result).toBe(true);
        expect(seasonServiceMocks.updateSeason).toHaveBeenCalledWith(1, 2, new Date("2025-01-01T12:00").toISOString());
        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Saison modifiée");
    });

    it("throws on failure without showing a success toast", async () => {
        seasonServiceMocks.updateSeason.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useSeason().updateSeason(1, 2, "2025-01-01T12:00")).rejects.toThrow("Requête invalide");
    });
});

describe("useSeason.updateWatchedWith", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("resolves without a success toast", async () => {
        seasonServiceMocks.updateWatchedWith.mockResolvedValue(jsonResponse(200, null));

        await expect(useSeason().updateWatchedWith(1, ["friend-1"])).resolves.toBeUndefined();
        expect(seasonServiceMocks.updateWatchedWith).toHaveBeenCalledWith(1, ["friend-1"]);
    });

    it("throws the server's message on failure", async () => {
        seasonServiceMocks.updateWatchedWith.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useSeason().updateWatchedWith(1, ["friend-1"])).rejects.toThrow("Requête invalide");
    });
});

describe("useSeason.getSeasonsTimeline / getSeasonInfosBySerieIdByNumber / getSeasonWatchedTime", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("getSeasonsTimeline returns the timeline on success", async () => {
        const timeline = [{ month: "2025-01" }];
        seasonServiceMocks.getSeasons.mockResolvedValue(jsonResponse(200, timeline));

        const result = await useSeason().getSeasonsTimeline(3);

        expect(result).toEqual(timeline);
        expect(seasonServiceMocks.getSeasons).toHaveBeenCalledWith(undefined, 3);
    });

    it("getSeasonInfosBySerieIdByNumber returns the details on success", async () => {
        const details = [{ number: 1 }];
        serieServiceMocks.getSeasonInfosBySerieIdByNumber.mockResolvedValue(jsonResponse(200, details));

        const result = await useSeason().getSeasonInfosBySerieIdByNumber(1, 1);

        expect(result).toEqual(details);
    });

    it("getSeasonWatchedTime returns the time on success", async () => {
        serieServiceMocks.getSeasonWatchedTime.mockResolvedValue(jsonResponse(200, { time: 120 }));

        const result = await useSeason().getSeasonWatchedTime(1, 1);

        expect(result).toBe(120);
    });
});
