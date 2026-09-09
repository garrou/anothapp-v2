import type { Serie } from "./serie";

export interface Playlist {

    id: number;

    userId: string;

    name: string;

    createdAt: string;

    visible: boolean;

    showsCount?: number;
}

export interface PlaylistDetail {

    playlist: Playlist;

    shows: Serie[];
}
