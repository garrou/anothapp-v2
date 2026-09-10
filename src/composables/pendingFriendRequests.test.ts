import { describe, it, expect, vi, beforeEach } from "vitest";

const getFriendsMock = vi.hoisted(() => vi.fn());
const routeMock = vi.hoisted(() => ({ name: "series" as string | undefined }));

vi.mock("./friend", () => ({ useFriend: () => ({ getFriends: getFriendsMock }) }));
vi.mock("vue-router", () => ({ useRoute: () => routeMock }));

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

// pendingFriendRequests.ts keeps its watcher and pendingRequests ref at module
// scope (a single shared singleton across the app), so each test needs a
// fresh module instance to avoid leaking the watcher/count across tests.
const freshUsePendingFriendRequests = async () => {
    vi.resetModules();
    const mod = await import("./pendingFriendRequests");
    return mod.usePendingFriendRequests();
};

beforeEach(() => {
    vi.resetAllMocks();
    routeMock.name = "series";
});

describe("usePendingFriendRequests", () => {
    it("fetches the received count immediately on a visible route", async () => {
        getFriendsMock.mockResolvedValue({ received: [{ id: "1" }, { id: "2" }] });

        const pendingRequests = await freshUsePendingFriendRequests();
        await flushPromises();

        expect(pendingRequests.value).toBe(2);
    });

    it("doesn't fetch on a route without the bottom navbar", async () => {
        routeMock.name = "login";
        getFriendsMock.mockResolvedValue({ received: [{ id: "1" }] });

        const pendingRequests = await freshUsePendingFriendRequests();
        await flushPromises();

        expect(pendingRequests.value).toBe(0);
        expect(getFriendsMock).not.toHaveBeenCalled();
    });

    it("stays at 0 when there is no received list", async () => {
        getFriendsMock.mockResolvedValue({});

        const pendingRequests = await freshUsePendingFriendRequests();
        await flushPromises();

        expect(pendingRequests.value).toBe(0);
    });
});
