import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Shared Vuetify instance for component tests. Default theme/locale are
// fine here since tests assert on markup and behavior, not visual styling.
export const vuetify = createVuetify({
    components,
    directives,
});
