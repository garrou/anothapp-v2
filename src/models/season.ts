interface SeasonDetail {

    addedAt: string;

    id: number;
}

export interface Season {
    
    episodes: number;

    image: string;

    number: number;
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