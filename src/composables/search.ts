import type { Season } from "@/models/internal/season";
import searchService from "@/services/searchService";
import { isError } from "@/utils/response";

export function useSearch() {
    
    const getSeasonsBySerieId = async (id: number): Promise<Season[]> => {
        const resp = await searchService.getSeasonsBySerieId(id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    return { getSeasonsBySerieId }
}