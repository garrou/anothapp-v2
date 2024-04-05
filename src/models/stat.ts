export interface GlobalStat {
    
    monthTime: number;

    totalTime: number;

    nbSeries: number;

    nbSeasons: number;

    nbEpisodes: number;

    bestMonth?: { date: string, time: number };
}

export interface Stat {

    label: string;

    value: number;
}

export type ChartGroupedType = "seasons" | "episodes" | "kinds";

export type ChartGroupedPeriod = "years" | "year" | "months";

export type ChartTimeType = "total" | "years" | "month" | "best-month" | "rank";

export type ChartCountType = "shows" | "episodes" | "seasons";
