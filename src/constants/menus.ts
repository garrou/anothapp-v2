import { ADD_ICON, FAVORITE_ICON } from "./icons";

export const SERIES_MENU = [
    {
        title: "Ma liste",
        icon: "mdi-format-list-bulleted-square"
    },
    {
        title: "Continuer",
        icon: "mdi-play"
    },
    {
        title: "Historique",
        icon: "mdi-timeline-clock"
    },
    {
        title: "Favoris",
        icon: FAVORITE_ICON
    }
];

export const NAV_MENU = [
    {
        title: "Mes séries",
        icon: "mdi-view-headline",
        link: "/series"
    },
    {
        title: "Ajouter",
        icon: ADD_ICON,
        link: "/discover"
    },
    {
        title: "Statistiques",
        icon: "mdi-chart-bar",
        link: "/stats"
    },
    {
        title: "Mon profil",
        icon: "mdi-account",
        link: "/profile"
    }
];

export const PAGE_WITHOUT_BOTTOM_NAVBAR = ["home", "login", "register"]