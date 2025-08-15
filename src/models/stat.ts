import { ChartGroupedType } from "@/types/types";

export interface GlobalStat {
    
    monthTime: number;

    totalTime: number;

    nbSeries: number;

    nbSeasons: number;

    nbEpisodes: number;

    bestMonth?: { label: string, value: number };
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