import type { Season } from "./season";

export interface Serie {

    id: number;

    title: string;

    poster: string;

    favorite: boolean;

    duration: number;

    description?: string;
        
    seasons?: number;
        
    episodes?: number;
        
    network?: string;
        
    note?: number;
        
    status?: string;
        
    creation?: number;
        
    kinds?: string[];
}

export interface SerieInfos {

    serie: Serie;

    seasons: Season[];

    time: number;

    episodes: number;
}