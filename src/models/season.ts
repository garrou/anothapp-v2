export interface Season {

    number: number;

    episodes: number;

    image?: string;
}

interface SeasonDetails {

    id: number;

    addedAt: Date;
}

export interface SeasonInfos {

    seasons: SeasonDetails[];

    time: number;
}