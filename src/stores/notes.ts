import { ref } from "vue";
import { defineStore } from "pinia";
import type { Note } from "@/models/note";
import storageService from "@/services/storageService";

const STORAGE_KEY = "notes";

export const useNotesStore = defineStore("notes", () => {

    const stored = storageService.getCachedList<Note>(STORAGE_KEY);
    const notes = ref<Note[]>(stored ?? []);
    const loaded = ref(stored !== null);

    const setAll = (list: Note[]): void => {
        notes.value = list;
        loaded.value = true;
        storageService.storeCachedList(STORAGE_KEY, list);
    }

    const reset = (): void => {
        notes.value = [];
        loaded.value = false;
    }

    return { notes, loaded, setAll, reset };
});
