import type { GlobalStat, Stat } from "@/models/stat";
import statService from "@/services/statService"
import { isError } from "@/utils/response";

export function useStatistic() {

    const getStats = async (): Promise<GlobalStat> => {
        const resp = await statService.getStats();
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeasonsMonthCurrYear = async (): Promise<Stat[]> => {
        const resp = await statService.getGroupedCountByTypeByPeriod("seasons", "year");
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getEpisodesMonthCurrYear = async (): Promise<Stat[]> => {
        const resp = await statService.getGroupedCountByTypeByPeriod("episodes", "year");
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getTimeByYears = async (): Promise<Stat[]> => {
        const resp = await statService.getTimeByType("years");
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeasonsYears = async (): Promise<Stat[]> => {
        const resp = await statService.getGroupedCountByTypeByPeriod("seasons", "years");
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getEpisodesYears = async (): Promise<Stat[]> => {
        const resp = await statService.getGroupedCountByTypeByPeriod("episodes", "years");
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeasonsMonths = async (): Promise<Stat[]> => {
        const resp = await statService.getGroupedCountByTypeByPeriod("seasons", "months");
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeriesRanking = async (): Promise<Stat[]> => {
        const resp = await statService.getTimeByType("rank");
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeriesKinds = async (): Promise<Stat[]> => {
        const resp = await statService.getGroupedCountByTypeByPeriod("kinds", null);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    return { 
        getEpisodesMonthCurrYear, 
        getEpisodesYears, 
        getSeasonsMonths,
        getSeasonsMonthCurrYear, 
        getSeasonsYears, 
        getSeriesKinds,
        getSeriesRanking,
        getStats, 
        getTimeByYears 
    }
}