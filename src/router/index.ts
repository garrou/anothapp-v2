import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import Series from "@/views/series/Series.vue";
import SerieDetails from "@/views/series/SerieDetails.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: HomeView
    },
    {
      path: "/login",
      component: LoginView
    },
    {
      path: "/register",
      component: RegisterView
    },
    {
      path: "/series",
      component: Series
    },
    {
      path: "/series/:id",
      component: SerieDetails,
      props: true,
    }
  ]
});

export default router;
