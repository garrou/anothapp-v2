export interface Season {

    number: number;

    episodes: number;

    image?: string;
}

interface SeasonDetails {

    id: number;

    addedAt: string;
}

export interface SeasonInfos {

    seasons: SeasonDetails[];

    time: number;
}