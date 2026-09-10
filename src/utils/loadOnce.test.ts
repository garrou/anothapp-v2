import { describe, it, expect, vi } from "vitest";
import { loadOnce, currentEpoch, invalidateLoad } from "./loadOnce";

describe("loadOnce", () => {
    it("doesn't call load when isLoaded already returns true", async () => {
        const load = vi.fn().mockResolvedValue(undefined);

        await loadOnce("already-loaded", () => true, load);

        expect(load).not.toHaveBeenCalled();
    });

    it("calls load once when isLoaded returns false", async () => {
        const load = vi.fn().mockResolvedValue(undefined);

        await loadOnce("not-loaded", () => false, load);

        expect(load).toHaveBeenCalledTimes(1);
    });

    it("dedupes concurrent calls into a single in-flight load", async () => {
        let resolveLoad: () => void = () => {};
        const load = vi.fn().mockImplementation(() => new Promise<void>((resolve) => {
            resolveLoad = resolve;
        }));

        const first = loadOnce("concurrent", () => false, load);
        const second = loadOnce("concurrent", () => false, load);

        resolveLoad();
        await Promise.all([first, second]);

        expect(load).toHaveBeenCalledTimes(1);
    });

    it("calls load again on a later, separate call once isLoaded is false again", async () => {
        const load = vi.fn().mockResolvedValue(undefined);

        await loadOnce("sequential", () => false, load);
        await loadOnce("sequential", () => false, load);

        expect(load).toHaveBeenCalledTimes(2);
    });
});

describe("currentEpoch / invalidateLoad", () => {
    it("starts at epoch 0 for an unknown key", () => {
        expect(currentEpoch("fresh-key")).toBe(0);
    });

    it("increments the epoch on each invalidation", () => {
        invalidateLoad("epoch-key");
        expect(currentEpoch("epoch-key")).toBe(1);

        invalidateLoad("epoch-key");
        expect(currentEpoch("epoch-key")).toBe(2);
    });

    it("clears a pending load so a concurrent call starts a fresh one", async () => {
        const resolvers: (() => void)[] = [];
        const load = vi.fn().mockImplementation(() => new Promise<void>((resolve) => {
            resolvers.push(resolve);
        }));

        const first = loadOnce("invalidated-mid-flight", () => false, load);
        invalidateLoad("invalidated-mid-flight");
        const second = loadOnce("invalidated-mid-flight", () => false, load);

        resolvers.forEach((resolve) => resolve());
        await Promise.all([first, second]);

        expect(load).toHaveBeenCalledTimes(2);
    });
});
