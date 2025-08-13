import type { Actor, Character } from "@/models/person";
import type { Season } from "@/models/season";
import type { Kind, Platform, Serie, Similar } from "@/models/serie";
import searchService from "@/services/searchService";
import { isError } from "@/utils/response";
import cache from "@/cache";
import { useSearchStore } from "@/stores/search";
import type { Note } from "@/models/note";

export function useSearch() {

    const searchStore = useSearchStore();

    const getActor = async (id: number): Promise<Actor> => {
        const resp = await searchService.getActor(id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getCharacters = async (id: number): Promise<Character[]> => {
        const resp = await searchService.getCharacters(id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getKinds = async (): Promise<Kind[]> => {
        return cache.kinds.getKinds();
    }

    const getNotes = async (): Promise<Note[]> => {
        return cache.notes.getNotes();
    }

    const getPlatforms = async (): Promise<Platform[]> => {
        return cache.platforms.getPlatforms();
    }

    const getSerie = async (id: number): Promise<Serie> => {
        return cache.series.getSerieById(id);
    }

    const getSerieImages = async (id: number): Promise<string[]> => {
        const resp = await searchService.getSerieImages(id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeries = async (): Promise<Serie[]> => {
        const { filterTitle, filterLimit, formatKinds, formatPlatforms } = searchStore;
        const kinds = formatKinds();
        const platforms = formatPlatforms();

        if (filterTitle || kinds || platforms) {
            const resp = await searchService.getSeries(filterTitle, kinds, platforms, filterLimit);
            const data = await resp.json();

            if (isError(resp.status))
                throw new Error(data.message);

            return data;
        }
        return cache.series.getSeries();
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

    const getImages = async (limit: number): Promise<string[]> => {
        const resp = await searchService.getImages(limit);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getEpisodes = async (id: number, season: number) => {
        const resp = await searchService.getEpisodesBySerieIdBySeason(id, season);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    return {
        getActor,
        getCharacters,
        getEpisodes,
        getImages,
        getKinds,
        getNotes,
        getPlatforms,
        getSeasonsBySerieId,
        getSerie,
        getSerieImages,
        getSeries,
        getSimilarsSeries
    }
}