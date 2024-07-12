export interface GlobalStat {
    
    monthTime: number;

    totalTime: number;

    nbSeries: number;

    nbSeasons: number;

    nbEpisodes: number;

    bestMonth?: { label: string, value: number };
}

export interface Stat {

    label: string;

    value: number;
}
