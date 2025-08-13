import { ref } from "vue";
import { defineStore } from "pinia";
import type { Kind, Platform } from "@/models/serie";
import type { Note } from "@/models/note";

export const useSerieStore = defineStore("serie", () => {

    const filterCountries = ref<string[]>([]);
    const filterKinds = ref<Kind[]>([]);
    const filterPlatforms = ref<Platform[]>([]);
    const filterTitle = ref<string>();
    const filterNotes = ref<Note[]>([]);

    const reset = () => {
        filterKinds.value = [];
        filterPlatforms.value = [];
        filterTitle.value = undefined;
        filterCountries.value = [];
        filterNotes.value = [];
    }

    const hasChanges = (): boolean => !!filterKinds.value.length 
    || !!filterPlatforms.value.length
    || !!filterCountries.value.length
    || !!filterNotes.value.length
    || !!filterTitle.value;

    const formatKinds = (): string|undefined => {
        return filterKinds.value.length ? filterKinds.value.map((kind) => kind.name).join(",") : undefined;
    }

    const formatPlatforms = (): string|undefined => {
        return filterPlatforms.value.length ? filterPlatforms.value.map((platform) => `${platform.id}`).join(",") : undefined;
    }

    const formatNotes = (): string|undefined => {
        return filterNotes.value.length ? filterNotes.value.map((note) => `${note.id}`).join(",") : undefined;
    }

    return {
        filterCountries,
        filterNotes,
        filterKinds,
        filterPlatforms,
        filterTitle,
        formatKinds,
        formatNotes,
        formatPlatforms,
        hasChanges,
        reset
    };
});