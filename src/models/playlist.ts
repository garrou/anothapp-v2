import type { Serie } from "./serie";

export interface Playlist {

    id: string;

    userId: string;

    name: string;

    createdAt: string;

    visible: boolean;

    showsCount?: number;

    posters?: string[];
}

export interface PlaylistDetail {

    playlist: Playlist;

    shows: Serie[];
}
