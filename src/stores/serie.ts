import { ref } from "vue";
import { defineStore } from "pinia";
import type { Kind, Platform } from "@/models/serie";
import type { Note } from "@/models/note";
import type { User } from "@/models/user";

export const useSerieStore = defineStore("serie", () => {

    const filterCountries = ref<string[]>([]);
    const filterKinds = ref<Kind[]>([]);
    const filterPlatforms = ref<Platform[]>([]);
    const filterTitle = ref<string>();
    const filterNotes = ref<Note[]>([]);
    const filterFriends = ref<User[]>([]);

    const reset = () => {
        filterKinds.value = [];
        filterPlatforms.value = [];
        filterTitle.value = undefined;
        filterCountries.value = [];
        filterNotes.value = [];
        filterFriends.value = [];
    }

    const hasChanges = (): boolean => !!filterKinds.value.length
    || !!filterPlatforms.value.length
    || !!filterCountries.value.length
    || !!filterNotes.value.length
    || !!filterFriends.value.length
    || !!filterTitle.value;

    const formatKinds = (): string|undefined => {
        return filterKinds.value.length ? filterKinds.value.map((kind) => kind.value).join(",") : undefined;
    }

    const formatPlatforms = (): string|undefined => {
        return filterPlatforms.value.length ? filterPlatforms.value.map((platform) => `${platform.id}`).join(",") : undefined;
    }

    const formatNotes = (): string|undefined => {
        return filterNotes.value.length ? filterNotes.value.map((note) => `${note.id}`).join(",") : undefined;
    }

    const formatFriends = (): string|undefined => {
        return filterFriends.value.length ? filterFriends.value.map((friend) => friend.id).join(",") : undefined;
    }

    const formatCountries = (): string|undefined => {
        return filterCountries.value.length ? filterCountries.value.join(",") : undefined;
    }

    return {
        filterCountries,
        filterNotes,
        filterKinds,
        filterPlatforms,
        filterTitle,
        filterFriends,
        formatKinds,
        formatNotes,
        formatPlatforms,
        formatFriends,
        formatCountries,
        hasChanges,
        reset
    };
});