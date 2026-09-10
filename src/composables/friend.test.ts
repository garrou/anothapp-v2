import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useFriend } from "./friend";
import { useFriendsStore } from "@/stores/friends";

const friendServiceMocks = vi.hoisted(() => ({
    getFriends: vi.fn(),
    sendFriendRequest: vi.fn(),
    acceptFriendRequest: vi.fn(),
    deleteFriend: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showInfo: vi.fn(),
}));

vi.mock("@/services/friendService", () => ({
    default: friendServiceMocks,
}));
vi.mock("./snackbar", () => ({
    useSnackbar: () => snackbarMocks,
}));

const jsonResponse = (status: number, body: unknown) => ({
    status,
    json: async () => body,
});

const user = { id: "friend-1", username: "garrou", current: false };

describe("useFriend.acceptFriendRequest", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setActivePinia(createPinia());
    });

    it("shows a success toast naming the friend", async () => {
        friendServiceMocks.acceptFriendRequest.mockResolvedValue(jsonResponse(200, null));

        await useFriend().acceptFriendRequest(user);

        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Demande de garrou acceptée");
    });

    it("throws on failure without showing a success toast", async () => {
        friendServiceMocks.acceptFriendRequest.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useFriend().acceptFriendRequest(user)).rejects.toThrow("Requête invalide");
        expect(snackbarMocks.showSuccess).not.toHaveBeenCalled();
    });
});

describe("useFriend.sendFriendRequest", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setActivePinia(createPinia());
    });

    it("shows a success toast naming the friend", async () => {
        friendServiceMocks.sendFriendRequest.mockResolvedValue(jsonResponse(200, null));

        await useFriend().sendFriendRequest(user);

        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Demande d'ami envoyé à garrou");
    });

    it("throws on failure without showing a success toast", async () => {
        friendServiceMocks.sendFriendRequest.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useFriend().sendFriendRequest(user)).rejects.toThrow("Requête invalide");
    });
});

describe("useFriend.getFriends", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setActivePinia(createPinia());
    });

    it("returns the response on success", async () => {
        const response = { friends: [user] };
        friendServiceMocks.getFriends.mockResolvedValue(jsonResponse(200, response));

        const result = await useFriend().getFriends();

        expect(result).toEqual(response);
    });

    it("throws the server's message on failure", async () => {
        friendServiceMocks.getFriends.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useFriend().getFriends()).rejects.toThrow("Requête invalide");
    });
});

describe("useFriend.deleteFriend", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setActivePinia(createPinia());
    });

    it("shows the 'friend' message by default", async () => {
        friendServiceMocks.deleteFriend.mockResolvedValue(jsonResponse(204, null));

        await useFriend().deleteFriend(user);

        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Amitié avec garrou supprimée");
    });

    it("shows the 'received' message for a refused request", async () => {
        friendServiceMocks.deleteFriend.mockResolvedValue(jsonResponse(204, null));

        await useFriend().deleteFriend(user, "received");

        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Demande de garrou refusée");
    });

    it("shows the 'sent' message for a cancelled request", async () => {
        friendServiceMocks.deleteFriend.mockResolvedValue(jsonResponse(204, null));

        await useFriend().deleteFriend(user, "sent");

        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Demande envoyée à garrou annulée");
    });

    it("throws on failure without showing a success toast", async () => {
        friendServiceMocks.deleteFriend.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useFriend().deleteFriend(user)).rejects.toThrow("Requête invalide");
        expect(snackbarMocks.showSuccess).not.toHaveBeenCalled();
    });
});

describe("useFriend.getCachedFriends", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setActivePinia(createPinia());
    });

    it("fetches once, stores the friends list, and returns it from the store", async () => {
        friendServiceMocks.getFriends.mockResolvedValue(jsonResponse(200, { friends: [user] }));

        const { getCachedFriends } = useFriend();
        const first = await getCachedFriends();
        const second = await getCachedFriends();

        expect(first).toEqual([user]);
        expect(second).toEqual([user]);
        expect(friendServiceMocks.getFriends).toHaveBeenCalledTimes(1);
        expect(useFriendsStore().loaded).toBe(true);
    });

    it("throws the server's message on failure", async () => {
        friendServiceMocks.getFriends.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(useFriend().getCachedFriends()).rejects.toThrow("Requête invalide");
    });
});
