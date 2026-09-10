import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useSearch } from "./search";
import { useKindsStore } from "@/stores/kinds";
import { useNotesStore } from "@/stores/notes";
import { usePlatformsStore } from "@/stores/platforms";
import { useSeriesCatalogStore } from "@/stores/seriesCatalog";
import { useSearchStore } from "@/stores/search";

const searchServiceMocks = vi.hoisted(() => ({
    getActor: vi.fn(),
    getCharacters: vi.fn(),
    getKinds: vi.fn(),
    getNotes: vi.fn(),
    getPlatforms: vi.fn(),
    getSeries: vi.fn(),
    getSerie: vi.fn(),
    getSerieImages: vi.fn(),
    getSeasonsBySerieId: vi.fn(),
    getSimilarsSeries: vi.fn(),
    getImages: vi.fn(),
    getEpisodesBySerieIdBySeason: vi.fn(),
}));

vi.mock("@/services/searchService", () => ({
    default: searchServiceMocks,
}));

const jsonResponse = (status: number, body: unknown) => ({
    status,
    json: async () => body,
});

beforeEach(() => {
    vi.resetAllMocks();
    setActivePinia(createPinia());
});

describe("useSearch simple pass-through methods", () => {
    it("getActor returns the actor on success", async () => {
        searchServiceMocks.getActor.mockResolvedValue(jsonResponse(200, { id: 1, name: "Bryan Cranston" }));

        const result = await useSearch().getActor(1);

        expect(result).toEqual({ id: 1, name: "Bryan Cranston" });
    });

    it("getActor throws the server's message on failure", async () => {
        searchServiceMocks.getActor.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useSearch().getActor(1)).rejects.toThrow("Requête invalide");
    });

    it("getCharacters returns the characters on success", async () => {
        searchServiceMocks.getCharacters.mockResolvedValue(jsonResponse(200, [{ id: 1 }]));

        const result = await useSearch().getCharacters(1);

        expect(result).toEqual([{ id: 1 }]);
    });

    it("getSerieImages returns the images on success", async () => {
        searchServiceMocks.getSerieImages.mockResolvedValue(jsonResponse(200, ["a.jpg"]));

        const result = await useSearch().getSerieImages(1);

        expect(result).toEqual(["a.jpg"]);
    });

    it("getSeasonsBySerieId returns the seasons on success", async () => {
        searchServiceMocks.getSeasonsBySerieId.mockResolvedValue(jsonResponse(200, [{ number: 1 }]));

        const result = await useSearch().getSeasonsBySerieId(1);

        expect(result).toEqual([{ number: 1 }]);
    });

    it("getSimilarsSeries returns the similar series on success", async () => {
        searchServiceMocks.getSimilarsSeries.mockResolvedValue(jsonResponse(200, [{ id: 2 }]));

        const result = await useSearch().getSimilarsSeries(1);

        expect(result).toEqual([{ id: 2 }]);
    });

    it("getImages returns the images on success", async () => {
        searchServiceMocks.getImages.mockResolvedValue(jsonResponse(200, ["a.jpg"]));

        const result = await useSearch().getImages(5);

        expect(result).toEqual(["a.jpg"]);
        expect(searchServiceMocks.getImages).toHaveBeenCalledWith(5);
    });

    it("getEpisodes returns the episodes on success", async () => {
        searchServiceMocks.getEpisodesBySerieIdBySeason.mockResolvedValue(jsonResponse(200, [{ number: 1 }]));

        const result = await useSearch().getEpisodes(1, 2);

        expect(result).toEqual([{ number: 1 }]);
        expect(searchServiceMocks.getEpisodesBySerieIdBySeason).toHaveBeenCalledWith(1, 2);
    });
});

describe("useSearch.getKinds", () => {
    it("fetches once, sorts alphabetically, and caches the result", async () => {
        searchServiceMocks.getKinds.mockResolvedValue(jsonResponse(200, [
            { name: "Western", value: "western" },
            { name: "Action", value: "action" },
        ]));

        const { getKinds } = useSearch();
        const first = await getKinds();
        const second = await getKinds();

        expect(first.map((k) => k.name)).toEqual(["Action", "Western"]);
        expect(second).toEqual(first);
        expect(searchServiceMocks.getKinds).toHaveBeenCalledTimes(1);
        expect(useKindsStore().loaded).toBe(true);
    });

    it("throws the server's message on failure", async () => {
        searchServiceMocks.getKinds.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useSearch().getKinds()).rejects.toThrow("Requête invalide");
    });
});

describe("useSearch.getNotes", () => {
    it("fetches once and sorts by id", async () => {
        searchServiceMocks.getNotes.mockResolvedValue(jsonResponse(200, [{ id: 3 }, { id: 1 }, { id: 2 }]));

        const result = await useSearch().getNotes();

        expect(result.map((n) => n.id)).toEqual([1, 2, 3]);
        expect(useNotesStore().loaded).toBe(true);
    });
});

describe("useSearch.getPlatforms", () => {
    it("fetches once and sorts alphabetically", async () => {
        searchServiceMocks.getPlatforms.mockResolvedValue(jsonResponse(200, [
            { id: 1, name: "Netflix" },
            { id: 2, name: "Disney+" },
        ]));

        const result = await useSearch().getPlatforms();

        expect(result.map((p) => p.name)).toEqual(["Disney+", "Netflix"]);
        expect(usePlatformsStore().loaded).toBe(true);
    });
});

describe("useSearch.getSerie", () => {
    it("returns the cached serie without calling the service", async () => {
        const serie = { id: 1, title: "Breaking Bad" };
        useSeriesCatalogStore().upsert(serie as any);

        const result = await useSearch().getSerie(1);

        expect(result).toEqual(serie);
        expect(searchServiceMocks.getSerie).not.toHaveBeenCalled();
    });

    it("fetches and caches the serie when not already cached", async () => {
        const serie = { id: 2, title: "The Wire" };
        searchServiceMocks.getSerie.mockResolvedValue(jsonResponse(200, serie));

        const result = await useSearch().getSerie(2);

        expect(result).toEqual(serie);
        expect(useSeriesCatalogStore().series.get(2)).toEqual(serie);
    });

    it("throws the server's message on failure", async () => {
        searchServiceMocks.getSerie.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useSearch().getSerie(3)).rejects.toThrow("Requête invalide");
    });
});

describe("useSearch.getSeries", () => {
    it("fetches filtered results from the server when the search store has active filters", async () => {
        useSearchStore().filterTitle = "Breaking";
        searchServiceMocks.getSeries.mockResolvedValue(jsonResponse(200, [{ id: 1, title: "Breaking Bad" }]));

        const result = await useSearch().getSeries();

        expect(result).toEqual([{ id: 1, title: "Breaking Bad" }]);
        expect(searchServiceMocks.getSeries).toHaveBeenCalled();
    });

    it("falls back to the cached catalog when there are no active filters", async () => {
        const serie = { id: 1, title: "Breaking Bad" };
        searchServiceMocks.getSeries.mockResolvedValue(jsonResponse(200, [serie]));

        const result = await useSearch().getSeries();

        expect(result).toEqual([serie]);
        expect(useSeriesCatalogStore().loaded).toBe(true);
    });

    it("throws the server's message on failure when filters are active", async () => {
        useSearchStore().filterTitle = "Breaking";
        searchServiceMocks.getSeries.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useSearch().getSeries()).rejects.toThrow("Requête invalide");
    });
});
