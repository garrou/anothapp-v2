interface SeasonDetail {

    addedAt: string;

    id: number;
}

export interface Season {
    
    episodes: number;

    image: string;

    number: number;

    interval: string;
}

export interface SeasonInfo {

    seasons: SeasonDetail[];

    time: number;
}

export interface SeasonTimeline {

    addedAt: string;

    season: Season;

    showId: number;

    showTitle: string
}