import { ChartGroupedType } from "@/types/types";

export interface GlobalStat {
    
    monthTime: number;

    totalTime: number;

    nbSeries: number;

    nbSeasons: number;

    nbEpisodes: number;

    bestMonth?: { label: string, value: number };

    seasonsMonthCurrentYear: Stat[];

    episodesMonthCurrentYear: Stat[];
    
    timeYears: Stat[];
    
    seasonsYears: Stat[];
    
    episodesYears: Stat[];
    
    seasonsMonths: Stat[];
            
    bestMonths: Stat[];
            
    seriesRankingTime: Stat[];
            
    seriesKinds: Stat[];
            
    seasonsPlatforms: Stat[];
            
    seriesCountries: Stat[];
            
    seriesNotes: Stat[];

    episodesHeatmap?: { date: string; value: number }[];
}

export interface Stat {

    id: number;

    label: string;

    value: number;
}

export interface WrappedStat {

    year: number;

    totalTime: number;

    totalEpisodes: number;

    nbNewShows: number;

    topShow: Stat | null;

    topKind: Stat | null;

    topPlatform: Stat | null;

    bestMonth: Stat | null;
}

export interface ChartData {

    id: number;

    name: string;

    value: number;

    kind: ChartGroupedType;
}