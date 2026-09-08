import { ref } from "vue";
import { defineStore } from "pinia";
import type { Platform } from "@/models/serie";
import storageService from "@/services/storageService";

const STORAGE_KEY = "platforms";

const PLATFORMS_TTL_MS = 24 * 60 * 60 * 1000;

export const usePlatformsStore = defineStore("platforms", () => {

    const stored = storageService.getCachedList<Platform>(STORAGE_KEY);
    const platforms = ref<Platform[]>(stored ?? []);
    const loaded = ref(stored !== null);

    const setAll = (list: Platform[]): void => {
        platforms.value = list;
        loaded.value = true;
        storageService.storeCachedList(STORAGE_KEY, list, PLATFORMS_TTL_MS);
    }

    const reset = (): void => {
        platforms.value = [];
        loaded.value = false;
        storageService.clearCachedList(STORAGE_KEY);
    }

    return { platforms, loaded, setAll, reset };
});
