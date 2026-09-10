import type { NavStatusMenuItem, BottomNavMenuItem, NavOthersMenuItem } from "@/models/menu";
import {
    ADD_ICON,
    CHART_BAR_ICON,
    CHECK_CIRCLE_ICON,
    CLOSE_CIRCLE_ICON,
    FAVORITE_ACTOR_ICON,
    FAVORITE_ICON,
    FRIENDS_ICON,
    PLAY_ICON,
    PLAYLIST_PLAY_ICON
} from "./icons";
import { SerieStatus } from "@/types/types";

export const PAGE_WITHOUT_BOTTOM_NAVBAR = ["home", "login", "register"]

export const NAV_MENU: BottomNavMenuItem[] = [
    {
        title: "Séries",
        icon: "mdi-view-headline",
        link: "/series"
    },
    {
        title: "Ajouter",
        icon: ADD_ICON,
        link: "/discover"
    },
    {
        title: "Amis",
        icon: FRIENDS_ICON,
        link: "/friends"
    },
    {
        title: "Dashboard",
        icon: CHART_BAR_ICON,
        link: "/dashboard"
    }
];

export const NAV_SERIES_STATUS: NavStatusMenuItem[] = [
    {
        title: "Ma liste",
        icon: "mdi-format-list-bulleted-square",
        status: SerieStatus.Watchlist
    },
    {
        title: "Favoris",
        icon: FAVORITE_ICON,
        status: SerieStatus.Favorite
    },
    {
        title: "À continuer",
        icon: PLAY_ICON,
        status: SerieStatus.Continue
    },
    {
        title: "Arrêtées",
        icon: CLOSE_CIRCLE_ICON,
        status: SerieStatus.Stopped
    },
    {
        title: "Terminées",
        icon: CHECK_CIRCLE_ICON,
        status: SerieStatus.Finished
    }
];

export const NAV_OTHERS: NavOthersMenuItem[] = [
    {
        title: "Historique",
        icon: "mdi-timeline-clock",
        link: "/history"
    },
    {
        title: "Mes plateformes",
        icon: "mdi-animation-play",
        link: "/platforms"
    },
    {
        title: "Prochains épisodes",
        icon: "mdi-calendar",
        link: "/calendar"
    },
    {
        title: "Playlists",
        icon: PLAYLIST_PLAY_ICON,
        link: "/playlists"
    },
    {
        title: "Acteurs favoris",
        icon: FAVORITE_ACTOR_ICON,
        link: "/actors/favorites"
    }
];