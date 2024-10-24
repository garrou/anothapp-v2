import type { Season } from "./season";

interface BaseSerie {

    id: number;

    title: string;
}

export interface Serie extends BaseSerie {

    poster: string;

    favorite?: boolean;
        
    kinds: string[];

    duration: number;

    country: string;

    missing?: number;

    description?: string;
        
    seasons?: number;
        
    episodes?: number;
        
    network?: string;
        
    note?: number;
        
    status?: string;
        
    creation?: number;

    platforms?: Platform[];

    addedAt?: string;

    watch?: boolean;

    list?: boolean;
}

export interface Platform {

    id: number;

    name: string;

    logo?: string;
}

export interface SerieInfo {

    serie: Serie;

    seasons: Season[];

    time: number;

    episodes: number;
}

export type Similar = Required<BaseSerie>;

export interface Kind {

    name: string;

    value: string;
}