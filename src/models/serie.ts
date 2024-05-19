import type { Season } from "./season";

interface BaseSerie {

    id: number;

    title: string;
}

export interface Serie extends BaseSerie {

    poster: string;

    favorite: boolean;
        
    kinds: string[];

    duration: number;

    missing: number;

    description?: string;
        
    seasons?: number;
        
    episodes?: number;
        
    network?: string;
        
    note?: number;
        
    status?: string;
        
    creation?: number;
}

export interface SerieInfo {

    serie: Serie;

    seasons: Season[];

    time: number;

    episodes: number;
}

export interface Similar extends BaseSerie {}

export interface Kind {

    name: string;

    value: string;
}