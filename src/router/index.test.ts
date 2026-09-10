// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useScrollStore } from "@/stores/scroll";

const authComposableMocks = vi.hoisted(() => ({
    checkAuth: vi.fn(),
}));
const navigationMocks = vi.hoisted(() => ({
    trackNavigation: vi.fn(),
    goBack: vi.fn(),
}));

vi.mock("@/composables/auth", () => ({ useAuth: () => authComposableMocks }));
vi.mock("@/utils/navigation", () => navigationMocks);

const importRouter = async () => {
    vi.resetModules();
    const mod = await import("./index");
    return mod.default;
};

beforeEach(() => {
    vi.resetAllMocks();
    setActivePinia(createPinia());
    window.history.replaceState(null, "", "/");
});

describe("router guards", () => {
    it("redirects to /login with a redirect query when the target requires auth and the user isn't logged in", async () => {
        const router = await importRouter();
        authComposableMocks.checkAuth.mockResolvedValue(false);

        await router.push("/series");

        expect(router.currentRoute.value.path).toBe("/login");
        expect(router.currentRoute.value.query.redirect).toBe("/series");
    });

    it("navigates normally when the target requires auth and the user is logged in", async () => {
        const router = await importRouter();
        authComposableMocks.checkAuth.mockResolvedValue(true);

        await router.push("/discover");

        expect(router.currentRoute.value.path).toBe("/discover");
    });

    it("redirects a logged-in user away from a non-auth page (e.g. login) to /series", async () => {
        const router = await importRouter();
        authComposableMocks.checkAuth.mockResolvedValue(true);

        await router.push("/register");

        expect(router.currentRoute.value.path).toBe("/series");
    });

    it("leaves a logged-out user on a non-auth page", async () => {
        const router = await importRouter();
        authComposableMocks.checkAuth.mockResolvedValue(false);

        await router.push("/login");

        expect(router.currentRoute.value.path).toBe("/login");
    });

    it("saves the previous page's scroll position on navigation", async () => {
        const router = await importRouter();
        authComposableMocks.checkAuth.mockResolvedValue(true);

        await router.push("/discover");
        Object.defineProperty(window, "scrollY", { value: 240, configurable: true });
        await router.push("/series");

        const scrollToSpy = vi.fn();
        window.scrollTo = scrollToSpy;
        useScrollStore().scrollToPosition("/discover");

        expect(scrollToSpy).toHaveBeenCalledWith(0, 240);
    });

    it("tracks the resolved navigation via trackNavigation", async () => {
        const router = await importRouter();
        authComposableMocks.checkAuth.mockResolvedValue(false);

        await router.push("/login");

        expect(navigationMocks.trackNavigation).toHaveBeenCalledWith(router.currentRoute.value.fullPath);
    });
});
