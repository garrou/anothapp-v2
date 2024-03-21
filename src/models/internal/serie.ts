import type { Season } from "./season";

export interface Serie {

    id: number;

    title: string;

    poster: string;

    favorite: boolean;
}

export interface SerieInfos {

    serie: Serie,

    seasons: Season[],

    time: number
}