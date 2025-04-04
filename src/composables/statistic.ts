import type { GlobalStat, Stat } from "@/models/stat";
import statService from "@/services/statService"
import { ChartGroupedPeriod, ChartGroupedType, ChartTimeType } from "@/types/types";
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
        const resp = await statService.getGroupedCountByTypeByPeriod(ChartGroupedType.Seasons, ChartGroupedPeriod.Year, userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getEpisodesMonthCurrYear = async (userId?: string): Promise<Stat[]> => {
        const resp = await statService.getGroupedCountByTypeByPeriod(ChartGroupedType.Episodes, ChartGroupedPeriod.Year, userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getTimeByYears = async (userId?: string): Promise<Stat[]> => {
        const resp = await statService.getTimeByType(ChartTimeType.Years, userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeasonsYears = async (userId?: string): Promise<Stat[]> => {
        const resp = await statService.getGroupedCountByTypeByPeriod(ChartGroupedType.Seasons, ChartGroupedPeriod.Years, userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getEpisodesYears = async (userId?: string): Promise<Stat[]> => {
        const resp = await statService.getGroupedCountByTypeByPeriod(ChartGroupedType.Episodes, ChartGroupedPeriod.Years, userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeasonsMonths = async (userId?: string): Promise<Stat[]> => {
        const resp = await statService.getGroupedCountByTypeByPeriod(ChartGroupedType.Seasons, ChartGroupedPeriod.Months, userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeriesRanking = async (userId?: string): Promise<Stat[]> => {
        const resp = await statService.getTimeByType(ChartTimeType.Rank, userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeasonsPlatforms = async (userId?: string): Promise<Stat[]> => {
        const resp = await statService.getGroupedCountByTypeByPeriod(ChartGroupedType.Platforms, undefined, userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeriesKinds = async (userId?: string): Promise<Stat[]> => {
        const resp = await statService.getGroupedCountByTypeByPeriod(ChartGroupedType.Kinds, undefined, userId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getSeriesCountries = async (limit: number, userId?: string): Promise<Stat[]> => {
        const resp = await statService.getGroupedCountByTypeByPeriod(ChartGroupedType.Countries, undefined, userId, limit);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getBestMonths = async (userId?: string): Promise<Stat[]> => {
        const resp = await statService.getGroupedCountByTypeByPeriod(ChartGroupedType.BestMonths, undefined, userId);
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