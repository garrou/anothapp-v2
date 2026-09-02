import type { Season } from "./season";

interface BaseSerie {

    id: number;

    title: string;
}

export interface Serie extends BaseSerie {

    poster?: string;

    favorite?: boolean;
        
    kinds: string[];

    duration: number;

    country: string;

    missing?: number;

    description?: string;
        
    seasons?: number;
        
    episodes?: number;
        
    network?: string;

    language?: string;

    note?: number;
        
    finished: boolean;
        
    creation?: number;

    platforms?: Platform[];

    addedAt?: string;

    watch?: boolean;

    list?: boolean;

    nextEpisode?: string;
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

    distinctEpisodes?: number;
}

export type Similar = Required<BaseSerie>;

export interface Recommendation extends BaseSerie {

    poster?: string;

    kinds: string[];

    duration: number;

    country: string;

    nbFriends: number;

    avgNote: number;

    friends: RecommendationFriend[];
}

export interface RecommendationFriend {

    id: string;

    username: string;

    picture?: string;
}

export interface Kind {

    name: string;

    value: string;
}