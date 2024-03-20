import type { Season } from "@/models/internal/season";
import serieService from "@/services/serieService";
import { useSeasonStore } from "@/stores/season";
import type { SeasonSearchOptions } from "@/types/search";
import { isError } from "@/utils/response";

export function useSeason() {
    const seasonStore = useSeasonStore();

    const getSeasonsBySerieId = async (options: SeasonSearchOptions): Promise<Season[]> => {
        const { refresh, serieId } = options;

        if (!refresh && seasonStore.isNotEmpty())
            return seasonStore.getSeasonsBySerieId(serieId);

        const resp = await serieService.getSeasonsBySerieId(serieId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        seasonStore.setSeasons(serieId, data);
        return data;
    }

    return { getSeasonsBySerieId }
}