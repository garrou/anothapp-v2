import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useSerie } from "./serie";
import { useSerieStore } from "@/stores/serie";
import { useUserSeriesStore } from "@/stores/userSeries";
import { useUserListStore } from "@/stores/userList";
import { useSeriesCatalogStore } from "@/stores/seriesCatalog";
import { SerieStatus } from "@/types/types";

const serieServiceMocks = vi.hoisted(() => ({
    getSeries: vi.fn(),
    getSeriesByStatus: vi.fn(),
    addSerie: vi.fn(),
    deleteSerie: vi.fn(),
    getSerie: vi.fn(),
    getRecommendations: vi.fn(),
    updateFieldBySerieId: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showInfo: vi.fn(),
}));
const routerMocks = vi.hoisted(() => ({
    push: vi.fn(),
    replace: vi.fn(),
}));

vi.mock("@/services/serieService", () => ({
    default: serieServiceMocks,
}));
vi.mock("./snackbar", () => ({
    useSnackbar: () => snackbarMocks,
}));
vi.mock("vue-router", () => ({
    useRouter: () => routerMocks,
}));

const jsonResponse = (status: number, body: unknown) => ({
    status,
    json: async () => body,
});

const breakingBad = { id: 1, title: "Breaking Bad", kinds: ["Drama"], country: "US", note: 5, addedAt: "2025-01-01T00:00:00.000Z" };
const theWire = { id: 2, title: "The Wire", kinds: ["Crime"], country: "US", note: 4, addedAt: "2025-02-01T00:00:00.000Z" };

beforeEach(() => {
    vi.resetAllMocks();
    setActivePinia(createPinia());
});

describe("useSerie.addSerie", () => {
    it("upserts into userSeries and navigates to the serie page when not added to the list", async () => {
        serieServiceMocks.addSerie.mockResolvedValue(jsonResponse(200, breakingBad));

        await useSerie().addSerie(1, false);

        expect(useUserSeriesStore().series.get(1)?.title).toBe("Breaking Bad");
        expect(useUserListStore().series.has(1)).toBe(false);
        expect(routerMocks.push).toHaveBeenCalledWith("/series/1");
        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Série ajoutée ");
    });

    it("upserts into userList and doesn't navigate when added to the list", async () => {
        serieServiceMocks.addSerie.mockResolvedValue(jsonResponse(200, breakingBad));

        await useSerie().addSerie(1, true);

        expect(useUserListStore().series.has(1)).toBe(true);
        expect(useUserSeriesStore().series.has(1)).toBe(false);
        expect(routerMocks.push).not.toHaveBeenCalled();
        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Série ajoutée dans votre liste");
    });

    it("throws the server's message on failure", async () => {
        serieServiceMocks.addSerie.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useSerie().addSerie(1)).rejects.toThrow("Requête invalide");
    });
});

describe("useSerie.deleteSerie", () => {
    it("removes from userSeries, navigates back, and closes the confirm modal", async () => {
        useUserSeriesStore().upsert(breakingBad as any);
        serieServiceMocks.deleteSerie.mockResolvedValue(jsonResponse(204, null));

        await useSerie().deleteSerie(breakingBad as any);

        expect(useUserSeriesStore().series.has(1)).toBe(false);
        expect(routerMocks.replace).toHaveBeenCalledWith("/series");
        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith('Série "Breaking Bad" supprimée');
    });

    it("throws on failure without touching the store", async () => {
        useUserSeriesStore().upsert(breakingBad as any);
        serieServiceMocks.deleteSerie.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useSerie().deleteSerie(breakingBad as any)).rejects.toThrow("Requête invalide");
        expect(useUserSeriesStore().series.has(1)).toBe(true);
    });
});

describe("useSerie.deleteSerieInList", () => {
    it("removes from userList and shows a success toast", async () => {
        useUserListStore().upsert(breakingBad as any);
        serieServiceMocks.deleteSerie.mockResolvedValue(jsonResponse(204, null));

        await useSerie().deleteSerieInList(breakingBad as any);

        expect(useUserListStore().series.has(1)).toBe(false);
        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith('Série "Breaking Bad" supprimée de votre liste');
    });
});

