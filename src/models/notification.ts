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

export type NotificationGroup = "invitations" | "responses" | "activity" | "achievements" | "reminders";

export const NOTIFICATION_GROUPS: Record<NotificationType, NotificationGroup> = {
    friend_request: "invitations",
    playlist_collaborator_invited: "invitations",
    season_watched_with: "invitations",
    friend_accepted: "responses",
    friend_declined: "responses",
    playlist_collaborator_accepted: "responses",
    playlist_collaborator_declined: "responses",
    season_watched_with_accepted: "responses",
    season_watched_with_declined: "responses",
    show_started: "activity",
    show_rated: "activity",
    episode_watched: "activity",
    episode_bulk_watched: "activity",
    actor_favorited: "activity",
    playlist_show_added: "activity",
    playlist_show_removed: "activity",
    achievement_league_unlocked: "activity",
    achievement_unlocked: "achievements",
    episode_upcoming: "reminders",
};

export const NOTIFICATION_GROUP_LABELS: Record<NotificationGroup, string> = {
    invitations: "Invitations",
    responses: "Réponses",
    activity: "Activité",
    achievements: "Succès",
    reminders: "Rappels",
};

export const NOTIFICATION_GROUP_IDS = Object.keys(NOTIFICATION_GROUP_LABELS) as NotificationGroup[];

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
