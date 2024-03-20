import type { Season } from "@/models/internal/season";
import type { Serie } from "@/models/internal/serie";
import serieService from "@/services/serieService"
import { useSerieStore } from "@/stores/serie";
import type { SearchOptions } from "@/types/search";
import { isError } from "@/utils/response";

export function useSerie() {
    const serieStore = useSerieStore();

    const getSeries = async (options: SearchOptions = {}): Promise<Serie[]> => {
        const { refresh, title, kind } = options;

        if (title)
            return serieStore.getSeriesByTitle(title);

        if (!refresh && serieStore.isNotEmpty())
            return serieStore.getSeries();

        const resp = await serieService.getSeries(title, kind);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        serieStore.setSeries(data);
        return data;
    }

    const getSeasonsBySerieId = async (id: number): Promise<Season[]> => {
        const resp = await serieService.getSeasonsBySerieId(id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const updateFavoriteBySerieId = async (id: number): Promise<boolean> => {
        const resp = await serieService.updateFavoriteBySerieId(id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return true;
    }

    return { getSeasonsBySerieId, getSeries, updateFavoriteBySerieId }
}