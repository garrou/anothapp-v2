export interface GlobalStat {
    
    monthTime: number;

    totalTime: number;

    nbSeries: number;

    nbSeasons: number;

    nbEpisodes: number;

    bestMonth?: { label: string, value: number }[];
}

export interface Stat {

    label: string;

    value: number;
}

export type ChartGroupedType = "seasons" | "episodes" | "kinds" | "best-months";

export type ChartGroupedPeriod = "years" | "year" | "months";

export type ChartTimeType = "total" | "years" | "month" | "rank";

export type ChartCountType = "shows" | "episodes" | "seasons";
