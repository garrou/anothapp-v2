export type NotificationType =
    | "show_started"
    | "show_rated"
    | "season_watched_with"
    | "season_watched_with_accepted"
    | "season_watched_with_declined"
    | "episode_watched"
    | "episode_bulk_watched"
    | "actor_favorited"
    | "friend_request"
    | "friend_accepted"
    | "friend_declined"
    | "playlist_collaborator_invited"
    | "playlist_collaborator_accepted"
    | "playlist_collaborator_declined"
    | "playlist_show_added"
    | "playlist_show_removed"
    | "episode_upcoming"
    | "achievement_unlocked"
    | "achievement_league_unlocked";

export type NotificationGroup = "friends" | "activity" | "reminders";

export const NOTIFICATION_GROUPS: Record<NotificationType, NotificationGroup> = {
    friend_request: "friends",
    friend_accepted: "friends",
    friend_declined: "friends",
    playlist_collaborator_invited: "friends",
    playlist_collaborator_accepted: "friends",
    playlist_collaborator_declined: "friends",
    playlist_show_added: "activity",
    playlist_show_removed: "activity",
    show_started: "activity",
    show_rated: "activity",
    season_watched_with: "friends",
    season_watched_with_accepted: "friends",
    season_watched_with_declined: "friends",
    episode_watched: "activity",
    episode_bulk_watched: "activity",
    actor_favorited: "activity",
    episode_upcoming: "reminders",
    achievement_unlocked: "activity",
    achievement_league_unlocked: "activity",
};

export interface NotificationActor {

    id: string;

    username: string;

    picture?: string;
}

export interface NotificationShow {

    id: number;

    title: string;

    poster?: string;
}

export interface Notification {

    id: number;

    type: NotificationType;

    actor?: NotificationActor;

    show?: NotificationShow;

    metadata?: Record<string, string | number>;

    createdAt: string;

    read: boolean;
}

export interface NotificationsResponse {

    notifications: Notification[];
}
