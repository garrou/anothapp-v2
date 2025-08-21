import type { NavStatusMenuItem, BottomNavMenuItem, NavOthersMenuItem } from "@/models/menu";
import { ADD_ICON, FAVORITE_ICON } from "./icons";
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
        icon: "mdi-account-heart",
        link: "/friends"
    },
    {
        title: "Dashboard",
        icon: "mdi-chart-bar",
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
        title: "Séries à continuer",
        icon: "mdi-play",
        status: SerieStatus.Continue
    },
    {
        title: "Favoris",
        icon: FAVORITE_ICON,
        status: SerieStatus.Favorite
    },
    {
        title: "Séries arrêtées",
        icon: "mdi-close-circle",
        status: SerieStatus.Stopped
    }
];

export const NAV_OTHERS: NavOthersMenuItem[] = [
    {
        title: "Historique",
        icon: "mdi-play",
        link: "/history"
    },
    {
        title: "Calendrier des ajouts",
        icon: "mdi-calendar",
        link: "/calendar"
    },
    {
        title: "Paramètres",
        icon: "mdi-wrench",
        link: "/settings"
    }
];