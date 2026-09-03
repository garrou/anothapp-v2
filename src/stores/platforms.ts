import { ref } from "vue";
import { defineStore } from "pinia";
import type { Platform } from "@/models/serie";
import storageService from "@/services/storageService";

const STORAGE_KEY = "platforms";

export const usePlatformsStore = defineStore("platforms", () => {

    const stored = storageService.getCachedList<Platform>(STORAGE_KEY);
    const platforms = ref<Platform[]>(stored ?? []);
    const loaded = ref(stored !== null);

    const setAll = (list: Platform[]): void => {
        platforms.value = list;
        loaded.value = true;
        storageService.storeCachedList(STORAGE_KEY, list);
    }

    const reset = (): void => {
        platforms.value = [];
        loaded.value = false;
    }

    return { platforms, loaded, setAll, reset };
});
