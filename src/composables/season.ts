import type { Season } from "@/models/internal/season";
import serieService from "@/services/serieService";
import type { SeasonSearchOptions } from "@/types/search";
import { isError } from "@/utils/response";

export function useSeason() {

    const getSeasonsBySerieId = async (options: SeasonSearchOptions): Promise<Season[]> => {
        const { serieId } = options;

        const resp = await serieService.getSeasonsBySerieId(serieId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    return { getSeasonsBySerieId }
}