import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useUser } from "./user";
import { useUserStore } from "@/stores/user";

const userServiceMocks = vi.hoisted(() => ({
    getProfile: vi.fn(),
    updateImage: vi.fn(),
    updatePassword: vi.fn(),
    updateLogin: vi.fn(),
    updateEpisodeTracking: vi.fn(),
    getUsers: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showInfo: vi.fn(),
}));

vi.mock("@/services/userService", () => ({
    default: userServiceMocks,
}));
vi.mock("./snackbar", () => ({
    useSnackbar: () => snackbarMocks,
}));

const jsonResponse = (status: number, body: unknown) => ({
    status,
    json: async () => body,
});

const profile = { id: "user-1", username: "garrou", email: "garrou@example.com", current: true };

describe("useUser.getProfile", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setActivePinia(createPinia());
    });

    it("fetches once and caches the profile", async () => {
        userServiceMocks.getProfile.mockResolvedValue(jsonResponse(200, profile));

        const { getProfile } = useUser();
        const first = await getProfile();
        const second = await getProfile();

        expect(first).toEqual(profile);
        expect(second).toEqual(profile);
        expect(userServiceMocks.getProfile).toHaveBeenCalledTimes(1);
    });

    it("throws the server's message on failure", async () => {
        userServiceMocks.getProfile.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useUser().getProfile()).rejects.toThrow("Requête invalide");
    });
});

describe("useUser.changeImage", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setActivePinia(createPinia());
    });

    it("patches the store's picture and shows a success toast", async () => {
        userServiceMocks.updateImage.mockResolvedValue(jsonResponse(200, null));
        userServiceMocks.getProfile.mockResolvedValue(jsonResponse(200, profile));

        await useUser().changeImage("data:image/png;base64,xxx");

        expect(useUserStore().profile?.picture).toBe("data:image/png;base64,xxx");
        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Image de profil modifiée");
    });

    it("throws on failure without showing a success toast", async () => {
        userServiceMocks.updateImage.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useUser().changeImage("x")).rejects.toThrow("Requête invalide");
        expect(snackbarMocks.showSuccess).not.toHaveBeenCalled();
    });
});

describe("useUser.changePassword", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setActivePinia(createPinia());
    });

    it("shows a success toast on success", async () => {
        userServiceMocks.updatePassword.mockResolvedValue(jsonResponse(200, null));

        await useUser().changePassword("old", "new", "new");

        expect(userServiceMocks.updatePassword).toHaveBeenCalledWith("old", "new", "new");
        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Mot de passe modifié");
    });

    it("throws on failure without showing a success toast", async () => {
        userServiceMocks.updatePassword.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useUser().changePassword("old", "new", "new")).rejects.toThrow("Requête invalide");
    });
});

describe("useUser.changeEmail", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setActivePinia(createPinia());
    });

    it("patches the store's email and shows a success toast", async () => {
        userServiceMocks.updateLogin.mockResolvedValue(jsonResponse(200, null));
        userServiceMocks.getProfile.mockResolvedValue(jsonResponse(200, profile));

        await useUser().changeEmail("old@example.com", "new@example.com");

        expect(useUserStore().profile?.email).toBe("new@example.com");
        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Email modifié");
    });

    it("throws on failure without showing a success toast", async () => {
        userServiceMocks.updateLogin.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useUser().changeEmail("old@example.com", "new@example.com")).rejects.toThrow("Requête invalide");
    });
});

describe("useUser.updateEpisodeTracking", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setActivePinia(createPinia());
    });

    it("shows the 'activated' message when enabling", async () => {
        userServiceMocks.updateEpisodeTracking.mockResolvedValue(jsonResponse(200, null));
        userServiceMocks.getProfile.mockResolvedValue(jsonResponse(200, profile));

        await useUser().updateEpisodeTracking(true);

        expect(useUserStore().profile?.episodeTrackingEnabled).toBe(true);
        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Suivi des épisodes activé");
    });

    it("shows the 'deactivated' message when disabling", async () => {
        userServiceMocks.updateEpisodeTracking.mockResolvedValue(jsonResponse(200, null));
        userServiceMocks.getProfile.mockResolvedValue(jsonResponse(200, profile));

        await useUser().updateEpisodeTracking(false);

        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Suivi des épisodes désactivé");
    });

    it("throws on failure without showing a success toast", async () => {
        userServiceMocks.updateEpisodeTracking.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useUser().updateEpisodeTracking(true)).rejects.toThrow("Requête invalide");
    });
});

describe("useUser.getUsers", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setActivePinia(createPinia());
    });

    it("returns the matching users on success", async () => {
        userServiceMocks.getUsers.mockResolvedValue(jsonResponse(200, [profile]));

        const result = await useUser().getUsers("garrou");

        expect(result).toEqual([profile]);
        expect(userServiceMocks.getUsers).toHaveBeenCalledWith("garrou");
    });

    it("throws the server's message on failure", async () => {
        userServiceMocks.getUsers.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useUser().getUsers("garrou")).rejects.toThrow("Requête invalide");
    });
});
