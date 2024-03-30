interface MenuItem {

    title: string;

    icon: string;
}

export interface BottomNavMenuItem extends MenuItem {

    link: string;
}

export interface AppMenuItem extends MenuItem {

    component?: string;
}