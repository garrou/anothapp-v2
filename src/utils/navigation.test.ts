import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Router } from "vue-router";

const freshNavigation = async () => {
    vi.resetModules();
    return import("./navigation");
};

const mockRouter = () => ({ push: vi.fn() }) as unknown as Router;

beforeEach(() => {
    vi.resetModules();
});

describe("navigation", () => {
    it("goBack navigates to the previous tracked path and drops the current one", async () => {
        const { trackNavigation, goBack } = await freshNavigation();
        const router = mockRouter();

        trackNavigation("/a");
        trackNavigation("/b");
        trackNavigation("/c");

        goBack(router, "/fallback");

        expect(router.push).toHaveBeenCalledWith("/b");
    });

    it("falls back to the given path when there's no previous page to go back to", async () => {
        const { goBack } = await freshNavigation();
        const router = mockRouter();

        goBack(router, "/fallback");

        expect(router.push).toHaveBeenCalledWith("/fallback");
    });

    it("falls back when only the current page has been tracked", async () => {
        const { trackNavigation, goBack } = await freshNavigation();
        const router = mockRouter();

        trackNavigation("/a");
        goBack(router, "/fallback");

        expect(router.push).toHaveBeenCalledWith("/fallback");
    });

    it("skips the next trackNavigation call triggered by goBack's own router.push", async () => {
        const { trackNavigation, goBack } = await freshNavigation();
        const router = mockRouter();

        trackNavigation("/a");
        trackNavigation("/b");
        trackNavigation("/c");

        goBack(router, "/fallback");
        // Simulates the router's afterEach hook firing for the navigation goBack just triggered.
        trackNavigation("/b");

        // The skipped re-track should not have re-added "/b": going back again should
        // still see the stack as [a, b], landing on "/a", not staying on "/b".
        goBack(router, "/fallback");

        expect(router.push).toHaveBeenLastCalledWith("/a");
    });

    it("tracks a path normally once the skip has been consumed", async () => {
        const { trackNavigation, goBack } = await freshNavigation();
        const router = mockRouter();

        trackNavigation("/a");
        trackNavigation("/b");
        goBack(router, "/fallback"); // sets the skip flag, stack -> [a]
        trackNavigation("/a"); // simulates the router's afterEach for that goBack nav: skipped, consumes the flag
        trackNavigation("/c"); // a genuine new navigation: not skipped, stack -> [a, c]

        goBack(router, "/fallback");

        expect(router.push).toHaveBeenLastCalledWith("/a");
    });
});
