import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/auth/LoginView.vue")
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/auth/RegisterView.vue")
    },
    {
      path: "/series",
      name: "series",
      component: () => import("../views/series/Series.vue")
    }
  ]
});

export default router;
