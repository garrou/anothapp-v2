import { describe, it, expect, vi, beforeEach } from "vitest";

const getPendingWatchedWithMock = vi.hoisted(() => vi.fn());
const routeMock = vi.hoisted(() => ({ name: "series" as string | undefined }));

vi.mock("./season", () => ({ useSeason: () => ({ getPendingWatchedWith: getPendingWatchedWithMock }) }));
vi.mock("vue-router", () => ({ useRoute: () => routeMock }));

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

// pendingWatchTogetherInvites.ts keeps its watcher and pendingInvites ref at module
// scope (a single shared singleton across the app), so each test needs a
// fresh module instance to avoid leaking the watcher/count across tests.
const freshUsePendingWatchTogetherInvites = async () => {
    vi.resetModules();
    const mod = await import("./pendingWatchTogetherInvites");
    return mod.usePendingWatchTogetherInvites();
};

beforeEach(() => {
    vi.resetAllMocks();
    routeMock.name = "series";
});

describe("usePendingWatchTogetherInvites", () => {
    it("fetches the pending invite count immediately on a visible route", async () => {
        getPendingWatchedWithMock.mockResolvedValue([{ userSeasonId: 1 }, { userSeasonId: 2 }]);

        const pendingInvites = await freshUsePendingWatchTogetherInvites();
        await flushPromises();

        expect(pendingInvites.value).toBe(2);
    });

    it("doesn't fetch on a route without the bottom navbar", async () => {
        routeMock.name = "login";
        getPendingWatchedWithMock.mockResolvedValue([{ userSeasonId: 1 }]);

        const pendingInvites = await freshUsePendingWatchTogetherInvites();
        await flushPromises();

        expect(pendingInvites.value).toBe(0);
        expect(getPendingWatchedWithMock).not.toHaveBeenCalled();
    });

    it.each(["verify-email", "forgot-password", "reset-password"])(
        "doesn't fetch on the anonymous %s page (no session to authenticate the call with)",
        async (name) => {
            routeMock.name = name;
            getPendingWatchedWithMock.mockResolvedValue([{ userSeasonId: 1 }]);

            const pendingInvites = await freshUsePendingWatchTogetherInvites();
            await flushPromises();

            expect(pendingInvites.value).toBe(0);
            expect(getPendingWatchedWithMock).not.toHaveBeenCalled();
        }
    );

    it("stays at 0 when there are no pending invites", async () => {
        getPendingWatchedWithMock.mockResolvedValue([]);

        const pendingInvites = await freshUsePendingWatchTogetherInvites();
        await flushPromises();

        expect(pendingInvites.value).toBe(0);
    });
});
