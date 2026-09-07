import type { Platform } from "./serie";
import type { User } from "./user";

export interface SeasonDetail {

    addedAt: string;

    id: number;

    platform: Platform;

    watchedWith: User[];
}

export interface Season {
    
    episodes: number;

    image: string;

    number: number;

    interval?: string;
}

export interface SeasonTimeline {

    addedAt: string;

    season: Season;

    showId: number;

    platformId?: number;

    showTitle: string
}