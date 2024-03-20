import type { Season } from "@/models/internal/season";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSeasonStore = defineStore("season", () => {
    const seasons = ref(new Map<number, Season[]>());

    const getSeasonsBySerieId = (id: number): Season[] => {
        return seasons.value.get(id) ?? [];
    }

    const isNotEmpty = (): boolean => {
        return seasons.value.size > 0;
    }

    const setSeasons = (id: number, seas: Season[]): void => {
        seasons.value.set(id, seas);
    }

    return { getSeasonsBySerieId, isNotEmpty, setSeasons }
});