export const THEME_ANOTHAPP = "anothapp";

export const THEME_ANOTHAPP_DARK = "anothappDark";

const THEME_CLASSES = [`v-theme--${THEME_ANOTHAPP}`, `v-theme--${THEME_ANOTHAPP_DARK}`];

export const applyThemeClass = (name: string): void => {
    document.documentElement.classList.remove(...THEME_CLASSES);
    document.documentElement.classList.add(`v-theme--${name}`);
}
