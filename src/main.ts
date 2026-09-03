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
import storageService from "@/services/storageService";
import { THEME_ANOTHAPP, THEME_ANOTHAPP_DARK, applyThemeClass } from "@/utils/theme";

const vuetify = createVuetify({
  components: {
    ...components,
  },
  directives,
  locale: {
    locale: 'fr',
    messages: { fr }
  },
  theme: {
    defaultTheme: THEME_ANOTHAPP,
    themes: {
      [THEME_ANOTHAPP]: {
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
          success: "#1BAF7A",
          info: "#2A78D6",
          "on-background": "#1C1D26",
          "on-surface": "#1C1D26",
          "on-surface-variant": "#5B5E6E",
        },
        variables: {
          "border-color": "#E2E2EC",
          "border-opacity": 1,
          "medium-emphasis-opacity": 0.7,
        }
      },
      [THEME_ANOTHAPP_DARK]: {
        dark: true,
        colors: {
          background: "#131022",
          surface: "#1C1830",
          "surface-variant": "#241F3B",
          "surface-bright": "#241F3B",
          primary: "#9C8CFF",
          "primary-darken-1": "#7C6AE8",
          secondary: "#E0A94A",
          "secondary-darken-1": "#C79138",
          error: "#F0776A",
          success: "#3FCB98",
          info: "#5B9EEE",
          "on-background": "#F1EFFA",
          "on-surface": "#F1EFFA",
          "on-surface-variant": "#A79FC2",
        },
        variables: {
          "border-color": "#34304C",
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

const storedTheme = storageService.getTheme() ?? THEME_ANOTHAPP;
vuetify.theme.global.name.value = storedTheme;
applyThemeClass(storedTheme);

const snackbar = useSnackbar();

app.config.errorHandler = (err: unknown) => snackbar.showError(err as Error);

app.mount("#app");