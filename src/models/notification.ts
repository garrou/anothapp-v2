export type NotificationType =
    | "show_started"
    | "show_rated"
    | "season_watched"
    | "episode_watched"
    | "episode_bulk_watched"
    | "friend_request"
    | "friend_accepted"
    | "friend_declined";

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

    unreadCount: number;
}
