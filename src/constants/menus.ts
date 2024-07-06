import type { AppMenuItem, BottomNavMenuItem } from "@/models/menu";
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
        title: "Dashboard",
        icon: "mdi-chart-bar",
        link: "/dashboard"
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
        title: "Calendrier",
        icon: "mdi-calendar",
        component: "Calendar"
    },
    { 
        title: "Se déconnecter",
        icon: "mdi-logout",
    }
];
