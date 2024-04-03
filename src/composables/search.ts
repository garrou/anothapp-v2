import type { Character } from "@/models/person";
import type { Season } from "@/models/season";
import type { Serie, Similar } from "@/models/serie";
import searchService from "@/services/searchService";
import type { SerieSearchOptions } from "@/types/search";
import { isError } from "@/utils/response";

export function useSearch() {

    const getCharacters = async (id: number): Promise<Character[]> => {
        const resp = await searchService.getCharacters(id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSerie = async (id: number): Promise<Serie> => {
        const resp = await searchService.getSerie(id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSerieImages = async (id: number): Promise<string[]> => {
        const resp = await searchService.getSerieImages(id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeries = async (options: SerieSearchOptions): Promise<Serie[]> => {
        const resp = await searchService.getSeries(options.title);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }
    
    const getSeasonsBySerieId = async (id: number): Promise<Season[]> => {
        const resp = await searchService.getSeasonsBySerieId(id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSimilarsSeries = async (id: number): Promise<Similar[]> => {
        const resp = await searchService.getSimilarsSeries(id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    return { getCharacters, getSeasonsBySerieId, getSerie, getSerieImages, getSeries, getSimilarsSeries }
}