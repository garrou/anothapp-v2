import type { Season, SeasonDetail, WatchTogetherInvite } from "@/models/season";
import type { Serie } from "@/models/serie";
import serieService from "@/services/serieService";
import type { SeasonSearchOptions } from "@/models/search";
import { isError } from "@/utils/response";
import { useSnackbar } from "./snackbar";
import seasonService from "@/services/seasonService";
import { fromDatetimeLocalInput } from "@/utils/format";

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

    const getSeasonWatchedTime = async (id: number, num: number): Promise<number> => {
        const resp = await serieService.getSeasonWatchedTime(id, num);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data.time;
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

        const resp = await seasonService.updateSeason(id, platformId, fromDatetimeLocalInput(viewedAt));

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        showSuccess("Saison modifiée");
        return true;
    }

    const updateWatchedWith = async (id: number, friendIds: string[]): Promise<void> => {
        const resp = await seasonService.updateWatchedWith(id, friendIds);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
    }

    const getWatchedWith = async (status: "pending" | "active"): Promise<WatchTogetherInvite[]> => {
        const resp = await seasonService.getWatchedWith(status);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const respondToWatchedWith = async (userSeasonId: number, accepted: boolean): Promise<void> => {
        const resp = await seasonService.respondToWatchedWith(userSeasonId, accepted);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        // wording works both for declining a pending invite and for leaving one already accepted
        showSuccess(accepted ? "Visionnage partagé accepté" : "Visionnage partagé arrêté");
    }

    return {
        addSeason,
        deleteSeason,
        getSeasonsBySerieId,
        getSeasonInfosBySerieIdByNumber,
        getSeasonWatchedTime,
        getWatchedWith,
        respondToWatchedWith,
        updateSeason,
        updateWatchedWith
    }
}