import type { AppMenuItem, BottomNavMenuItem } from "@/types/menu";
import { ADD_ICON, FAVORITE_ICON } from "./icons";

export const PAGE_WITHOUT_BOTTOM_NAVBAR = ["home", "login", "register"]

export const NAV_MENU: BottomNavMenuItem[] = [
    {
        title: "Séries",
        icon: "mdi-view-headline",
        link: "/series"
    },
    {
        title: "Amis",
        icon: "mdi-account-heart",
        link: "/friends"
    },
    {
        title: "Ajouter",
        icon: ADD_ICON,
        link: "/discover"
    },
    {
        title: "Statis",
        icon: "mdi-chart-bar",
        link: "/stats"
    },
    {
        title: "Profil",
        icon: "mdi-account",
        link: "/profile"
    }
];


export const APP_MENU: AppMenuItem[] = [
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
    },
    { 
        title: "Se déconnecter",
        icon: "mdi-logout",
    }
];