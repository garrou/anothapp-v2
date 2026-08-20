import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { fr } from "vuetify/locale";

import App from "./App.vue";
import router from "./router";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { useSnackbar } from "@/composables/snackbar";
import { VCalendar } from "vuetify/components";
import cache from "./cache";

const vuetify = createVuetify({
  components: {
    ...components,
    VCalendar,
  },
  directives,
  locale: {
    locale: 'fr',
    messages: { fr }
  },
  theme: {
    defaultTheme: "anothapp",
    themes: {
      anothapp: {
        dark: false,
        colors: {
          background: "#F6F6FA",
          surface: "#FFFFFF",
          "surface-variant": "#F0F0F6",
          "surface-bright": "#FFFFFF",
          primary: "#6C5CE0",
          "primary-darken-1": "#5646B8",
          secondary: "#C98F2A",
          "secondary-darken-1": "#A9761E",
          error: "#D6483A",
          "on-background": "#1C1D26",
          "on-surface": "#1C1D26",
          "on-surface-variant": "#5B5E6E",
        },
        variables: {
          "border-color": "#E2E2EC",
          "border-opacity": 1,
          "medium-emphasis-opacity": 0.7,
        }
      }
    }
  },
  defaults: {
    VCard: { rounded: "lg", elevation: 0, border: true },
    VBtn: { rounded: "lg" },
    VTextField: { variant: "outlined", rounded: "lg" },
    VAppBar: { elevation: 0, border: true },
    VBottomNavigation: { elevation: 0, border: true },
    VNavigationDrawer: { elevation: 0, border: true },
    VChip: { rounded: "lg" },
    VDialog: { transition: "fade-transition" },
  }
});
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);

const snackbar = useSnackbar();

app.config.errorHandler = (err: unknown) => snackbar.showError(err as Error);

cache
.initialize()
.then(() => {
    app.mount("#app");
})
.catch(() => snackbar.showError("Erreur durant l'initialisation de l'application"));