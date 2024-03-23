import type { Season, SeasonInfos } from "@/models/season";
import type { Serie } from "@/models/serie";
import serieService from "@/services/serieService";
import type { SeasonSearchOptions } from "@/types/search";
import { isError } from "@/utils/response";
import { useSnackbar } from "./snackbar";

export function useSeason() {

    const snackbar = useSnackbar();

    const getSeasonsBySerieId = async (options: SeasonSearchOptions): Promise<Season[]> => {
        const { serieId } = options;

        const resp = await serieService.getSeasonsBySerieId(serieId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeasonInfosBySerieIdByNumber = async (id: number, num: number): Promise<SeasonInfos> => {
        const resp = await serieService.getSeasonInfosBySerieIdByNumber(id, num);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const addSeason = async (serie: Serie, season: Season): Promise<void> => {
        const resp = await serieService.addSeason(serie.id, season);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        snackbar.showSuccess(`"${serie.title}" saison ${season.number} ajoutée`);
        return data;
    }

    return { addSeason, getSeasonsBySerieId, getSeasonInfosBySerieIdByNumber }
}