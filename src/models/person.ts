import type { Serie } from "./serie";

interface Person {
    
    id: number;

    name: string;
}

export interface Character extends Person {

    actor: string;

    picture?: string;
}

export interface Actor extends Person {

    birthday?: string;

    deathday?: string;

    nationality: string;

    description: string;

    poster?: string;

    series: Serie[];

    movies: Serie[];
}