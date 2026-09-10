import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useSearchStore } from "./search";
import { DEFAULT_LIMIT } from "@/constants/services";
import type { Kind, Platform } from "@/models/serie";

const kind = (value: string): Kind => ({ name: value, value });
const platform = (id: number): Platform => ({ id, name: "Platform " + id } as Platform);

beforeEach(() => {
    setActivePinia(createPinia());
});

describe("useSearchStore", () => {
    it("defaults to no filters and the default limit", () => {
        const store = useSearchStore();

        expect(store.filterKinds).toEqual([]);
        expect(store.filterPlatforms).toEqual([]);
        expect(store.filterLimit).toBe(DEFAULT_LIMIT);
        expect(store.filterTitle).toBeUndefined();
        expect(store.hasChanges()).toBe(false);
    });

    it.each([
        ["filterKinds", () => useSearchStore().filterKinds.push(kind("drama"))],
        ["filterPlatforms", () => useSearchStore().filterPlatforms.push(platform(1))],
        ["filterTitle", () => { useSearchStore().filterTitle = "Breaking Bad"; }],
    ])("hasChanges is true once %s is set", (_label, mutate) => {
        const store = useSearchStore();
        mutate();

        expect(store.hasChanges()).toBe(true);
    });

    it("hasChanges is true when the limit differs from the default", () => {
        const store = useSearchStore();
        store.filterLimit = DEFAULT_LIMIT + 10;

        expect(store.hasChanges()).toBe(true);
    });

    it("reset clears every filter and restores the default limit", () => {
        const store = useSearchStore();
        store.filterKinds.push(kind("drama"));
        store.filterPlatforms.push(platform(1));
        store.filterLimit = DEFAULT_LIMIT + 10;
        store.filterTitle = "Breaking Bad";

        store.reset();

        expect(store.filterKinds).toEqual([]);
        expect(store.filterPlatforms).toEqual([]);
        expect(store.filterLimit).toBe(DEFAULT_LIMIT);
        expect(store.filterTitle).toBeUndefined();
        expect(store.hasChanges()).toBe(false);
    });

    it("formatKinds joins selected kind values, or undefined when empty", () => {
        const store = useSearchStore();
        expect(store.formatKinds()).toBeUndefined();

        store.filterKinds.push(kind("drama"), kind("comedy"));
        expect(store.formatKinds()).toBe("drama,comedy");
    });

    it("formatPlatforms joins selected platform ids, or undefined when empty", () => {
        const store = useSearchStore();
        expect(store.formatPlatforms()).toBeUndefined();

        store.filterPlatforms.push(platform(1), platform(2));
        expect(store.formatPlatforms()).toBe("1,2");
    });
});
