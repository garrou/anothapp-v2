import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useActor } from "./actor";
import { useActorStore } from "@/stores/actor";

const actorServiceMocks = vi.hoisted(() => ({
    getFavorites: vi.fn(),
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showInfo: vi.fn(),
}));

vi.mock("@/services/actorService", () => ({
    default: actorServiceMocks,
}));
vi.mock("./snackbar", () => ({
    useSnackbar: () => snackbarMocks,
}));

const jsonResponse = (status: number, body: unknown) => ({
    status,
    json: async () => body,
});

describe("useActor.getFavoriteActors", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setActivePinia(createPinia());
    });

    it("returns the favorites and syncs the store's ids", async () => {
        const favorites = [{ id: 1, name: "Bryan Cranston" }, { id: 2, name: "Aaron Paul" }];
        actorServiceMocks.getFavorites.mockResolvedValue(jsonResponse(200, favorites));

        const result = await useActor().getFavoriteActors();

        expect(result).toEqual(favorites);
        expect(actorServiceMocks.getFavorites).toHaveBeenCalledWith();
        expect(useActorStore().isFavorite(1)).toBe(true);
        expect(useActorStore().isFavorite(2)).toBe(true);
    });

    it("throws the server's message on failure", async () => {
        actorServiceMocks.getFavorites.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useActor().getFavoriteActors()).rejects.toThrow("Requête invalide");
    });
});

describe("useActor.getFriendFavoriteActors", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setActivePinia(createPinia());
    });

    it("passes the friendId through without touching the local store", async () => {
        const favorites = [{ id: 3, name: "Bob Odenkirk" }];
        actorServiceMocks.getFavorites.mockResolvedValue(jsonResponse(200, favorites));

        const result = await useActor().getFriendFavoriteActors("friend-1");

        expect(result).toEqual(favorites);
        expect(actorServiceMocks.getFavorites).toHaveBeenCalledWith("friend-1");
        expect(useActorStore().isFavorite(3)).toBe(false);
    });

    it("throws the server's message on failure", async () => {
        actorServiceMocks.getFavorites.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useActor().getFriendFavoriteActors("friend-1")).rejects.toThrow("Requête invalide");
    });
});

describe("useActor.loadFavoriteActorIds", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setActivePinia(createPinia());
    });

    it("fetches once and caches the favorite ids", async () => {
        actorServiceMocks.getFavorites.mockResolvedValue(jsonResponse(200, [{ id: 1 }, { id: 2 }]));

        const { loadFavoriteActorIds } = useActor();
        await loadFavoriteActorIds();
        await loadFavoriteActorIds();

        expect(actorServiceMocks.getFavorites).toHaveBeenCalledTimes(1);
        expect(useActorStore().loaded).toBe(true);
    });
});

describe("useActor.addFavoriteActor", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setActivePinia(createPinia());
    });

    it("adds the actor to the store and shows a success toast naming it", async () => {
        actorServiceMocks.addFavorite.mockResolvedValue(jsonResponse(200, null));

        await useActor().addFavoriteActor(1, "Bryan Cranston");

        expect(useActorStore().isFavorite(1)).toBe(true);
        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith('"Bryan Cranston" ajouté aux acteurs favoris');
    });

    it("throws on failure without touching the store", async () => {
        actorServiceMocks.addFavorite.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useActor().addFavoriteActor(1, "Bryan Cranston")).rejects.toThrow("Requête invalide");
        expect(useActorStore().isFavorite(1)).toBe(false);
    });
});

describe("useActor.removeFavoriteActor", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setActivePinia(createPinia());
    });

    it("removes the actor from the store and shows a success toast naming it", async () => {
        useActorStore().setFavoriteActorIds([1]);
        actorServiceMocks.removeFavorite.mockResolvedValue(jsonResponse(204, null));

        await useActor().removeFavoriteActor(1, "Bryan Cranston");

        expect(useActorStore().isFavorite(1)).toBe(false);
        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith('"Bryan Cranston" supprimé des acteurs favoris');
    });

    it("throws on failure without touching the store", async () => {
        useActorStore().setFavoriteActorIds([1]);
        actorServiceMocks.removeFavorite.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useActor().removeFavoriteActor(1, "Bryan Cranston")).rejects.toThrow("Requête invalide");
        expect(useActorStore().isFavorite(1)).toBe(true);
    });
});
