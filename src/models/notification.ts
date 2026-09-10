export type NotificationType =
    | "show_started"
    | "show_rated"
    | "season_watched"
    | "season_watched_with"
    | "episode_watched"
    | "episode_bulk_watched"
    | "actor_favorited"
    | "friend_request"
    | "friend_accepted"
    | "friend_declined"
    | "episode_upcoming"
    | "achievement_unlocked";

export type NotificationGroup = "friends" | "activity" | "reminders";

export const NOTIFICATION_GROUPS: Record<NotificationType, NotificationGroup> = {
    friend_request: "friends",
    friend_accepted: "friends",
    friend_declined: "friends",
    show_started: "activity",
    show_rated: "activity",
    season_watched: "activity",
    season_watched_with: "activity",
    episode_watched: "activity",
    episode_bulk_watched: "activity",
    actor_favorited: "activity",
    episode_upcoming: "reminders",
    achievement_unlocked: "activity",
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
