import type { Season, SeasonDetail, SeasonTimeline } from "@/models/season";
import type { Serie } from "@/models/serie";
import serieService from "@/services/serieService";
import type { SeasonSearchOptions } from "@/models/search";
import { isError } from "@/utils/response";
import { useSnackbar } from "./snackbar";
import seasonService from "@/services/seasonService";
import { formatDateTime } from "@/utils/format";

export function useSeason() {

    const { showSuccess } = useSnackbar();

    const deleteSeason = async (id: number): Promise<void> => {
        const resp = await seasonService.deleteSeasonById(id);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        showSuccess("Visionnage supprimé");
    }

    const getSeasonsTimeline = async (month: number): Promise<SeasonTimeline[]> => {
        const resp = await seasonService.getSeasons(undefined, month);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeasonsBySerieId = async (options: SeasonSearchOptions): Promise<Season[]> => {
        const { serieId } = options;

        if (!serieId)
            throw new Error("Impossible de récupérer les données");

        const resp = await serieService.getSeasonsBySerieId(serieId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeasonInfosBySerieIdByNumber = async (id: number, num: number): Promise<SeasonDetail[]> => {
        const resp = await serieService.getSeasonInfosBySerieIdByNumber(id, num);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const addSeason = async (serie: Serie, season: Season): Promise<void> => {
        const resp = await serieService.addSeason(serie.id, season.number);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        showSuccess(`"${serie.title}" saison ${season.number} ajoutée`);
    }

    const updateSeason = async (id: number, platformId?: number, viewedAt?: string): Promise<boolean> => {
        if (!platformId || !viewedAt)
            throw new Error("Impossible de modifier la saison");

        const resp = await seasonService.updateSeason(id, platformId, formatDateTime(viewedAt));

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        showSuccess("Saison modifiée");
        return true;
    }

    return {
        addSeason,
        deleteSeason,
        getSeasonsBySerieId,
        getSeasonsTimeline,
        getSeasonInfosBySerieIdByNumber,
        updateSeason
    }
}