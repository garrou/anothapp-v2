import { ref } from "vue";
import { defineStore } from "pinia";
import type { Serie } from "@/models/serie";

export const useSeriesCatalogStore = defineStore("seriesCatalog", () => {

    const series = ref<Map<number, Serie>>(new Map());
    const loaded = ref(false);

    const setAll = (list: Serie[]): void => {
        series.value = new Map(list.map((serie) => [serie.id, serie]));
        loaded.value = true;
    }

    const upsert = (serie: Serie): void => {
        series.value.set(serie.id, serie);
    }

    const reset = (): void => {
        series.value = new Map();
        loaded.value = false;
    }

    return { series, loaded, setAll, upsert, reset };
});
