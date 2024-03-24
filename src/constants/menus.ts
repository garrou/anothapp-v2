import { ADD_ICON, FAVORITE_ICON } from "./icons";

export const PAGE_WITHOUT_BOTTOM_NAVBAR = ["home", "login", "register"]

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


export const SERIES_MENU = [
    {
        title: "Ma liste",
        icon: "mdi-format-list-bulleted-square",
        component: "List"
    },
    {
        title: "Continuer",
        icon: "mdi-play",
        component: "Continue"
    },
    {
        title: "Historique",
        icon: "mdi-timeline-clock",
        component: "History"
    },
    {
        title: "Favoris",
        icon: FAVORITE_ICON,
        component: "Favorites"
    }
];