describe("useSerie.getSerie", () => {
    it("rejects locally without fetching when id is missing", async () => {
        await expect(useSerie().getSerie({})).rejects.toThrow("Impossible de récupérer les données");
        expect(serieServiceMocks.getSeries).not.toHaveBeenCalled();
    });

    it("rejects when the serie isn't in the user's collection", async () => {
        serieServiceMocks.getSeries.mockResolvedValue(jsonResponse(200, []));

        await expect(useSerie().getSerie({ id: 999 })).rejects.toThrow("Série introuvable");
    });

    it("returns the serie once loaded", async () => {
        serieServiceMocks.getSeries.mockResolvedValue(jsonResponse(200, [breakingBad]));

        const result = await useSerie().getSerie({ id: 1 });

        expect(result).toEqual(breakingBad);
    });
});

describe("useSerie.getSerieInfos", () => {
    it("rejects locally without fetching when id is missing", async () => {
        await expect(useSerie().getSerieInfos({})).rejects.toThrow("Impossible de récupérer les données");
    });

    it("upserts the serie and returns the full infos", async () => {
        const infos = { serie: breakingBad, seasons: [] };
        serieServiceMocks.getSerie.mockResolvedValue(jsonResponse(200, infos));

        const result = await useSerie().getSerieInfos({ id: 1 });

        expect(result).toEqual(infos);
        expect(useUserSeriesStore().series.get(1)?.title).toBe("Breaking Bad");
    });

    it("throws the server's message on failure", async () => {
        serieServiceMocks.getSerie.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useSerie().getSerieInfos({ id: 1 })).rejects.toThrow("Requête invalide");
    });
});

describe("useSerie.getSeries (filterAndSortUserSeries)", () => {
    it("returns the user's series sorted by most recently added, unfiltered", async () => {
        useUserSeriesStore().setAll([breakingBad, theWire] as any);

        const result = await useSerie().getSeries();

        expect(result.map((s) => s.id)).toEqual([2, 1]);
    });

    it("filters by kind", async () => {
        useUserSeriesStore().setAll([breakingBad, theWire] as any);
        useSerieStore().filterKinds = [{ name: "Crime", value: "crime" }] as any;

        const result = await useSerie().getSeries();

        expect(result.map((s) => s.id)).toEqual([2]);
    });

    it("filters by title ignoring accents and case", async () => {
        useUserSeriesStore().setAll([breakingBad, theWire] as any);
        useSerieStore().filterTitle = "BREAKING";

        const result = await useSerie().getSeries();

        expect(result.map((s) => s.id)).toEqual([1]);
    });

    it("filters by country", async () => {
        useUserSeriesStore().setAll([breakingBad, { ...theWire, id: 3, country: "FR" }] as any);
        useSerieStore().filterCountries = ["US"];

        const result = await useSerie().getSeries();

        expect(result.map((s) => s.id)).toEqual([1]);
    });

    it("filters by note", async () => {
        useUserSeriesStore().setAll([breakingBad, theWire] as any);
        useSerieStore().filterNotes = [{ id: 5, name: "Excellent" }] as any;

        const result = await useSerie().getSeries();

        expect(result.map((s) => s.id)).toEqual([1]);
    });

    it("fetches from the server when a platform or friend filter is active", async () => {
        useSerieStore().filterPlatforms = [{ id: 1, name: "Netflix" }] as any;
        serieServiceMocks.getSeries.mockResolvedValue(jsonResponse(200, [breakingBad]));

        const result = await useSerie().getSeries();

        expect(result).toEqual([breakingBad]);
        expect(serieServiceMocks.getSeries).toHaveBeenCalled();
    });

    it("throws the server's message on failure when fetching filtered results", async () => {
        useSerieStore().filterFriends = [{ id: "friend-1" }] as any;
        serieServiceMocks.getSeries.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useSerie().getSeries()).rejects.toThrow("Requête invalide");
    });
});

