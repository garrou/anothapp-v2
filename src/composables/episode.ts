import type { UserEpisode } from "@/models/userEpisode";
import episodeService from "@/services/episodeService";
import serieService from "@/services/serieService";
import { isError } from "@/utils/response";

export function useEpisode() {

    const getEpisodesBySerieIdBySeason = async (id: number, num: number): Promise<UserEpisode[]> => {
        const resp = await serieService.getEpisodesBySerieIdBySeason(id, num);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const watchEpisode = async (id: number): Promise<number> => {
        const resp = await episodeService.watchEpisode(id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data.views;
    }

    const unwatchEpisode = async (id: number): Promise<number> => {
        const resp = await episodeService.unwatchEpisode(id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data.views;
    }

    return {
        getEpisodesBySerieIdBySeason,
        watchEpisode,
        unwatchEpisode
    }
}
