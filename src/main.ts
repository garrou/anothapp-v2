import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import allComponents from "@/components/index";

const vuetify = createVuetify({
  components,
  directives
})
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

Object
  .entries(allComponents)
  .forEach(([name, component]) => app.component(name, component));

app.mount("#app")