import type { UserEpisode } from "@/models/userEpisode";
import type { EpisodeTimeline } from "@/models/episodeTimeline";
import episodeService from "@/services/episodeService";
import seasonService from "@/services/seasonService";
import { isError } from "@/utils/response";

export function useEpisode() {

    const getEpisodesTimeline = async (month: number): Promise<EpisodeTimeline[]> => {
        const resp = await episodeService.getViewedByMonthAgo(month);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getEpisodesBySeasonId = async (userSeasonId: number): Promise<UserEpisode[]> => {
        const resp = await seasonService.getEpisodesBySeasonId(userSeasonId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const addEpisodeViewing = async (userSeasonId: number, episodeId: number): Promise<void> => {
        const resp = await seasonService.addEpisodeViewing(userSeasonId, episodeId);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
    }

    const updateEpisodeViewing = async (id: number, watchedAt: string): Promise<void> => {
        const resp = await episodeService.updateViewing(id, watchedAt);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
    }

    const deleteEpisodeViewing = async (id: number): Promise<void> => {
        const resp = await episodeService.deleteViewing(id);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
    }

    return {
        getEpisodesTimeline,
        getEpisodesBySeasonId,
        addEpisodeViewing,
        updateEpisodeViewing,
        deleteEpisodeViewing
    }
}
