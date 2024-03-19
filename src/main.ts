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
import { useSnackbarStore } from '@/stores/snackbar';

const vuetify = createVuetify({
  components,
  directives,
});
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);

const snackbarStore = useSnackbarStore();

app.config.errorHandler = (err: unknown) => {
  snackbarStore.setError(err as Error);
}
app.mount("#app");