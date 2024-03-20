import { ref } from "vue"
import { defineStore } from "pinia"
import type { Serie } from "@/models/internal/serie";

export const useSerieStore = defineStore("serie", () => {
  const series = ref(new Map<number, Serie>());

  const isNotEmpty = (): boolean => {
    return series.value.size > 0;
  }

  const setSeries = (all: Serie[]) => {
    all.forEach((serie) => series.value.set(serie.id, serie));
  }

  const getSerie = (id: number): Serie => {
    const serie = series.value.get(id);

    if (!serie)
        throw new Error(`La série ${id} n'existe pas`);

    return serie;
  }

  const getSeriesByTitle = (title: string): Serie[] => {
    const regex = new RegExp("^.*" + title + ".*$", "i");
    return Array.from(series.value.values())
      .filter((serie) => regex.test(serie.title));
  }

  const getSeries = () => {
    return Array.from(series.value.values());
  }

  return { getSerie, getSeries, getSeriesByTitle, isNotEmpty, setSeries };
});