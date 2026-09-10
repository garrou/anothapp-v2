import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useSerieStore } from "./serie";
import type { Kind, Platform } from "@/models/serie";
import type { Note } from "@/models/note";
import type { User } from "@/models/user";

const kind = (value: string): Kind => ({ name: value, value });
const platform = (id: number): Platform => ({ id, name: "Platform " + id } as Platform);
const note = (id: number): Note => ({ id, name: "Note " + id } as Note);
const friend = (id: string): User => ({ id, username: "friend" + id, current: false } as User);

beforeEach(() => {
    setActivePinia(createPinia());
});

describe("useSerieStore", () => {
    it("defaults to no filters", () => {
        const store = useSerieStore();

        expect(store.filterCountries).toEqual([]);
        expect(store.filterKinds).toEqual([]);
        expect(store.filterPlatforms).toEqual([]);
        expect(store.filterNotes).toEqual([]);
        expect(store.filterFriends).toEqual([]);
        expect(store.filterTitle).toBeUndefined();
        expect(store.hasChanges()).toBe(false);
    });

    it.each([
        ["filterKinds", () => useSerieStore().filterKinds.push(kind("drama"))],
        ["filterPlatforms", () => useSerieStore().filterPlatforms.push(platform(1))],
        ["filterCountries", () => useSerieStore().filterCountries.push("France")],
        ["filterNotes", () => useSerieStore().filterNotes.push(note(1))],
        ["filterFriends", () => useSerieStore().filterFriends.push(friend("f1"))],
        ["filterTitle", () => { useSerieStore().filterTitle = "Breaking Bad"; }],
    ])("hasChanges is true once %s is set", (_label, mutate) => {
        const store = useSerieStore();
        mutate();

        expect(store.hasChanges()).toBe(true);
    });

    it("reset clears every filter", () => {
        const store = useSerieStore();
        store.filterKinds.push(kind("drama"));
        store.filterPlatforms.push(platform(1));
        store.filterCountries.push("France");
        store.filterNotes.push(note(1));
        store.filterFriends.push(friend("f1"));
        store.filterTitle = "Breaking Bad";

        store.reset();

        expect(store.filterCountries).toEqual([]);
        expect(store.filterKinds).toEqual([]);
        expect(store.filterPlatforms).toEqual([]);
        expect(store.filterNotes).toEqual([]);
        expect(store.filterFriends).toEqual([]);
        expect(store.filterTitle).toBeUndefined();
        expect(store.hasChanges()).toBe(false);
    });

    it("formatKinds joins selected kind values, or undefined when empty", () => {
        const store = useSerieStore();
        expect(store.formatKinds()).toBeUndefined();

        store.filterKinds.push(kind("drama"), kind("comedy"));
        expect(store.formatKinds()).toBe("drama,comedy");
    });

    it("formatPlatforms joins selected platform ids, or undefined when empty", () => {
        const store = useSerieStore();
        expect(store.formatPlatforms()).toBeUndefined();

        store.filterPlatforms.push(platform(1), platform(2));
        expect(store.formatPlatforms()).toBe("1,2");
    });

    it("formatNotes joins selected note ids, or undefined when empty", () => {
        const store = useSerieStore();
        expect(store.formatNotes()).toBeUndefined();

        store.filterNotes.push(note(1), note(2));
        expect(store.formatNotes()).toBe("1,2");
    });

    it("formatFriends joins selected friend ids, or undefined when empty", () => {
        const store = useSerieStore();
        expect(store.formatFriends()).toBeUndefined();

        store.filterFriends.push(friend("f1"), friend("f2"));
        expect(store.formatFriends()).toBe("f1,f2");
    });

    it("formatCountries joins selected countries, or undefined when empty", () => {
        const store = useSerieStore();
        expect(store.formatCountries()).toBeUndefined();

        store.filterCountries.push("France", "USA");
        expect(store.formatCountries()).toBe("France,USA");
    });
});
