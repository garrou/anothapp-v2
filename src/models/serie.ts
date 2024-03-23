import type { Season } from "./season";

export interface Serie {

    id: number;

    title: string;

    poster: string;

    favorite: boolean;
        
    kinds: string[];

    duration: number;

    description?: string;
        
    seasons?: number;
        
    episodes?: number;
        
    network?: string;
        
    note?: number;
        
    status?: string;
        
    creation?: number;
}

export interface SerieInfos {

    serie: Serie;

    seasons: Season[];

    time: number;

    episodes: number;
}