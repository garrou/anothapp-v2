import { ref } from "vue";
import { defineStore } from "pinia";
import type { Note } from "@/models/note";

/** Global reference list of rating notes. */
export const useNotesStore = defineStore("notes", () => {

    const notes = ref<Note[]>([]);
    const loaded = ref(false);

    const setAll = (list: Note[]): void => {
        notes.value = list;
        loaded.value = true;
    }

    const reset = (): void => {
        notes.value = [];
        loaded.value = false;
    }

    return { notes, loaded, setAll, reset };
});
