import type { Platform } from "./serie";
import type { User } from "./user";

export interface WatchedWithFriend extends User {

    status: "accepted" | "declined" | "revoked" | null;
}

export interface SeasonDetail {

    addedAt: string;

    id: number;

    platform: Platform;

    watchedWith: WatchedWithFriend[];
}

export interface WatchTogetherInvite {

    userSeasonId: number;

    showId: number;

    showTitle: string;

    showPoster?: string;

    seasonNumber: number;

    actor: {

        id: string;

        username: string;

        picture?: string;
    };
}

export interface Season {

    episodes: number;

    image: string;

    number: number;

    interval?: string;
}