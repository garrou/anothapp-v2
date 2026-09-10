import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Shared Vuetify instance for component tests. Default theme/locale are
// fine here since tests assert on markup and behavior, not visual styling.
// `attach: true` keeps overlay content (dialogs, menus, tooltips) inline in
// the component's own DOM tree instead of teleporting it to document.body,
// so Vue Test Utils' wrapper.find()/emitted() can see and interact with it.
export const vuetify = createVuetify({
    components,
    directives,
    defaults: {
        VDialog: { attach: true },
        VMenu: { attach: true },
        VTooltip: { attach: true },
        VOverlay: { attach: true },
    },
});
