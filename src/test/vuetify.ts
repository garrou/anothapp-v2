import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { THEME_ANOTHAPP, THEME_ANOTHAPP_DARK } from "@/utils/theme";

// Shared Vuetify instance for component tests. Colors are irrelevant here
// (tests assert on markup and behavior, not visual styling), but the app's
// two named themes must be registered - components that switch to them by
// name (e.g. Settings.vue toggling THEME_ANOTHAPP_DARK) would otherwise hit
// an undefined theme definition inside Vuetify's own CSS-variable generator.
// `attach: true` keeps overlay content (dialogs, menus, tooltips) inline in
// the component's own DOM tree instead of teleporting it to document.body,
// so Vue Test Utils' wrapper.find()/emitted() can see and interact with it.
export const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: THEME_ANOTHAPP,
        themes: {
            [THEME_ANOTHAPP]: { dark: false, colors: {} },
            [THEME_ANOTHAPP_DARK]: { dark: true, colors: {} },
        },
    },
    defaults: {
        VDialog: { attach: true },
        VMenu: { attach: true },
        VTooltip: { attach: true },
        VOverlay: { attach: true },
    },
});
