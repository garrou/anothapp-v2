import type { Platform } from "./serie";

export interface SeasonDetail {

    addedAt: string;

    id: number;

    platform: Platform;
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

    showTitle: string
}