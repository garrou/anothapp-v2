import { ref } from "vue";
import { defineStore } from "pinia";

export const useActorStore = defineStore("actor", () => {

    const favoriteActorIds = ref<Set<number>>(new Set());
    const loaded = ref(false);

    const setFavoriteActorIds = (ids: number[]): void => {
        favoriteActorIds.value = new Set(ids);
        loaded.value = true;
    }

    const addFavoriteActorId = (id: number): void => {
        favoriteActorIds.value.add(id);
    }

    const removeFavoriteActorId = (id: number): void => {
        favoriteActorIds.value.delete(id);
    }

    const isFavorite = (id: number): boolean => favoriteActorIds.value.has(id);

    const reset = (): void => {
        favoriteActorIds.value = new Set();
        loaded.value = false;
    }

    return {
        favoriteActorIds,
        loaded,
        setFavoriteActorIds,
        addFavoriteActorId,
        removeFavoriteActorId,
        isFavorite,
        reset
    };
});
