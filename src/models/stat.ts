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
}

export interface Stat {

    id: number;

    label: string;

    value: number;
}

export interface ChartData {

    id: number;

    name: string;

    value: number;

    kind: ChartGroupedType;
}