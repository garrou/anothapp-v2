import type { SerieStatus } from "@/types/types";

interface MenuItem {

    title: string;

    icon: string;
}

export interface BottomNavMenuItem extends MenuItem {

    link: string;
}

export interface NavStatusMenuItem extends MenuItem {

    status: SerieStatus;
}

export interface NavOthersMenuItem extends MenuItem {

    link: string;
}