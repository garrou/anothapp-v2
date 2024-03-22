import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import Series from "@/views/series/Series.vue";
import SerieDetails from "@/views/series/SerieDetails.vue";
import { useUser } from "@/composables/user";
import Discover from "@/views/discover/Discover.vue";

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
      component: LoginView
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView
    },
    {
      path: "/series",
      name: "series",
      component: Series,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/series/:id",
      name: "serie-details",
      component: SerieDetails,
      props: (route) => ({ id: Number(route.params.id) }),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/discover",
      name: "discover",
      component: Discover,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach(async (to, from) => {
  const { checkAuth } = useUser();
  const isLoggedIn = await checkAuth();
  
  if (to.meta.requiresAuth && !isLoggedIn) {
    return {
      path: "/login",
      query: { redirect: to.fullPath }
    }
  } else if (!to.meta.requiresAuth && isLoggedIn) {
    return {
      path: "/series"
    }
  }
});

export default router;
