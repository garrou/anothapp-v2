import type { Platform } from "./serie";
import type { User } from "./user";

export interface WatchedWithFriend extends User {

    status: "pending" | "accepted" | "declined" | "revoked";
}

export interface SeasonDetail {

    addedAt: string;

    id: number;

    platform: Platform;

    watchedWith: WatchedWithFriend[];

    sharedBy: Pick<User, "id" | "username" | "picture"> | null;
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

    // true when the current user owns this season and is sharing it with `actor` (the friend);
    // false when the current user is `actor`'s friend, watching alongside the season's owner.
    isOwner: boolean;
}

export interface Season {

    episodes: number;

    image: string;

    number: number;

    interval?: string;
}