import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { usePlatform } from "./platform";
import { useUserPlatformsStore } from "@/stores/userPlatforms";

const platformServiceMocks = vi.hoisted(() => ({
    getUserPlatforms: vi.fn(),
    getFriendPlatforms: vi.fn(),
    updateUserPlatforms: vi.fn(),
    deleteUserPlatform: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showInfo: vi.fn(),
}));

vi.mock("@/services/platformService", () => ({
    default: platformServiceMocks,
}));
vi.mock("./snackbar", () => ({
    useSnackbar: () => snackbarMocks,
}));

const jsonResponse = (status: number, body: unknown) => ({
    status,
    json: async () => body,
});

describe("usePlatform.getUserPlatforms", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setActivePinia(createPinia());
    });

    it("fetches once and caches the platform ids", async () => {
        platformServiceMocks.getUserPlatforms.mockResolvedValue(jsonResponse(200, [1, 2, 3]));

        const { getUserPlatforms } = usePlatform();
        const first = await getUserPlatforms();
        const second = await getUserPlatforms();

        expect(first.sort()).toEqual([1, 2, 3]);
        expect(second.sort()).toEqual([1, 2, 3]);
        expect(platformServiceMocks.getUserPlatforms).toHaveBeenCalledTimes(1);
    });

    it("throws the server's message on failure", async () => {
        platformServiceMocks.getUserPlatforms.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(usePlatform().getUserPlatforms()).rejects.toThrow("Requête invalide");
    });
});

describe("usePlatform.getFriendPlatforms", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setActivePinia(createPinia());
    });

    it("returns the friend's platform ids on success", async () => {
        platformServiceMocks.getFriendPlatforms.mockResolvedValue(jsonResponse(200, [4, 5]));

        const result = await usePlatform().getFriendPlatforms("friend-1");

        expect(result).toEqual([4, 5]);
        expect(platformServiceMocks.getFriendPlatforms).toHaveBeenCalledWith("friend-1");
    });

    it("throws the server's message on failure", async () => {
        platformServiceMocks.getFriendPlatforms.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(usePlatform().getFriendPlatforms("friend-1")).rejects.toThrow("Requête invalide");
    });
});

describe("usePlatform.updateUserPlatforms", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setActivePinia(createPinia());
    });

    it("adds the platform to the store and shows a success toast", async () => {
        platformServiceMocks.updateUserPlatforms.mockResolvedValue(jsonResponse(200, null));

        await usePlatform().updateUserPlatforms(7);

        expect(useUserPlatformsStore().platformIds.has(7)).toBe(true);
        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Plateforme ajoutée aux abonnements");
    });

    it("throws on failure without touching the store", async () => {
        platformServiceMocks.updateUserPlatforms.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(usePlatform().updateUserPlatforms(7)).rejects.toThrow("Requête invalide");
        expect(useUserPlatformsStore().platformIds.has(7)).toBe(false);
        expect(snackbarMocks.showSuccess).not.toHaveBeenCalled();
    });
});

describe("usePlatform.deleteUserPlatform", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setActivePinia(createPinia());
    });

    it("removes the platform from the store and shows a success toast", async () => {
        useUserPlatformsStore().setAll([7, 8]);
        platformServiceMocks.deleteUserPlatform.mockResolvedValue(jsonResponse(204, null));

        await usePlatform().deleteUserPlatform(7);

        expect(useUserPlatformsStore().platformIds.has(7)).toBe(false);
        expect(useUserPlatformsStore().platformIds.has(8)).toBe(true);
        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Plateforme retirée des abonnements");
    });

    it("throws on failure without touching the store", async () => {
        useUserPlatformsStore().setAll([7]);
        platformServiceMocks.deleteUserPlatform.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(usePlatform().deleteUserPlatform(7)).rejects.toThrow("Requête invalide");
        expect(useUserPlatformsStore().platformIds.has(7)).toBe(true);
    });
});
