import { ref } from "vue";
import { defineStore } from "pinia";
import type { Platform } from "@/models/serie";
import storageService from "@/services/storageService";

const STORAGE_KEY = "platforms";

// Matches the nightly updatePlatforms cron - a shorter TTL wouldn't surface changes any faster,
// since the underlying data on the backend itself only refreshes once a day.
const PLATFORMS_TTL_MS = 24 * 60 * 60 * 1000;

/** Global reference list of streaming platforms - persisted across reloads, refreshed daily like the backend sync. */
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
