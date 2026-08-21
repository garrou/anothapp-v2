export const THEME_ANOTHAPP = "anothapp";

export const THEME_ANOTHAPP_DARK = "anothappDark";

const THEME_CLASSES = [`v-theme--${THEME_ANOTHAPP}`, `v-theme--${THEME_ANOTHAPP_DARK}`];

/**
 * The app renders without a <v-app> root, so Vuetify never attaches its
 * theme class automatically. Keep the html element's class in sync by hand
 * whenever the active theme changes.
 */
export const applyThemeClass = (name: string): void => {
    document.documentElement.classList.remove(...THEME_CLASSES);
    document.documentElement.classList.add(`v-theme--${name}`);
}
