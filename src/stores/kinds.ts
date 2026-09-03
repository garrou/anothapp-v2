import { ref } from "vue";
import { defineStore } from "pinia";
import type { Kind } from "@/models/serie";
import storageService from "@/services/storageService";

const STORAGE_KEY = "kinds";

export const useKindsStore = defineStore("kinds", () => {

    const stored = storageService.getCachedList<Kind>(STORAGE_KEY);
    const kinds = ref<Kind[]>(stored ?? []);
    const loaded = ref(stored !== null);

    const setAll = (list: Kind[]): void => {
        kinds.value = list;
        loaded.value = true;
        storageService.storeCachedList(STORAGE_KEY, list);
    }

    const reset = (): void => {
        kinds.value = [];
        loaded.value = false;
    }

    return { kinds, loaded, setAll, reset };
});