describe("useSerie.getSeriesByStatus", () => {
    it("returns favorites from the store, sorted by title, when no friendId is given", async () => {
        useUserSeriesStore().setAll([
            { ...breakingBad, favorite: true },
            { ...theWire, favorite: false },
            { id: 3, title: "Atlanta", favorite: true },
        ] as any);

        const result = await useSerie().getSeriesByStatus(SerieStatus.Favorite);

        expect(result.map((s) => s.title)).toEqual(["Atlanta", "Breaking Bad"]);
        expect(serieServiceMocks.getSeriesByStatus).not.toHaveBeenCalled();
    });

    it("returns the watchlist from the store for the Watchlist status", async () => {
        useUserListStore().setAll([breakingBad] as any);

        const result = await useSerie().getSeriesByStatus(SerieStatus.Watchlist);

        expect(result).toEqual([breakingBad]);
        expect(serieServiceMocks.getSeriesByStatus).not.toHaveBeenCalled();
    });

    it("fetches from the server for a friend's favorites", async () => {
        serieServiceMocks.getSeriesByStatus.mockResolvedValue(jsonResponse(200, [breakingBad]));

        const result = await useSerie().getSeriesByStatus(SerieStatus.Favorite, "friend-1");

        expect(result).toEqual([breakingBad]);
        expect(serieServiceMocks.getSeriesByStatus).toHaveBeenCalledWith(SerieStatus.Favorite, "friend-1");
    });

    it("throws the server's message on failure for a server-backed status", async () => {
        serieServiceMocks.getSeriesByStatus.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useSerie().getSeriesByStatus(SerieStatus.Shared, "friend-1")).rejects.toThrow("Requête invalide");
    });
});

describe("useSerie.updateField", () => {
    it("sets the value directly for addedAt/note fields and upserts the store", async () => {
        useUserSeriesStore().upsert(breakingBad as any);
        serieServiceMocks.updateFieldBySerieId.mockResolvedValue(jsonResponse(200, { value: "ignored" }));

        const result = await useSerie().updateField(breakingBad as any, "note", 3);

        expect(result).toBe(true);
        expect(useUserSeriesStore().series.get(1)?.note).toBe(3);
    });

    it("uses the server's returned value for other fields", async () => {
        useUserSeriesStore().upsert(breakingBad as any);
        serieServiceMocks.updateFieldBySerieId.mockResolvedValue(jsonResponse(200, { value: true }));

        const result = await useSerie().updateField(breakingBad as any, "favorite", 1);

        expect(result).toBe(true);
        expect(useUserSeriesStore().series.get(1)?.favorite).toBe(true);
    });

    it("throws the server's message on failure", async () => {
        serieServiceMocks.updateFieldBySerieId.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useSerie().updateField(breakingBad as any, "note", 3)).rejects.toThrow("Requête invalide");
    });
});

describe("useSerie.getCountries", () => {
    it("returns the distinct, sorted countries of the user's series", async () => {
        useUserSeriesStore().setAll([
            { ...breakingBad, country: "US" },
            { ...theWire, country: "FR" },
            { id: 3, title: "X", country: "US" },
        ] as any);

        const result = await useSerie().getCountries();

        expect(result).toEqual(["FR", "US"]);
    });
});

describe("useSerie.getSerieFromCache", () => {
    it("reads from the userSeries store by default", async () => {
        useUserSeriesStore().setAll([breakingBad] as any);

        const result = await useSerie().getSerieFromCache(1);

        expect(result).toEqual(breakingBad);
        expect(serieServiceMocks.getSeries).not.toHaveBeenCalled();
    });

    it("reads from the userList store for type 'userlist'", async () => {
        useUserListStore().setAll([breakingBad] as any);

        const result = await useSerie().getSerieFromCache(1, { type: "userlist" });

        expect(result).toEqual(breakingBad);
        expect(serieServiceMocks.getSeriesByStatus).not.toHaveBeenCalled();
    });

    it("reads from the series catalog store for type 'series'", async () => {
        useSeriesCatalogStore().upsert(theWire as any);

        const result = await useSerie().getSerieFromCache(2, { type: "series" });

        expect(result).toEqual(theWire);
    });
});

describe("useSerie.getRecommendations", () => {
    it("returns the recommendations on success", async () => {
        serieServiceMocks.getRecommendations.mockResolvedValue(jsonResponse(200, [{ id: 1 }]));

        const result = await useSerie().getRecommendations();

        expect(result).toEqual([{ id: 1 }]);
    });

    it("throws the server's message on failure", async () => {
        serieServiceMocks.getRecommendations.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useSerie().getRecommendations()).rejects.toThrow("Requête invalide");
    });
});
