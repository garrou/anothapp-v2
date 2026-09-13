import type { Serie } from "./serie";

export type PlaylistRole = "owner" | "collaborator" | "pending" | "viewer";

export interface Playlist {

    id: string;

    userId: string;

    name: string;

    createdAt: string;

    visible: boolean;

    showsCount?: number;

    posters?: string[];

    role?: PlaylistRole;
}

export interface PlaylistDetail {

    playlist: Playlist;

    shows: Serie[];
}

export interface PlaylistCollaborator {

    id: string;

    username: string;

    picture?: string;

    accepted: boolean;

    invitedAt: string;
}
