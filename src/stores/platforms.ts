import { ref } from "vue";
import { defineStore } from "pinia";
import type { Platform } from "@/models/serie";

/** Global reference list of streaming platforms. */
export const usePlatformsStore = defineStore("platforms", () => {

    const platforms = ref<Platform[]>([]);
    const loaded = ref(false);

    const setAll = (list: Platform[]): void => {
        platforms.value = list;
        loaded.value = true;
    }

    const reset = (): void => {
        platforms.value = [];
        loaded.value = false;
    }

    return { platforms, loaded, setAll, reset };
});
