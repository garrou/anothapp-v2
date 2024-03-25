interface SeasonDetails {

    addedAt: string;

    id: number;
}

export interface Season {
    
    episodes: number;

    image: string;

    number: number;
}

export interface SeasonInfos {

    seasons: SeasonDetails[];

    time: number;
}

export interface SeasonTimeline {

    addedAt: string;

    season: Season;

    showId: number;

    showTitle: string
}