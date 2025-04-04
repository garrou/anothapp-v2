import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { useSnackbar } from "@/composables/snackbar";
import { views } from "./views";
import { VCalendar } from "vuetify/labs/VCalendar";
import cache from "./cache";

const vuetify = createVuetify({
  components: {
    ...components,
    VCalendar,
  },
  directives,
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
    Object.entries(views).forEach(([name, component]) => app.component(name, component));
    app.mount("#app");
})
.catch(() => snackbar.showError("Erreur durant l'initialisation de l'application"));