import type { Season } from "@/models/season";
import type { Serie } from "@/models/serie";
import searchService from "@/services/searchService";
import type { SerieSearchOptions } from "@/types/search";
import { isError } from "@/utils/response";

export function useSearch() {

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

    return { getSeasonsBySerieId, getSeries }
}