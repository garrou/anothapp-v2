import { ref } from "vue";
import { defineStore } from "pinia";

/** The current user's subscribed platform ids. */
export const useUserPlatformsStore = defineStore("userPlatforms", () => {

    const platformIds = ref<Set<number>>(new Set());
    const loaded = ref(false);

    const setAll = (ids: number[]): void => {
        platformIds.value = new Set(ids);
        loaded.value = true;
    }

    const add = (id: number): void => {
        platformIds.value.add(id);
    }

    const remove = (id: number): void => {
        platformIds.value.delete(id);
    }

    const reset = (): void => {
        platformIds.value = new Set();
        loaded.value = false;
    }

    return { platformIds, loaded, setAll, add, remove, reset };
});
