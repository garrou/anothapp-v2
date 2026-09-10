import { describe, it, expect, vi, beforeEach } from "vitest";
import { useEpisode } from "./episode";

const episodeServiceMocks = vi.hoisted(() => ({
    getViewedByMonthAgo: vi.fn(),
    updateViewing: vi.fn(),
    deleteViewing: vi.fn(),
}));
const seasonServiceMocks = vi.hoisted(() => ({
    getEpisodesBySeasonId: vi.fn(),
    addEpisodeViewing: vi.fn(),
    addAllEpisodesViewing: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showInfo: vi.fn(),
}));

vi.mock("@/services/episodeService", () => ({
    default: episodeServiceMocks,
}));
vi.mock("@/services/seasonService", () => ({
    default: seasonServiceMocks,
}));
vi.mock("./snackbar", () => ({
    useSnackbar: () => snackbarMocks,
}));

const jsonResponse = (status: number, body: unknown) => ({
    status,
    json: async () => body,
});

describe("useEpisode.getEpisodesTimeline", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("returns the timeline on success", async () => {
        const timeline = [{ month: "2025-01" }];
        episodeServiceMocks.getViewedByMonthAgo.mockResolvedValue(jsonResponse(200, timeline));

        const result = await useEpisode().getEpisodesTimeline(3);

        expect(result).toEqual(timeline);
        expect(episodeServiceMocks.getViewedByMonthAgo).toHaveBeenCalledWith(3);
    });

    it("throws the server's message on failure", async () => {
        episodeServiceMocks.getViewedByMonthAgo.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useEpisode().getEpisodesTimeline(3)).rejects.toThrow("Requête invalide");
    });
});

describe("useEpisode.getEpisodesBySeasonId", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("returns the episodes on success", async () => {
        const episodes = [{ id: 1 }];
        seasonServiceMocks.getEpisodesBySeasonId.mockResolvedValue(jsonResponse(200, episodes));

        const result = await useEpisode().getEpisodesBySeasonId(1);

        expect(result).toEqual(episodes);
    });

    it("throws the server's message on failure", async () => {
        seasonServiceMocks.getEpisodesBySeasonId.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useEpisode().getEpisodesBySeasonId(1)).rejects.toThrow("Requête invalide");
    });
});

describe("useEpisode.addEpisodeViewing", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("resolves without a success toast", async () => {
        seasonServiceMocks.addEpisodeViewing.mockResolvedValue(jsonResponse(201, null));

        await expect(useEpisode().addEpisodeViewing(1, 42)).resolves.toBeUndefined();
        expect(seasonServiceMocks.addEpisodeViewing).toHaveBeenCalledWith(1, 42);
        expect(snackbarMocks.showSuccess).not.toHaveBeenCalled();
    });

    it("throws the server's message on failure", async () => {
        seasonServiceMocks.addEpisodeViewing.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useEpisode().addEpisodeViewing(1, 42)).rejects.toThrow("Requête invalide");
    });
});

describe("useEpisode.addAllEpisodesViewing", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("shows a success toast", async () => {
        seasonServiceMocks.addAllEpisodesViewing.mockResolvedValue(jsonResponse(200, null));

        await useEpisode().addAllEpisodesViewing(1);

        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Tous les épisodes diffusés ont été marqués comme vus");
    });

    it("throws on failure without showing a success toast", async () => {
        seasonServiceMocks.addAllEpisodesViewing.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useEpisode().addAllEpisodesViewing(1)).rejects.toThrow("Requête invalide");
        expect(snackbarMocks.showSuccess).not.toHaveBeenCalled();
    });
});

describe("useEpisode.updateEpisodeViewing", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("resolves without a success toast", async () => {
        episodeServiceMocks.updateViewing.mockResolvedValue(jsonResponse(200, null));

        await expect(useEpisode().updateEpisodeViewing(1, "2025-01-01T00:00")).resolves.toBeUndefined();
        expect(episodeServiceMocks.updateViewing).toHaveBeenCalledWith(1, "2025-01-01T00:00");
    });

    it("throws the server's message on failure", async () => {
        episodeServiceMocks.updateViewing.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useEpisode().updateEpisodeViewing(1, "2025-01-01T00:00")).rejects.toThrow("Requête invalide");
    });
});

describe("useEpisode.deleteEpisodeViewing", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("resolves without a success toast", async () => {
        episodeServiceMocks.deleteViewing.mockResolvedValue(jsonResponse(204, null));

        await expect(useEpisode().deleteEpisodeViewing(1)).resolves.toBeUndefined();
        expect(episodeServiceMocks.deleteViewing).toHaveBeenCalledWith(1);
    });

    it("throws the server's message on failure", async () => {
        episodeServiceMocks.deleteViewing.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useEpisode().deleteEpisodeViewing(1)).rejects.toThrow("Requête invalide");
    });
});
