import type { GlobalStat, Stat } from "@/models/stat";
import statService from "@/services/statService"
import { isError } from "@/utils/response";

export function useStatistic() {

    const getStats = async (userId?: string): Promise<GlobalStat> => {
        const resp = await statService.getStats(userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeasonsMonthCurrYear = async (userId?: string): Promise<Stat[]> => {
        const resp = await statService.getGroupedCountByTypeByPeriod("seasons", "year", userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getEpisodesMonthCurrYear = async (userId?: string): Promise<Stat[]> => {
        const resp = await statService.getGroupedCountByTypeByPeriod("episodes", "year", userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getTimeByYears = async (userId?: string): Promise<Stat[]> => {
        const resp = await statService.getTimeByType("years", userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeasonsYears = async (userId?: string): Promise<Stat[]> => {
        const resp = await statService.getGroupedCountByTypeByPeriod("seasons", "years", userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getEpisodesYears = async (userId?: string): Promise<Stat[]> => {
        const resp = await statService.getGroupedCountByTypeByPeriod("episodes", "years", userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeasonsMonths = async (userId?: string): Promise<Stat[]> => {
        const resp = await statService.getGroupedCountByTypeByPeriod("seasons", "months", userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeriesRanking = async (userId?: string): Promise<Stat[]> => {
        const resp = await statService.getTimeByType("rank", userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeasonsPlatforms = async (userId?: string): Promise<Stat[]> => {
        const resp = await statService.getGroupedCountByTypeByPeriod("platforms", undefined, userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeriesKinds = async (userId?: string): Promise<Stat[]> => {
        const resp = await statService.getGroupedCountByTypeByPeriod("kinds", undefined, userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeriesCountries = async (userId?: string): Promise<Stat[]> => {
        const resp = await statService.getGroupedCountByTypeByPeriod("countries", undefined, userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getBestMonths = async (userId?: string): Promise<Stat[]> => {
        const resp = await statService.getGroupedCountByTypeByPeriod("best-months", undefined, userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    return { 
        getBestMonths,
        getEpisodesMonthCurrYear, 
        getEpisodesYears, 
        getSeasonsMonths,
        getSeasonsMonthCurrYear, 
        getSeasonsPlatforms,
        getSeasonsYears, 
        getSeriesCountries,
        getSeriesKinds,
        getSeriesRanking,
        getStats, 
        getTimeByYears 
    }
}